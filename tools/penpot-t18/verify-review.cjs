const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { execFileSync } = require("node:child_process");
const { harness } = require("./verify.cjs");
const { oldBase, oldProto } = require("./make-review-migration.cjs");
const legacy =
  "const DATA=" +
  JSON.stringify(oldBase) +
  ";const PROTOTYPE=" +
  JSON.stringify(oldProto) +
  ";" +
  ["plugin-runtime.js", "prototype-runtime.js"]
    .map((f) =>
      execFileSync("git", ["show", "3621dd8:tools/penpot-t18/" + f], { encoding: "utf8" }),
    )
    .join("\n");
const next = fs.readFileSync(path.join(__dirname, "dist/plugin.js"), "utf8");
const flat = (a) => a.flatMap((n) => [n, ...flat(n.children || [])]);
const links = (nodes) =>
  nodes.flatMap((n) =>
    n.interactions.map((i) => [n.id, i.trigger, i.action.type, i.action.destination?.id]),
  );
const snapshot = (nodes) =>
  nodes.map((n) => [n.id, n.name, n.characters, n.x, n.y, n.width, n.height]);
(async () => {
  const run = harness("cf924903-cff3-81f4-8008-fbc7ae1bf610", false, legacy);
  await run.run();
  await run.run("prototype");
  assert.equal(run.messages.at(-1).type, "done");
  const originalIds = run.nodes.map((n) => n.id),
    oldLinks = links(run.nodes);
  const custom = run.nodes.find(
    (n) => n.type === "text" && n.characters === "Enter username or email",
  );
  custom.characters = "User edit retained";
  run.upgrade(next);
  await run.run("review");
  assert.equal(run.messages.at(-1).type, "done", JSON.stringify(run.messages.at(-1)));
  assert(originalIds.every((id) => run.nodes.some((n) => n.id === id)));
  const currentLinks = links(run.nodes).map((x) => JSON.stringify(x));
  assert(oldLinks.every((x) => currentLinks.includes(JSON.stringify(x))));
  assert.equal(custom.characters, "User edit retained");
  const defs = [...require("./design.cjs").boards, ...require("./prototype.cjs").boards];
  for (const d of defs.filter((d) =>
    ["S04", "S05", "S06", "S09", "S05_A", "S06_A", "S09_A", "PICKUP_EDIT", "EQ_REASON_A"].includes(
      d.id,
    ),
  )) {
    const b = run.nodes.find(
      (n) =>
        n.type === "board" &&
        (n.name.startsWith(d.id + " /") || n.getPluginData("campusborrow-t18-prototype") === d.id),
    );
    assert.equal(b.height, d.height);
    const actual = flat(b.children).filter((n) => n.type === "text");
    for (const t of flat(d.layers).filter((n) => n.type === "text"))
      assert(
        actual.some(
          (n) =>
            n.name === t.name &&
            n.characters === t.text &&
            Math.abs(n.x - b.x - t.x) < 1 &&
            Math.abs(n.y - b.y - t.y) < 1,
        ),
        d.id + " missing " + t.name,
      );
  }
  const after = snapshot(run.nodes),
    afterLinks = links(run.nodes);
  await run.run("review");
  assert.equal(run.messages.at(-1).type, "done", JSON.stringify(run.messages.at(-1)));
  assert.deepEqual(snapshot(run.nodes), after);
  assert.deepEqual(links(run.nodes), afterLinks);
  const conflict = harness("cf924903-cff3-81f4-8008-fbc7ae1bf610", false, legacy);
  await conflict.run();
  await conflict.run("prototype");
  conflict.nodes.find((n) => n.name === "S06-02 / Pickup window").characters =
    "User changed pickup";
  const untouched = snapshot(conflict.nodes);
  conflict.upgrade(next);
  await conflict.run("review");
  assert.equal(conflict.messages.at(-1).type, "error");
  assert.deepEqual(snapshot(conflict.nodes), untouched);
  console.log(
    "v4.1 -> v5 migration passed: original IDs/links, fields in role variants, user edits, idempotence and conflict preflight.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
