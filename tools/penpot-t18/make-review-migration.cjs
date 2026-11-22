// Regenerate the v4.1/v5 -> v5.1 patch from the reviewed, committed baseline.
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const { execFileSync } = require("node:child_process");
function baseline(file, requireFn, ref = "3621dd8") {
  const module = { exports: {} };
  vm.runInNewContext(
    execFileSync("git", ["show", ref + ":tools/penpot-t18/" + file], {
      encoding: "utf8",
    }),
    { module, require: requireFn, structuredClone },
  );
  return module.exports;
}
const oldBase = baseline("design.cjs");
const oldProto = baseline("prototype.cjs", () => oldBase);
const next = [...require("./design.cjs").boards, ...require("./prototype.cjs").boards];
const patches = [];
function walk(before, after, route, changes) {
  if (before.length > after.length) throw Error("Migration cannot remove layers");
  before.forEach((b, i) => {
    const a = after[i];
    if (b.type !== a.type) throw Error("Layer order changed");
    const key = { name: b.name, type: b.type };
    if (b.children) {
      if (b.name !== a.name || b.children.length !== a.children.length)
        throw Error("Group structure changed");
      walk(b.children, a.children, [...route, key], changes);
    } else if (JSON.stringify(b) !== JSON.stringify(a))
      changes.push({ route, before: b, after: a });
  });
}
for (const b of [...oldBase.boards, ...oldProto.boards]) {
  const a = next.find((n) => n.id === b.id),
    changes = [];
  walk(b.layers, a.layers, [], changes);
  const additions = a.layers.slice(b.layers.length);
  if (changes.length || additions.length || b.height !== a.height)
    patches.push({
      id: b.id,
      beforeHeight: b.height,
      afterHeight: a.height,
      changes,
      additions,
    });
}
if (require.main === module) {
  fs.writeFileSync(path.join(__dirname, "review-v5.json"), JSON.stringify(patches, null, 2) + "\n");
  console.log("Review migration:", patches.length, "existing boards");
}
module.exports = { oldBase, oldProto, baseline };
