const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const data = require("./design.cjs");
const prototype = require("./prototype.cjs");
const out = path.join(__dirname, "dist");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(
  path.join(__dirname, "Start-Penpot.cmd"),
  '@echo off\r\n"' +
    process.execPath +
    '" "%~dp0build.cjs"\r\nif errorlevel 1 exit /b 1\r\n"' +
    process.execPath +
    '" "%~dp0serve.cjs"\r\npause\r\n',
);
const expected = [
  ...fs
    .readFileSync(path.join(__dirname, "../../docs/design/screen-specifications/README.md"), "utf8")
    .matchAll(/^\| (S\d{2}-\d{2})\s*\|/gm),
].map((m) => m[1]);
const nodes = data.boards.flatMap((b) => flatten(b.layers));
function flatten(a) {
  return a.flatMap((x) => [x, ...flatten(x.children || [])]);
}
for (const id of expected)
  assert(
    nodes.some((n) => n.name.startsWith(id)),
    `Missing control ${id}`,
  );
for (const b of data.boards)
  for (const n of flatten(b.layers))
    if (n.type !== "group") {
      assert(
        n.x >= 0 && n.y >= 0 && n.x + n.w <= b.width && n.y + n.h <= b.height,
        `${b.id}: outside board: ${n.name}`,
      );
      if (n.type === "text") assert(n.h >= n.size * 1.1, `${b.id}: text height: ${n.name}`);
    }
fs.writeFileSync(
  path.join(out, "plugin.js"),
  "const DATA=" +
    JSON.stringify(data) +
    ";\nconst PROTOTYPE=" +
    JSON.stringify(prototype) +
    ";\nconst REVIEW_PATCH=" +
    fs.readFileSync(path.join(__dirname, "review-v5.json"), "utf8") +
    ";\n" +
    fs.readFileSync(path.join(__dirname, "plugin-runtime.js"), "utf8") +
    "\n" +
    fs.readFileSync(path.join(__dirname, "prototype-runtime.js"), "utf8") +
    "\n" +
    fs.readFileSync(path.join(__dirname, "review-runtime.js"), "utf8"),
);
fs.copyFileSync(path.join(__dirname, "ui.html"), path.join(out, "ui.html"));
fs.writeFileSync(
  path.join(out, "manifest.json"),
  JSON.stringify(
    {
      name: "CampusBorrow T18 editable screens",
      description:
        "Creates six editable PA3 boards in the designated CampusBorrow file. No credentials or image flattening.",
      version: 2,
      code: "plugin.js?v=5",
      permissions: ["content:read", "content:write"],
    },
    null,
    2,
  ),
);
const esc = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
function svgNode(n) {
  if (n.type === "group")
    return `<g aria-label="${esc(n.name)}">${n.children.map(svgNode).join("")}</g>`;
  if (n.type === "rect")
    return `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.r}" fill="${n.fill}" stroke="${n.stroke || "none"}"/>`;
  const lines = n.text.split("\n");
  return `<text font-family="Arial,sans-serif" font-size="${n.size}" font-weight="${n.weight}" fill="${n.color}"${n.align === "center" ? ' text-anchor="middle"' : ""}>${lines.map((s, i) => `<tspan x="${n.x + (n.align === "center" ? n.w / 2 : 0)}" y="${n.y + n.size + i * n.size * 1.35}">${esc(s)}</tspan>`).join("")}</text>`;
}
for (const b of [...data.boards, ...prototype.boards]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${b.width}" height="${b.height}" viewBox="0 0 ${b.width} ${b.height}"><rect width="100%" height="100%" fill="${data.C.bg}"/>${b.layers.map(svgNode).join("")}</svg>`;
  fs.writeFileSync(path.join(out, b.id + ".svg"), svg);
}
console.log(
  JSON.stringify(
    {
      boards: data.boards.length,
      controls: expected.length,
      text: nodes.filter((n) => n.type === "text").length,
      rectangles: nodes.filter((n) => n.type === "rect").length,
      links: nodes.filter((n) => n.target).length,
      prototypeBoards: prototype.boards.length,
      prototypeInteractions: prototype.bindings.length,
      output: out,
    },
    null,
    2,
  ),
);
