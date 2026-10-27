import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { checkDocs, extensionError, selectFiles } from "./check-docs.mjs";

test("folder extension rules allow free names and apply specific overrides", () => {
  for (const file of [
    "docs/design/adr/any decision name.MD",
    "docs/ai-usage/Anyone/notes without a PA number.md",
    "docs/management/weekly/any weekly report.docx",
    "docs/management/grant chart.PNG",
    "docs/design/diagrams/context.mmd",
    "docs/requirements/mockups/ảnh màn hình.png",
    "docs/test/test cases.xlsx",
    "docs/WBS/work breakdown.html",
    "pa/any phase/arbitrary source.tex",
    "pa/any phase/images/figure.png",
    "pa/PA3/.gitkeep",
  ])
    assert.equal(extensionError(file), undefined, file);

  for (const file of [
    "docs/design/adr/decision.docx",
    "docs/design/adr/decision.pdf",
    "docs/ai-usage/Anyone/log.png",
    "docs/management/weekly/report.pdf",
    "docs/design/document.md.exe",
    "docs/unknown/report.md",
    "pa/any phase/application.exe",
  ])
    assert.ok(extensionError(file), file);
});

function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), "campusborrow-docs-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync(
      "git",
      [
        "-c",
        "core.autocrlf=false",
        "-c",
        "commit.gpgsign=false",
        "-c",
        "user.name=Docs test",
        "-c",
        "user.email=docs-test@example.invalid",
        ...args,
      ],
      { cwd, encoding: "utf8", stdio: "pipe" },
    );
  const write = (file, content) => {
    mkdirSync(dirname(join(cwd, file)), { recursive: true });
    writeFileSync(join(cwd, file), content);
  };
  git("init", "--quiet");
  write("README.md", "# Example\n");
  write("docs/management/weekly/history.md", "# Historical report\n");
  write("docs/design/remove me.md", "# Remove\n");
  write("docs/design/old name.md", "# Rename\n");
  git("add", ".");
  git("commit", "--quiet", "-m", "test baseline");
  return { cwd, git, write, base: git("rev-parse", "HEAD").trim() };
}

test("selection includes changed/new/renamed tracked Markdown, not deleted or untracked files", (t) => {
  const { cwd, git, write, base } = fixture(t);
  write("README.md", "# Updated\n");
  write("docs/design/new notes.md", "# New\n");
  git("add", "docs/design/new notes.md");
  git("mv", "docs/design/old name.md", "docs/design/new name.md");
  rmSync(join(cwd, "docs/design/remove me.md"));
  write("docs/design/local only.md", "# Local\n");
  const files = selectFiles(cwd, base);
  assert.deepEqual(files.markdown.sort(), [
    "README.md",
    "docs/design/new name.md",
    "docs/design/new notes.md",
  ]);
  assert.ok(!files.documents.includes("docs/design/remove me.md"));
  assert.ok(!files.documents.includes("docs/design/local only.md"));
  assert.ok(files.documents.includes("docs/management/weekly/history.md"));
});

test("absent or all-zero base performs a full scan; invalid base fails", (t) => {
  const { cwd } = fixture(t);
  assert.equal(selectFiles(cwd).markdown.length, 4);
  assert.equal(selectFiles(cwd, "0".repeat(40)).markdown.length, 4);
  assert.throws(() => selectFiles(cwd, "missing-base-ref"));
});

test("checker propagates format errors and ignores unchanged historical formatting", (t) => {
  const { cwd, git, write, base } = fixture(t);
  const prettierCli = process.env.PRETTIER_CLI || resolve("node_modules/prettier/bin/prettier.cjs");
  write("docs/management/weekly/history.md", "# Bad baseline\n\n-   existing item\n");
  git("add", ".");
  git("commit", "--quiet", "-m", "existing legacy formatting");
  const legacyBase = git("rev-parse", "HEAD").trim();
  write("docs/design/new notes.md", "# New\n\n-   unformatted item\n");
  git("add", "docs/design/new notes.md");
  assert.throws(() => checkDocs({ cwd, base: legacyBase, prettierCli }));
  write("docs/design/new notes.md", "# New\n\n- unformatted item\n");
  assert.doesNotThrow(() => checkDocs({ cwd, base: legacyBase, prettierCli }));
  assert.throws(() => checkDocs({ cwd, base, prettierCli }));
});
