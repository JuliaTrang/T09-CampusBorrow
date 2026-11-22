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
  for (const id of ids)
    await sharp(path.join(__dirname, "dist", id + ".svg"))
      .png()
      .toFile(path.join(out, "prototype-" + id + ".png"));
  console.log("Saved six prototype reference previews.");
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
