const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const base = require("./design.cjs"),
  proto = require("./prototype.cjs");
const { harness } = require("./verify.cjs");
const all = [...base.boards, ...proto.boards],
  byId = new Map(all.map((b) => [b.id, b]));
const flat = (a) => a.flatMap((n) => [n, ...flat(n.children || [])]);
const snapshot = (run) =>
  run.nodes.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    text: s.characters,
    x: s.x,
    y: s.y,
    width: s.width,
    height: s.height,
  }));
(async () => {
  assert.equal(byId.size, all.length, "Duplicate board IDs");
  for (const edge of proto.bindings) {
    assert(byId.has(edge.board));
    if (edge.action.target) assert(byId.has(edge.action.target));
    assert.notEqual(edge.board, edge.action.target);
    assert.equal(
      flat(byId.get(edge.board).layers).filter((n) => n.type === "group" && n.name === edge.name)
        .length,
      1,
      JSON.stringify(edge),
    );
  }
  for (const b of proto.boards) {
    for (const n of flat(b.layers).filter((n) => n.type !== "group")) {
      assert(
        n.x >= 0 && n.y >= 0 && n.x + n.w <= b.width && n.y + n.h <= b.height,
        `${b.id}: outside board ${n.name}`,
      );
      if (n.type === "text")
        assert(
          n.text.split("\n").length * n.size * 1.35 <= n.h + 1,
          `${b.id}: text height ${n.name}: ${n.text.split("\n").length * n.size * 1.35} > ${n.h}`,
        );
    }
  }
  // Every extra screen must be reachable from the review entry (including core-board routes).
  const reached = new Set(["REVIEW"]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of proto.bindings)
      if (reached.has(e.board) && e.action.target && !reached.has(e.action.target)) {
        reached.add(e.action.target);
        changed = true;
      }
  }
  assert.deepEqual(
    proto.boards.filter((b) => !reached.has(b.id)).map((b) => b.id),
    [],
    "Orphan prototype screens",
  );
  assert(
    proto.bindings.filter((b) => b.action.type === "close-overlay").length > 0,
    "Dialogs need cancellation",
  );
  assert.equal(proto.boards.find((b) => b.id === "EXPIRED_DETAIL").contract.cause, "SYSTEM_EXPIRY");
  for (const b of proto.boards.filter((b) => b.role === "A"))
    assert(
      !proto.bindings.some((e) => e.board === b.id && e.action.target === "CONFIRM_PICKUP"),
      "Admin must not change pickup",
    );
  const run = harness("cf924903-cff3-81f4-8008-fbc7ae1bf610");
  await run.run();
  assert.equal(run.messages.at(-1).type, "done", JSON.stringify(run.messages.at(-1)));
  const before = snapshot(run);
  await run.run("prototype");
  assert.equal(run.messages.at(-1).type, "done", JSON.stringify(run.messages.at(-1)));
  assert.deepEqual(
    snapshot(run).filter((s) => before.some((b) => b.id === s.id)),
    before,
    "Existing screens changed",
  );
  assert.equal(run.nodes.filter((n) => n.type === "board").length, all.length);
  assert.equal(run.page.flows.length, 1);
  const counts = [run.nodes.length, run.nodes.flatMap((n) => n.interactions).length];
  await run.run("prototype");
  assert.equal(run.messages.at(-1).type, "done", JSON.stringify(run.messages.at(-1)));
  assert.deepEqual(
    [run.nodes.length, run.nodes.flatMap((n) => n.interactions).length],
    counts,
    "Repeated install duplicated content",
  );
  assert.equal(run.page.flows.length, 1);
  const partial = harness("cf924903-cff3-81f4-8008-fbc7ae1bf610");
  await partial.run();
  partial.faults.failAtLink = partial.faults.linkAttempts + 4;
  await partial.run("prototype");
  assert.equal(partial.messages.at(-1).type, "error");
  const partialIds = partial.nodes.map((n) => n.id);
  partial.faults.failAtLink = 0;
  await partial.run("prototype");
  assert.equal(partial.messages.at(-1).type, "done", JSON.stringify(partial.messages.at(-1)));
  assert.deepEqual(
    partial.nodes.map((n) => n.id),
    partialIds,
    "Retry rebuilt boards",
  );
  console.log(
    `Prototype graph and installer passed: ${proto.boards.length} added boards, ${proto.bindings.length} bindings, preserved originals, idempotent retry, role guards and cancel actions.`,
  );
  const implicit = harness("cf924903-cff3-81f4-8008-fbc7ae1bf610");
  await implicit.run();
  implicit.faults.implicitReviewFlow = true;
  await implicit.run("prototype");
  assert.equal(implicit.messages.at(-1).type, "done", JSON.stringify(implicit.messages.at(-1)));
  assert.equal(implicit.page.flows.length, 1);
  assert.equal(implicit.page.flows[0].name, proto.flowName);
  const installed = snapshot(implicit);
  const links = implicit.nodes.flatMap((n) => n.interactions).length;
  // Reproduce the state left by v4: all content/links exist, with an implicit flow name.
  implicit.page.flows[0].name = "Flow 1";
  assert.throws(
    () => implicit.page.createFlow(proto.flowName, implicit.page.flows[0].startingBoard),
    /createFlow-frame/,
  );
  await implicit.run("prototype");
  assert.equal(implicit.messages.at(-1).type, "done", JSON.stringify(implicit.messages.at(-1)));
  assert.deepEqual(snapshot(implicit), installed);
  assert.equal(implicit.nodes.flatMap((n) => n.interactions).length, links);
  assert.equal(implicit.page.flows.length, 1);
  assert.equal(implicit.page.flows[0].name, proto.flowName);
  console.log(
    "Implicit flow creation and v4 createFlow-frame recovery passed without rebuilding content.",
  );
  const sharp = require(path.resolve(path.dirname(process.execPath), "../node_modules/sharp"));
  const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const cache = new Map(),
    overflow = [];
  for (const b of proto.boards)
    for (const n of flat(b.layers).filter((n) => n.type === "text"))
      for (const line of n.text.split("\n").filter(Boolean)) {
        const key = [n.size, n.weight, line].join("|");
        let width = cache.get(key);
        if (width === undefined) {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="100"><text x="10" y="60" font-family="Arial" font-size="${n.size}" font-weight="${n.weight}" fill="black">${esc(line)}</text></svg>`;
          const { info } = await sharp(Buffer.from(svg))
            .trim()
            .png()
            .toBuffer({ resolveWithObject: true });
          width = info.width;
          cache.set(key, width);
        }
        if (width > n.w) overflow.push({ board: b.id, name: n.name, width, box: n.w });
      }
  assert.deepEqual(overflow, [], "Prototype text overflow: " + JSON.stringify(overflow));
  console.log(
    "All prototype reference text fits its boxes. Live Penpot rendering and interaction testing still required.",
  );
})().catch((e) => {
  console.error(e.stack);
  process.exitCode = 1;
});
