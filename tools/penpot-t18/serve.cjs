// Serve ONLY the generated plugin directory on loopback; no workspace access.
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.join(__dirname, "dist");
const allowed = new Set([
  "manifest.json",
  "plugin.js",
  "ui.html",
  "S01.svg",
  "S04.svg",
  "S05.svg",
  "S06.svg",
  "S08.svg",
  "S09.svg",
]);
const types = {
  ".json": "application/json",
  ".js": "application/javascript",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
};
http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Private-Network", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }
    const name = new URL(req.url, "http://localhost:8765").pathname.slice(1);
    if (req.method !== "GET" || !allowed.has(name)) {
      res.writeHead(404);
      return res.end("Not found");
    }
    fs.readFile(path.join(root, name), (err, bytes) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not found");
      }
      res.setHeader("Content-Type", types[path.extname(name)]);
      res.end(bytes);
    });
  })
  .listen(8765, "127.0.0.1", () =>
    console.log("Penpot plugin: http://localhost:8765/manifest.json"),
  );
