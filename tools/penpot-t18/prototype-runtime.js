// Appended to the bundle. Only prototype boards are created; existing T18 content is retained.
function prototypeGroup(frame, name) {
  const matches = descendants(frame).filter((s) => s.type === "group" && s.name === name);
  if (matches.length !== 1)
    throw Error(
      "Cannot uniquely locate " + frame.name + " / " + name + ". Existing content is retained.",
    );
  return matches[0];
}
function compatibleClick(shape, spec, frames) {
  const clicks = (shape.interactions || []).filter((i) => i.trigger === "click");
  for (const i of clicks) {
    const targetId = spec.target ? frames[spec.target]?.id : undefined;
    if (
      i.action?.type !== spec.type ||
      (spec.target && (!targetId || i.action.destination?.id !== targetId))
    )
      throw Error(
        "An existing click action differs on " + shape.name + ". It was not overwritten.",
      );
  }
  return clicks.length > 0;
}
function protoLeaf(def, parent, ox, oy, font) {
  if (def.type === "group") {
    const children = def.children.map((d) => protoLeaf(d, parent, ox, oy, font));
    const g = penpot.group(children);
    if (!g) throw Error("Cannot group " + def.name);
    g.name = def.name;
    parent.appendChild(g);
    g.bringToFront();
    for (const child of children) child.bringToFront();
    return g;
  }
  const s = def.type === "text" ? penpot.createText(def.text) : penpot.createRectangle();
  if (!s) throw Error("Cannot create " + def.name);
  parent.appendChild(s);
  s.name = def.name;
  if (def.type === "text") {
    font.applyToText(
      s,
      font.variants.find((v) => v.fontWeight === String(def.weight) && v.fontStyle !== "italic"),
    );
    s.fontSize = String(def.size);
    s.fontWeight = String(def.weight);
    s.lineHeight = "1.35";
    s.growType = "fixed";
    s.align = def.align || "left";
    s.verticalAlign = "top";
    s.fills = [{ fillColor: def.color, fillOpacity: 1 }];
  } else {
    s.fills = [{ fillColor: def.fill, fillOpacity: 1 }];
    s.strokes = def.stroke
      ? [
          {
            strokeColor: def.stroke,
            strokeWidth: 1,
            strokeStyle: "solid",
            strokeAlignment: "inner",
          },
        ]
      : [];
    s.borderRadius = def.r;
  }
  s.resize(def.w, def.h);
  s.x = ox + def.x;
  s.y = oy + def.y;
  s.bringToFront();
  return s;
}
async function extendPrototype(page, send) {
  const frames = existingFrames(page),
    originalIds = new Set(Object.values(frames).map((b) => b.id));
  const known = page.findShapes({ type: "board" });
  for (const d of PROTOTYPE.boards) {
    const matches = known.filter((b) => b.getPluginData("campusborrow-t18-prototype") === d.id);
    if (matches.length > 1)
      throw Error("Duplicate prototype board " + d.id + ". No changes were made.");
    if (matches.length) {
      if (matches[0].getPluginData("campusborrow-t18-prototype-ready") !== "v4")
        throw Error(
          "Incomplete prototype board " +
            d.id +
            ". Keep it for inspection; do not rerun the six-screen builder.",
        );
      frames[d.id] = matches[0];
    }
  }
  // Resolve every existing source control and conflict before creating new boards.
  for (const spec of PROTOTYPE.bindings)
    if (frames[spec.board])
      compatibleClick(prototypeGroup(frames[spec.board], spec.name), spec.action, frames);
  const font =
    penpot.fonts.findByName("Source Sans Pro") ||
    penpot.fonts.findByName("Roboto") ||
    penpot.fonts.findByName("Inter");
  if (!font) throw Error("No supported font found.");
  const startY =
    Math.max(
      ...Object.values(frames)
        .filter((b) => originalIds.has(b.id))
        .map((b) => b.y + b.height),
    ) + 320;
  let created = 0,
    added = 0,
    retained = 0;
  for (let i = 0; i < PROTOTYPE.boards.length; i++) {
    if (penpot.currentPage?.id !== page.id)
      throw Error("The active page changed. Return to the original T18 page before continuing.");
    const d = PROTOTYPE.boards[i];
    if (frames[d.id]) continue;
    send("progress", `Adding prototype ${i + 1}/${PROTOTYPE.boards.length}: ${d.title}`);
    const b = penpot.createBoard();
    b.name = "P / " + d.id + " / " + d.title;
    b.resize(d.width, d.height);
    b.x = 200 + (i % 5) * 1440;
    b.y = startY + Math.floor(i / 5) * 1400;
    b.fills = [{ fillColor: DATA.C.bg, fillOpacity: 1 }];
    b.clipContent = true;
    b.setPluginData("campusborrow-t18-prototype", d.id);
    frames[d.id] = b;
    for (const n of d.layers) protoLeaf(n, b, b.x, b.y, font);
    if (d.contract) b.setPluginData("campusborrow-t18-contract", JSON.stringify(d.contract));
    b.setPluginData("campusborrow-t18-prototype-ready", "v4");
    created++;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  if (penpot.currentPage?.id !== page.id)
    throw Error("The active page changed. Return to the original T18 page before continuing.");
  const plan = PROTOTYPE.bindings.map((spec) => ({
    spec,
    shape: prototypeGroup(frames[spec.board], spec.name),
  }));
  for (const { spec, shape } of plan) compatibleClick(shape, spec.action, frames);
  for (const { spec, shape } of plan) {
    if (compatibleClick(shape, spec.action, frames)) {
      retained++;
      continue;
    }
    const action = { type: spec.action.type };
    if (spec.action.target) action.destination = frames[spec.action.target];
    if (action.type === "navigate-to") action.preserveScrollPosition = false;
    if (action.type === "open-overlay")
      Object.assign(action, {
        position: "center",
        closeWhenClickOutside: false,
        addBackgroundOverlay: true,
      });
    shape.addInteraction("click", action);
    added++;
  }
  // Penpot may create an implicit flow when the first navigation is attached.
  // A board can start only one flow, regardless of its name.
  const entry = frames[PROTOTYPE.entry];
  const flows = page.flows || [];
  const named = flows.find((f) => f.name === PROTOTYPE.flowName);
  if (named && named.startingBoard?.id !== entry.id)
    throw Error(
      "The review flow name is already used by another board. Existing flows were retained.",
    );
  const existing = flows.find((f) => f.startingBoard?.id === entry.id);
  if (existing) existing.name = PROTOTYPE.flowName;
  else page.createFlow(PROTOTYPE.flowName, entry);
  page.setPluginData(
    "campusborrow-t18-prototype-status",
    "v4 fixed scenarios installed; live review pending",
  );
  penpot.selection = [frames[PROTOTYPE.entry]];
  penpot.viewport.zoomIntoView([frames[PROTOTYPE.entry]]);
  return `Prototype v4.1 ready: ${created} boards added, ${added} interactions added, ${retained} retained. Start the flow "${PROTOTYPE.flowName}" with Present/Play. Sample values and outcomes are fixed; no real account or data changes occur.`;
}
