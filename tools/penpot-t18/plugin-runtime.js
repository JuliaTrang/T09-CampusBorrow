/* DATA is embedded by build.cjs. No raster imports or credentials. */
const TARGET_FILE = "cf924903-cff3-81f4-8008-fbc7ae1bf610";
const ORIGIN = "http://localhost:8765";
let busy = false;
// Legacy appendChild ordering puts earlier backgrounds above later controls.
// Normalize the API's child ordering, then explicitly restore paint order.
if (penpot.flags) penpot.flags.naturalChildOrdering = true;
const descendants = (shape) =>
  (shape.children || []).flatMap((child) => [child, ...descendants(child)]);
const definitions = (layers) =>
  layers.flatMap((layer) => [layer, ...definitions(layer.children || [])]);
function attachNavigation(links, frames) {
  // Validate all planned changes before adding anything. Keep existing user actions.
  const missing = [];
  let retained = 0;
  for (const { shape, target } of links) {
    const destination = frames[target];
    let owner = shape.parent;
    while (owner && owner.type !== "board") owner = owner.parent;
    if (!destination || owner?.id === destination.id)
      throw Error("Invalid navigation destination for " + shape.name);
    const clicks = (shape.interactions || []).filter((i) => i.trigger === "click");
    if (
      clicks.some(
        (i) => i.action?.type !== "navigate-to" || i.action.destination?.id !== destination.id,
      )
    )
      throw Error("Existing click action differs on " + shape.name + ". Left unchanged.");
    if (clicks.length) retained++;
    else missing.push({ shape, destination });
  }
  for (const { shape, destination } of missing)
    shape.addInteraction("click", {
      type: "navigate-to",
      destination,
      preserveScrollPosition: false,
    });
  return { added: missing.length, retained };
}
function existingFrames(page) {
  const frames = {};
  const candidates = page.findShapes({ type: "board" });
  for (const d of DATA.boards) {
    const matches = candidates.filter(
      (b) => b.name === d.id + " / " + d.title && b.getPluginData("campusborrow-t18") === "v1",
    );
    if (matches.length !== 1)
      throw Error(
        "Expected exactly one original " + d.id + " board on this page. No layers were changed.",
      );
    frames[d.id] = matches[0];
  }
  return frames;
}
function paintPlan(parent, defs, plans, ox, oy) {
  const children = [...(parent.children || [])];
  const used = new Set(),
    ordered = [];
  for (const def of defs) {
    const type = def.type === "rect" ? "rectangle" : def.type;
    let matches = children.filter((s) => s.name === def.name && s.type === type && !used.has(s.id));
    // Repeated headings such as BORROWER exist in both sidebar and page header.
    // Resolve legacy names using their original coordinates; never guess by z-order.
    if (matches.length > 1 && Number.isFinite(def.x) && Number.isFinite(def.y))
      matches = matches.filter(
        (s) => Math.abs(s.x - ox - def.x) < 1 && Math.abs(s.y - oy - def.y) < 1,
      );
    if (matches.length !== 1)
      throw Error("Cannot uniquely identify layer " + def.name + ". Layer order was not changed.");
    const shape = matches[0];
    used.add(shape.id);
    ordered.push(shape);
    if (def.children) paintPlan(shape, def.children, plans, ox, oy);
  }
  // Additional user layers keep their relative order above the rebuilt source stack.
  ordered.push(...children.filter((s) => !used.has(s.id)));
  plans.push({ parent, ordered });
}
async function restorePaintOrder(frames) {
  const plans = [];
  for (const d of DATA.boards)
    paintPlan(frames[d.id], d.layers, plans, frames[d.id].x, frames[d.id].y);
  // Preflight every board before making the first change.
  for (const { ordered } of plans) for (const shape of ordered) shape.bringToFront();
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (penpot.flags?.naturalChildOrdering) {
    for (const { parent, ordered } of plans) {
      const actual = (parent.children || []).map((s) => s.id).join(",");
      if (actual !== ordered.map((s) => s.id).join(","))
        throw Error(
          "Layer order could not be verified in " + parent.name + ". No layers were deleted.",
        );
    }
  }
  return plans.length;
}
async function repairVisuals(page) {
  const frames = existingFrames(page);
  const containers = await restorePaintOrder(frames);
  const shapes = Object.values(frames).flatMap(descendants);
  const texts = shapes.filter((s) => s.type === "text").length;
  const rectangles = shapes.filter((s) => s.type === "rectangle").length;
  page.setPluginData("campusborrow-t18-status", "paint order repaired; live visual review pending");
  penpot.selection = [frames.S01];
  penpot.viewport.zoomIntoView([frames.S01]);
  return `Layer order repaired: 6 boards, ${containers} containers, ${texts} text layers and ${rectangles} rectangles. Existing text, geometry and navigation were preserved. Inspect S01, then the other five screens.`;
}
function repairNavigation(page) {
  const frames = existingFrames(page),
    links = [];
  for (const d of DATA.boards) {
    const shapes = descendants(frames[d.id]);
    for (const def of definitions(d.layers).filter((n) => n.target)) {
      const matches = shapes.filter((s) => s.type === "group" && s.name === def.name);
      if (matches.length !== 1)
        throw Error(
          "Cannot uniquely locate " + d.id + " / " + def.name + ". No layers were changed.",
        );
      links.push({ shape: matches[0], target: def.target });
    }
  }
  const result = attachNavigation(links, frames);
  const texts = Object.values(frames)
    .flatMap(descendants)
    .filter((s) => s.type === "text").length;
  page.setPluginData("campusborrow-t18-status", "navigation repaired; live visual review pending");
  penpot.selection = Object.values(frames);
  penpot.viewport.zoomIntoView(Object.values(frames));
  return `Repaired navigation: ${result.added} added, ${result.retained} retained; 11 links total. Kept 6 existing boards and ${texts} text layers. No layers rebuilt. Review the prototype in Penpot.`;
}
penpot.ui.open("CampusBorrow T18 · v5", ORIGIN + "/ui.html?v=5", { width: 480, height: 720 });
penpot.ui.onMessage(async (message) => {
  if (!["build", "repair", "visuals", "prototype", "review"].includes(message?.type) || busy)
    return;
  busy = true;
  const created = [];
  const send = (type, text) => penpot.ui.sendMessage({ type, text });
  try {
    if (penpot.currentFile?.id !== TARGET_FILE)
      throw Error("Open the CampusBorrow PA3 file supplied by Phuc before running.");
    const page = penpot.currentPage;
    if (!page) throw Error("Open an empty page first.");
    if (message.type === "review") {
      send("done", await applyReview(page, send));
      return;
    }
    if (message.type === "prototype") {
      send("done", await extendPrototype(page, send));
      return;
    }
    if (message.type === "visuals") {
      send("progress", "Restoring backgrounds, text and button layer order…");
      send("done", await repairVisuals(page));
      return;
    }
    if (message.type === "repair") {
      send("progress", "Checking existing T18 boards and repairing navigation…");
      send("done", repairNavigation(page));
      return;
    }
    if (page.findShapes().some((s) => s.id !== page.root.id))
      throw Error(
        "This page already has layers. Open a new empty page to avoid replacing your edits.",
      );
    const font =
      penpot.fonts.findByName("Source Sans Pro") ||
      penpot.fonts.findByName("Roboto") ||
      penpot.fonts.findByName("Inter");
    if (!font) throw Error("No supported font found (Source Sans Pro, Roboto or Inter).");
    const links = [],
      frames = {};
    let textCount = 0,
      rectCount = 0;
    function leaf(d, parent, ox, oy) {
      if (d.type === "group") {
        const children = d.children.map((c) => leaf(c, parent, ox, oy));
        const g = penpot.group(children);
        if (!g) throw Error("Could not group " + d.name);
        g.name = d.name;
        parent.appendChild(g);
        if (d.target) links.push({ shape: g, target: d.target });
        return g;
      }
      const s = d.type === "text" ? penpot.createText(d.text) : penpot.createRectangle();
      if (!s) throw Error("Could not create " + d.name);
      created.push(s);
      parent.appendChild(s);
      s.name = d.name;
      if (d.type === "text") {
        const variant = font.variants.find(
          (v) => v.fontWeight === String(d.weight) && v.fontStyle !== "italic",
        );
        font.applyToText(s, variant);
        s.fontSize = String(d.size);
        s.fontWeight = String(d.weight);
        s.lineHeight = "1.35";
        s.growType = "fixed";
        s.align = d.align || "left";
        s.verticalAlign = "top";
        s.fills = [{ fillColor: d.color, fillOpacity: 1 }];
        textCount++;
      } else {
        s.fills = [{ fillColor: d.fill, fillOpacity: 1 }];
        s.strokes = d.stroke
          ? [
              {
                strokeColor: d.stroke,
                strokeWidth: 1,
                strokeStyle: "solid",
                strokeAlignment: "inner",
              },
            ]
          : [];
        s.borderRadius = d.r;
        rectCount++;
      }
      s.resize(d.w, d.h);
      s.x = ox + d.x;
      s.y = oy + d.y;
      return s;
    }
    for (let i = 0; i < DATA.boards.length; i++) {
      const d = DATA.boards[i];
      send("progress", "Building " + d.id + " — " + d.title);
      const b = penpot.createBoard();
      created.push(b);
      frames[d.id] = b;
      b.name = d.id + " / " + d.title;
      b.resize(d.width, d.height);
      b.x = 200 + (i % 3) * 1440;
      b.y = 200 + Math.floor(i / 3) * 1400;
      b.fills = [{ fillColor: DATA.C.bg, fillOpacity: 1 }];
      b.clipContent = true;
      b.setPluginData("campusborrow-t18", "v1");
      for (const layer of d.layers) leaf(layer, b, b.x, b.y);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    await restorePaintOrder(frames);
    attachNavigation(links, frames);
    page.name = "T18 — Editable PA3";
    page.setPluginData(
      "campusborrow-t18-status",
      "built; prototype and typography need visual review",
    );
    penpot.selection = Object.values(frames);
    penpot.viewport.zoomIntoView(Object.values(frames));
    const actual = page.findShapes({ type: "text" }).length;
    if (actual !== textCount)
      throw Error("Text layer count differs: " + actual + " / " + textCount);
    send(
      "done",
      `Created 6 boards, ${textCount} editable text layers, ${rectCount} rectangles and ${links.length} navigation links. Review typography and prototype in Penpot. Business buttons are design controls, not backend actions.`,
    );
  } catch (e) {
    // Leave partial content inspectable. Never delete user content or retry over it.
    send(
      "error",
      String(e.message || e) +
        (created.length
          ? " Existing layers were retained. If all six boards are present, use Repair navigation."
          : ""),
    );
  } finally {
    busy = false;
  }
});
