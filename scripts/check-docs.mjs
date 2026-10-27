import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const images = [".png", ".jpg", ".jpeg", ".svg"];
const documents = [".md", ".docx", ".pdf"];
const tables = [".xlsx", ".csv"];

// Specific folders override the policy of their parent folder.
export const extensionRules = [
  ["docs/design/adr/", [".md"]],
  ["docs/ai-usage/", [".md"]],
  ["docs/management/weekly/", [".md", ".docx"]],
  ["docs/management/", [...documents, ...tables, ...images]],
  ["docs/requirements/", [...documents, ...images, ".drawio"]],
  ["docs/design/", [...documents, ...images, ".mmd", ".drawio"]],
  ["docs/test/", [...documents, ...tables, ...images]],
  ["docs/WBS/", [...documents, ...tables, ...images, ".html"]],
  ["pa/", [...documents, ...images, ".tex", ".bib", ".sty", ".cls"]],
];

export function extensionError(file) {
  if (basename(file) === ".gitkeep") return;
  const rule = extensionRules.find(([folder]) => file.startsWith(folder));
  if (!rule) return `${JSON.stringify(file)}: no document-folder extension rule`;
  if (!rule[1].includes(extname(file).toLowerCase())) {
    return `${JSON.stringify(file)}: allowed extensions in ${rule[0]}: ${rule[1].join(", ")}`;
  }
}

function gitFiles(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).split("\0").filter(Boolean);
}

export function selectFiles(cwd, base) {
  const tracked = gitFiles(cwd, ["ls-files", "-z", "--", "README.md", "docs/", "pa/"]).filter(
    (file) => existsSync(resolve(cwd, file)),
  );
  const changed =
    !base || /^0+$/.test(base)
      ? new Set(tracked)
      : new Set(
          gitFiles(cwd, [
            "diff",
            "--name-only",
            "-z",
            "--diff-filter=ACMR",
            base,
            "--",
            "README.md",
            "docs/",
            "pa/",
          ]),
        );
  return {
    documents: tracked.filter((file) => file.startsWith("docs/") || file.startsWith("pa/")),
    markdown: tracked.filter((file) => changed.has(file) && extname(file).toLowerCase() === ".md"),
  };
}

export function checkDocs({
  cwd = process.cwd(),
  base,
  prettierCli = process.env.PRETTIER_CLI,
} = {}) {
  const { documents: files, markdown } = selectFiles(cwd, base);
  const errors = files.map(extensionError).filter(Boolean);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(`Extensions: ${files.length} tracked document files passed.`);
  if (!markdown.length) {
    console.log("Format: no changed Markdown files.");
    return;
  }
  console.log(
    `Format: checking ${markdown.length} Markdown files${base ? " against " + base : " (full scan)"}.`,
  );
  execFileSync(
    process.execPath,
    [
      prettierCli || resolve(cwd, "node_modules/prettier/bin/prettier.cjs"),
      "--config",
      fileURLToPath(new URL("../.github/docs-prettier.json", import.meta.url)),
      "--no-editorconfig",
      "--check",
      ...markdown,
    ],
    { cwd, stdio: "inherit" },
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values } = parseArgs({ options: { base: { type: "string" } } });
    checkDocs({ base: values.base });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
