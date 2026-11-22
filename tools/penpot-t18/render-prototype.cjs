const path = require("node:path"),
  fs = require("node:fs");
const sharp = require(path.resolve(path.dirname(process.execPath), "../node_modules/sharp"));
const out = path.join(__dirname, "../../docs/design/penpot-t18");
const ids = [
  "REVIEW",
  "CONFIRM_EQ_APPROVED_M",
  "EQ_APPROVED_M",
  "PICKUP_CHANGED",
  "EXPIRED",
  "S05_A",
];
(async () => {
  for (const board of require("./design.cjs").boards) {
    const source = path.join(__dirname, "dist", board.id + ".svg");
    const png = await sharp(source).png().toBuffer();
    fs.writeFileSync(path.join(out, board.id + ".png"), png);
    const canonical = path.join(
      __dirname,
      "../../docs/design/screen-specifications",
      board.id + "_screen-proposal",
    );
    fs.copyFileSync(source, canonical + ".svg");
    fs.writeFileSync(canonical + ".png", png);
  }
  for (const id of ids)
    await sharp(path.join(__dirname, "dist", id + ".svg"))
      .png()
      .toFile(path.join(out, "prototype-" + id + ".png"));
  console.log("Saved six canonical Penpot screen previews and six prototype previews.");
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
