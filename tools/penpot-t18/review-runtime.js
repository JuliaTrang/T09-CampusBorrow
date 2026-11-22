// Update known v4.1/v5 source layers; refuse conflicting user edits before writing.
function reviewType(def) {
  return def.type === "rect" ? "rectangle" : def.type;
}
function reviewMatch(parent, def, board, alternative) {
  return (parent.children || []).filter(
    (s) =>
      s.type === reviewType(def) &&
      (s.name === def.name || s.name === alternative?.name) &&
      (def.type === "group" ||
        [def, alternative]
          .filter(Boolean)
          .some((d) => Math.abs(s.x - board.x - d.x) < 1 && Math.abs(s.y - board.y - d.y) < 1)),
  );
}
async function applyReview(page, send) {
  const frames = existingFrames(page);
  for (const b of page.findShapes({ type: "board" })) {
    const id = b.getPluginData("campusborrow-t18-prototype");
    if (!id) continue;
    if (frames[id]) throw Error("Duplicate board " + id + ". No review changes made.");
    frames[id] = b;
  }
  const updates = [],
    additions = [],
    heights = [];
  for (const patch of REVIEW_PATCH) {
    const board = frames[patch.id];
    if (!board) continue;
    if (![patch.beforeHeight, patch.afterHeight].includes(board.height))
      throw Error("Board height was edited on " + patch.id + ". Review stopped before writing.");
    heights.push({ board, height: patch.afterHeight });
    for (const change of patch.changes) {
      let parent = board;
      for (const key of change.route) {
        const matches = (parent.children || []).filter(
          (s) => s.name === key.name && s.type === reviewType(key),
        );
        if (matches.length !== 1) throw Error("Cannot locate " + patch.id + " / " + key.name);
        parent = matches[0];
      }
      const matches = reviewMatch(parent, change.before, board, change.after);
      if (matches.length !== 1)
        throw Error("Cannot locate review layer " + patch.id + " / " + change.before.name);
      const shape = matches[0];
      if (
        shape.type === "text" &&
        ![change.before.text, change.after.text].includes(shape.characters)
      )
        throw Error("User text differs on " + patch.id + " / " + shape.name + ". Kept unchanged.");
      updates.push({ board, shape, def: change.after });
    }
    for (const def of patch.additions) {
      const matches = reviewMatch(board, def, board);
      if (matches.length > 1) throw Error("Duplicate review addition " + def.name);
      if (!matches.length) additions.push({ board, def });
    }
  }
  const font =
    penpot.fonts.findByName("Source Sans Pro") ||
    penpot.fonts.findByName("Roboto") ||
    penpot.fonts.findByName("Inter");
  if (!font) throw Error("No supported font found.");
  if (penpot.currentPage?.id !== page.id) throw Error("Active page changed.");
  for (const { board, height } of heights) board.resize(board.width, height);
  for (const { board, shape, def } of updates) {
    if (shape.type === "text") shape.characters = def.text;
    shape.name = def.name;
    shape.resize(def.w, def.h);
    shape.x = board.x + def.x;
    shape.y = board.y + def.y;
  }
  for (const { board, def } of additions) protoLeaf(def, board, board.x, board.y, font);
  send("progress", "Review fields updated. Completing scenario links.");
  const result = await extendPrototype(page, send);
  penpot.selection = [frames.S05];
  penpot.viewport.zoomIntoView([frames.S05]);
  return (
    "Review v5.1 applied. S05 item status and occupancy are visible. Existing board IDs and interactions retained. " +
    result
  );
}
