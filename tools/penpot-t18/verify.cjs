// Offline safety and content checks. This does not replace a live Penpot run.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const data = require("./design.cjs");
const source = fs.readFileSync(path.join(__dirname, "dist/plugin.js"), "utf8");
function harness(fileId, occupied = false, bundle = source) {
  let callback;
  const nodes = [],
    messages = [];
  let serial = 0;
  const flags = { naturalChildOrdering: false };
  const faults = { failAtLink: 0, linkAttempts: 0 };
  function shape(type) {
    const s = {
      type,
      id: String(++serial),
      children: [],
      interactions: [],
      pluginData: {},
      resize(w, h) {
        this.width = w;
        this.height = h;
      },
      appendChild(child) {
        if (child.parent) child.parent.children = child.parent.children.filter((x) => x !== child);
        child.parent = this;
        if (flags.naturalChildOrdering) this.children.push(child);
        else this.children.unshift(child);
      },
      bringToFront() {
        if (!this.parent) return;
        this.parent.children = this.parent.children.filter((s) => s !== this);
        this.parent.children.push(this);
      },
      setPluginData(k, v) {
        this.pluginData[k] = v;
      },
      getPluginData(k) {
        return this.pluginData[k] || "";
      },
      addInteraction(trigger, action) {
        assert.equal(trigger, "click");
        if (action.type !== "close-overlay") assert.equal(action.destination.type, "board");
        let board = this.parent;
        while (board && board.type !== "board") board = board.parent;
        if (action.destination)
          assert.notEqual(board?.id, action.destination.id, "Penpot forbids same-board navigation");
        faults.linkAttempts++;
        if (faults.failAtLink === faults.linkAttempts)
          throw Error("Simulated addInteraction failure");
        if (
          faults.implicitReviewFlow &&
          board?.getPluginData("campusborrow-t18-prototype") === "REVIEW" &&
          !page.flows.some((f) => f.startingBoard.id === board.id)
        )
          page.createFlow("Flow 1", board);
        this.interactions.push({ trigger, action });
      },
    };
    nodes.push(s);
    return s;
  }
  const root = { id: "root", children: [] };
  if (occupied) nodes.push({ id: "user-content", type: "rectangle" });
  const page = {
    flows: [],
    createFlow(name, board) {
      assert.equal(board?.type, "board");
      if (this.flows.some((f) => f.startingBoard.id === board.id))
        throw Error(
          "[PENPOT PLUGIN] Value not valid: [object ShapeProxy]. Code: :createFlow-frame",
        );
      const f = { name, startingBoard: board };
      this.flows.push(f);
      return f;
    },
    root,
    findShapes(query) {
      return nodes.filter((n) => !query || n.type === query.type);
    },
    setPluginData() {},
  };
  const penpot = {
    flags,
    currentFile: { id: fileId },
    currentPage: page,
    ui: {
      open() {},
      onMessage(fn) {
        callback = fn;
      },
      sendMessage(m) {
        messages.push(m);
      },
    },
    fonts: {
      findByName() {
        return { variants: [], applyToText() {} };
      },
    },
    createBoard: () => shape("board"),
    createRectangle: () => shape("rectangle"),
    createText: (t) => Object.assign(shape("text"), { characters: t }),
    group(children) {
      const g = shape("group");
      for (const c of children) g.appendChild(c);
      return g;
    },
    viewport: { zoomIntoView() {} },
  };
  const context = vm.createContext({ penpot, setTimeout });
  vm.runInContext(bundle, context);
  return {
    run: (type = "build") => callback({ type }),
    nodes,
    messages,
    faults,
    createShape: shape,
    page,
    upgrade: (code) => vm.runInNewContext(code, { penpot, setTimeout }),
  };
}
function assertPaintOrder(run) {
  function visit(parent, defs) {
    assert.deepEqual(
      parent.children.slice(0, defs.length).map((s) => s.name),
      defs.map((d) => d.name),
      parent.name,
    );
    for (let i = 0; i < defs.length; i++)
      if (defs[i].children) visit(parent.children[i], defs[i].children);
  }
  for (const b of data.boards)
    visit(
      run.nodes.find((s) => s.type === "board" && s.name === b.id + " / " + b.title),
      b.layers,
    );
}
async function verifyBase() {
  const target = "cf924903-cff3-81f4-8008-fbc7ae1bf610";
  const wrong = harness("other-file");
  await wrong.run();
  assert.equal(wrong.nodes.length, 0);
  assert.equal(wrong.messages.at(-1).type, "error");
  const occupied = harness(target, true);
  await occupied.run();
  assert.equal(occupied.nodes.length, 1);
  assert.equal(occupied.messages.at(-1).type, "error");
  const run = harness(target);
  await run.run();
  assert.equal(run.messages.at(-1).type, "done", JSON.stringify(run.messages.at(-1)));
  assert.equal(run.nodes.filter((n) => n.type === "board").length, 6);
  assert.equal(run.nodes.filter((n) => n.type === "text").length, 229);
  assert.equal(run.nodes.filter((n) => n.type === "rectangle").length, 116);
  assert.equal(run.nodes.flatMap((n) => n.interactions || []).length, 11);
  assertPaintOrder(run);
  // Reproduce legacy appendChild paint order, including nested button groups.
  for (const s of run.nodes) s.children.reverse();
  assert.throws(() => assertPaintOrder(run));
  const userText = run.nodes.find((s) => s.type === "text");
  userText.characters = "Keep my edited text";
  const extra = run.createShape("text");
  extra.name = "User annotation";
  extra.characters = "Keep this too";
  run.nodes.find((s) => s.type === "board").appendChild(extra);
  const beforeVisual = run.nodes.map((s) => ({
    id: s.id,
    x: s.x,
    y: s.y,
    width: s.width,
    height: s.height,
    text: s.characters,
    links: s.interactions.length,
  }));
  await run.run("visuals");
  assert.equal(run.messages.at(-1).type, "done");
  assertPaintOrder(run);
  assert.deepEqual(
    run.nodes.map((s) => ({
      id: s.id,
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height,
      text: s.characters,
      links: s.interactions.length,
    })),
    beforeVisual,
  );
  await run.run("visuals");
  assertPaintOrder(run);
  assert.equal(userText.characters, "Keep my edited text");
  const stableOrder = run.nodes.map((s) => s.children.map((c) => c.id).join(","));
  const renamed = run.nodes.find((s) => s.name === "Button background");
  renamed.name = "User renamed background";
  await run.run("visuals");
  assert.equal(run.messages.at(-1).type, "error");
  assert.deepEqual(
    run.nodes.map((s) => s.children.map((c) => c.id).join(",")),
    stableOrder,
  );
  renamed.name = "Button background";
  const count = run.nodes.length;
  await run.run();
  assert.equal(run.nodes.length, count);
  assert.equal(run.messages.at(-1).type, "error");
  await run.run("repair");
  assert.equal(run.messages.at(-1).type, "done");
  assert.equal(run.nodes.length, count);
  assert.equal(run.nodes.flatMap((n) => n.interactions || []).length, 11);
  const partial = harness(target);
  partial.faults.failAtLink = 2;
  await partial.run();
  assert.equal(partial.messages.at(-1).type, "error");
  assert.equal(partial.nodes.flatMap((n) => n.interactions || []).length, 1);
  const originalIds = partial.nodes.map((s) => s.id);
  const editedText = partial.nodes.find((s) => s.type === "text");
  editedText.characters = "User edit must survive";
  partial.faults.failAtLink = 0;
  await partial.run("repair");
  assert.equal(partial.messages.at(-1).type, "done");
  assert.deepEqual(
    partial.nodes.map((s) => s.id),
    originalIds,
  );
  assert.equal(editedText.characters, "User edit must survive");
  assert.equal(partial.nodes.flatMap((n) => n.interactions || []).length, 11);
  await partial.run("repair");
  assert.equal(partial.nodes.flatMap((n) => n.interactions || []).length, 11);
  const existingLink = partial.nodes.find((s) => s.interactions.length).interactions[0];
  existingLink.action = { type: "open-url", url: "https://example.com" };
  await partial.run("repair");
  assert.equal(partial.messages.at(-1).type, "error");
  assert.equal(existingLink.action.type, "open-url");
  assert.equal(partial.nodes.flatMap((n) => n.interactions || []).length, 11);
  console.log(
    "Passed: layer-order recovery (boards and nested groups), preserved user edits/geometry/navigation, idempotent repairs, ambiguous-layer guards, wrong-file/occupied-page guards, same-board exclusion and partial-run recovery.",
  );
  const sharp = require(path.resolve(path.dirname(process.execPath), "../node_modules/sharp"));
  const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const flat = (a) => a.flatMap((x) => [x, ...flat(x.children || [])]);
  const overflow = [];
  for (const b of data.boards)
    for (const n of flat(b.layers).filter((n) => n.type === "text")) {
      for (const line of n.text.split("\n").filter(Boolean)) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="100"><text x="10" y="60" font-family="Arial" font-size="${n.size}" font-weight="${n.weight}" fill="black">${esc(line)}</text></svg>`;
        const { info } = await sharp(Buffer.from(svg))
          .trim()
          .png()
          .toBuffer({ resolveWithObject: true });
        if (info.width > n.w)
          overflow.push({ board: b.id, name: n.name, width: info.width, box: n.w });
      }
      const required = n.text.split("\n").length * n.size * 1.35;
      if (required > n.h + 1)
        overflow.push({ board: b.id, name: n.name, height: required, box: n.h });
    }
  assert.deepEqual(overflow, [], "Reference text exceeds its box: " + JSON.stringify(overflow));
  console.log(
    "Reference Arial text width and line-height checks passed. Penpot font rendering remains unverified.",
  );
}
module.exports = { harness };
if (require.main === module)
  verifyBase().catch((e) => {
    console.error(e.stack);
    process.exitCode = 1;
  });
