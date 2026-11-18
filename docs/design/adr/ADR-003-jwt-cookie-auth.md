# ADR-003: Authentication – JWT cookie with bcrypt and token revocation

- **Status:** Accepted (closes I-05)
- **Date:** 2026-11-17
- **Deciders:** Team T09 (TetraBo)
- **Refines:** ADR-001 (authentication row). Keeps the JWT + bcrypt choice of ADR-001 and adds the measures below so that the PA2 rules still hold.
- **Drivers:** FR-01-01 – FR-01-07, BR-07, BR-10, NFR-04, NFR-05
- **Affects:** CMP-01, SD-01, ERD-01

## Context

- BR-07 allows passwords of 15 – 64 characters, including spaces and Vietnamese or other multibyte characters, with no trimming or silent truncation.
- BR-10 sets a 24-hour login with no renewal. Logout revokes only the current token while other devices stay signed in (FR-01-02, AC-01-02). Deactivation, role change and password reset revoke all of the target's tokens, and reactivation never restores them.
- NFR-04 requires an HttpOnly, Secure cookie and no plaintext password or token in the database, logs or repository. NFR-05 requires a deactivated account to receive 401 on its next request.
- The team uses a stateless JWT with bcrypt and no server-side session store. Two gaps must be closed: bcrypt uses only the first 72 bytes of its input (a 64-character Vietnamese password can exceed this), and a JWT stays valid until it expires unless the server checks something.

## Decision

- **Password hashing.** bcrypt (cost 12) on `base64(SHA-256(password))`. The password is the exact UTF-8 input, never trimmed. The 44-character pre-hash is always below the 72-byte limit, so no password is truncated. Length 15 – 64 is checked in characters before hashing. One `PasswordHasher` function in `AuthService` is used for registration, Admin creation, reset and sign-in.
- **Token.** At sign-in the API issues a JWT signed with HS256. Claims: `sub` (account id), `jti` (random UUID), `tv` (token version), `iat` and `exp = iat + 24 h`. There is no refresh token and no renewal.
- **Cookie.** `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age` 24 h. The token is never placed in `localStorage` or a URL.
- **`SessionGuard`** (kickoff class name kept). It verifies the signature and `exp` using `Clock`, then loads the account by `sub`. It returns 401 when the account is missing or `INACTIVE`, when `tv ≠ accounts.token_version`, or when the `jti` is in `revoked_tokens`. The role is read from the database, not from the token, and `RolesGuard` returns 403 when the role is not allowed.
- **Logout (one device).** Insert the token's `jti` into a new table `revoked_tokens` (`jti` PK, `account_id`, `expires_at` = the token's `exp`) and clear the cookie. The account's other tokens stay valid (AC-01-02).
- **Revoke all.** Deactivation, role change and password reset increment `accounts.token_version` in the same transaction as the change, so every earlier token fails. Reactivation does not restore the old version.
- **Sign-in.** The identifier is trimmed and lower-cased (BR-06), and every failure returns the same generic message. When the account does not exist, a dummy bcrypt comparison still runs so the response time does not reveal it.
- **Secrets.** The JWT secret lives only in Vercel and GitHub environment settings. Passwords and tokens are redacted from logs and never written to history (BR-19).
- **First Admin.** Created by a setup seed script from environment variables (FR-09-08).

## Alternatives considered

- **Server-side session table with opaque tokens:** meets every rule, but the team prefers the stateless JWT chosen in ADR-001.
- **Logout by incrementing `token_version`:** no extra table, but it signs out every device and would change FR-01-02, AC-01-02 and BR-10.
- **Logout by clearing the cookie only:** a copied token stays valid until `exp`, which fails FR-01-02 and the NFR-04 logout-reuse test.
- **Plain bcrypt:** silently truncates long multibyte passwords (BR-07, I-05). Rejecting passwords over 72 bytes would change BR-07 and AC-01-06.
- **Argon2id:** has no length limit, but it needs a native module on serverless functions and the team already knows bcrypt.

## Consequences

- **Positive:** no session store. BR-07, BR-10, NFR-04 and NFR-05 hold, and the ADR-001 stack is unchanged.
- **Negative:** every protected request still reads the account row and checks the denylist (one indexed lookup each), which NFR-05 needs anyway. The pre-hash must be applied identically everywhere. Rotating the JWT secret signs out every user.
- **Follow-up:** the column `accounts.token_version` and the table `revoked_tokens` (class `RevokedToken`) must first be added to the kickoff glossary (renaming rule), then to ERD-01, CD-01 (`AuthModule`) and SD-01. The scheduled job in ADR-005 deletes denylist rows that have expired.
