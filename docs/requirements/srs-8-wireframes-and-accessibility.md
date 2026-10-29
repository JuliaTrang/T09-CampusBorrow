# PA2 SRS – draft for WBS 2.3.8 (§8 Prototype / Mockups)

Paste-ready Table 9, accessibility audit and prototype link for §8. The mockups are Figma frames, one per screen, with clickable prototype links. The PNG files in `mockups/` are the same screens exported from the HTML source, kept in the repository as a backup.

## 8.1 Screens (Table 9)

Figma file: [CampusBorrow T09 – SRS PA2 wireframes](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc). Page "SRS §8 Wireframes".

| Screen                      | Related use case(s)                          | Mockup / link                                                                                                                                                                 |
| :-------------------------- | :------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S01 Sign in                 | UC-01 Login                                  | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=13-2) · [PNG](mockups/wf-S01-sign-in-1280.png)                                                            |
| S02 Accounts (Admin)        | UC-02 Account management                     | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=2-2) · [PNG](mockups/wf-S02-accounts-1280.png)                                                            |
| S03 Catalogue               | UC-03 View and manage catalogue              | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=3-2) · [PNG](mockups/wf-S03-catalogue-1280.png)                                                           |
| S04 Request equipment       | UC-04 Request equipment                      | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=4-2) · [PNG](mockups/wf-S04-request-equipment-1280.png)                                                   |
| S05 Loan requests (Manager) | UC-05 Approve loan                           | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=5-2) · [PNG](mockups/wf-S05-loan-requests-1280.png)                                                       |
| S06 Handover and return     | UC-06 Handover and return                    | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=6-2) · [PNG](mockups/wf-S06-handover-return-1280.png)                                                     |
| S07 Room schedule           | UC-07 Room schedule view and booking request | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=7-2) · [PNG 1280](mockups/wf-S07-room-schedule-1280.png), [PNG 360](mockups/wf-S07-room-schedule-360.png) |
| S07b Room under maintenance | UC-07 (exception E1)                         | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=8-2) · [PNG](mockups/wf-S07b-room-maintenance-1280.png)                                                   |
| S08 Request a room booking  | UC-07 (including error states E2–E6)         | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=9-2) · [PNG 1280](mockups/wf-S08-book-room-1280.png), [PNG 360](mockups/wf-S08-book-room-360.png)         |
| S09 Room requests (Manager) | UC-08 Approve and cancel room booking        | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=10-2) · [PNG](mockups/wf-S09-room-requests-1280.png)                                                      |
| S10 My requests (Borrower)  | UC-04, UC-06 (cancel before handover), UC-08 | [Figma](https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc?node-id=11-2) · [PNG](mockups/wf-S10-my-requests-1280.png)                                                        |

Notes:

1. The screens cover the three roles: Borrower (S03, S04, S07, S08, S10), Resource Manager (S05, S06, S09) and Admin (S02). S01 and S03 serve everyone. All screens use one layout: a left navigation, a page header with the use case tags, and cards. The 360 px layout (PNG) puts the navigation above the content.
2. Equipment screens S04, S05 and S06 are drawn from the PA1 scope and the task list. Check them against the UC-04 to UC-06 specifications when those are merged. Screens for UC-09 (history and state correction) are not drawn yet.
3. The sample data uses Vietnamese names, and one long item name (S03) to show that the layout holds.

## 8.2 Accessibility audit

Scope: the 11 screens above, on the HTML source of the mockups. Method and result:

| Check                                 | Method                                                                                                                                                          | Result                                                           |
| :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| WCAG 2.1 A and AA rules               | axe-core 4.10.0 (tags wcag2a, wcag2aa, wcag21a, wcag21aa) run in Chromium on each screen at 1280 px, and S07 and S08 also at 360 px                             | 0 violations                                                     |
| Text and control contrast             | Ratios computed from the colour tokens (table below)                                                                                                            | All text pairs ≥ 5.17:1; input border 4.76:1 (needs ≥ 3:1)       |
| Labels                                | Every input, select and textarea has a visible `<label for>`; errors use `aria-invalid`, `aria-describedby` and `role="alert"`                                  | Pass (axe rules `label` and `aria-valid-attr`)                   |
| Horizontal scroll and cut-off content | Script at 360, 768 and 1280 px on all 11 screens: page scroll width against viewport, and elements past the right edge (tables scroll inside their own wrapper) | 0 screens with horizontal scroll, 0 elements past the right edge |
| Touch target size                     | Script at the same widths: height of buttons, navigation links, sign-out button and skip link                                                                   | 0 controls under 44 px                                           |
| Semantics                             | Landmarks `aside`, `nav`, `main`; skip link; table headers with `th scope`; decorative icons hidden from assistive technology                                   | Pass                                                             |

Colour tokens (contrast of text on its background):

| Use                   | Colours            | Ratio |
| :-------------------- | :----------------- | :---- |
| Body text             | #0f172a on #ffffff | 17.85 |
| Muted text on white   | #475569 on #ffffff | 7.58  |
| Muted text on page    | #475569 on #f8fafc | 7.24  |
| Link, active nav item | #1e40af on #eff6ff | 8.01  |
| Primary button label  | #ffffff on #2563eb | 5.17  |
| Success chip          | #047857 on #ecfdf5 | 5.21  |
| Warning chip          | #92400e on #fffbeb | 6.84  |
| Error chip            | #b91c1c on #fef2f2 | 5.91  |
| Error alert text      | #7f1d1d on #fef2f2 | 9.16  |
| Warning alert text    | #78350f on #fffbeb | 8.75  |
| Info alert text       | #1e3a8a on #eff6ff | 9.52  |
| Input border          | #64748b on #ffffff | 4.76  |
| Disabled button label | #475569 on #e2e8f0 | 6.15  |

Not done yet: a manual keyboard-only walkthrough of the booking flow, and a screen-reader pass. Automated rules find only part of the issues, so NFR-11 is not closed until those are done. The audit ran on the HTML source; the Figma frames were captured from it, and a few date, time and password values were typed in by hand because the capture left them empty.

## 8.3 Interactive prototype

| Item                    | Value                                                                                                                                                         |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Figma file              | https://www.figma.com/design/xgOD9kWskBM4XbTyX26HGc                                                                                                           |
| Prototype link (view)   | https://www.figma.com/proto/xgOD9kWskBM4XbTyX26HGc?node-id=13-2&starting-point-node-id=13-2 (open it after sharing is set, and confirm that it starts at S01) |
| Flows (starting points) | "Sign in then browse" from S01; "Equipment request" from S04; "Room booking" from S07                                                                         |
| Clickable links         | The left navigation on S02 to S10; sign-in to S03; S03 "Request" to S04 and "View schedule" to S07 or S07b; S04 submit to S10; S07 to S08; S08 submit to S10  |

Before PA2 is submitted, set the Figma sharing to "anyone with the link can view" and open the link in a private browser window to check it.
