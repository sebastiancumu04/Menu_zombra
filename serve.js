// Servidor estático para previsualizar la carta de Zombra.
// Sin dependencias: node serve.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = 8790;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".md": "text/markdown; charset=utf-8",
};

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split("?")[0]);
    if (rel === "/") rel = "/index.html";

    const file = path.join(ROOT, rel);
    // nadie se sale de la raíz
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end("403");
      return;
    }

    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 — no existe " + rel);
        return;
      }

      const tipo = TIPOS[path.extname(file).toLowerCase()] || "application/octet-stream";
      const rango = req.headers.range;
      // los assets se cachean para que el intro no se re-descargue en cada carga; el HTML siempre fresco
      const cache = rel.startsWith("/web-assets/") ? "public, max-age=3600" : "no-store";

      // el video necesita rangos para poder buscar sin descargar todo
      if (rango) {
        const m = /bytes=(\d*)-(\d*)/.exec(rango);
        const ini = m[1] ? parseInt(m[1], 10) : 0;
        const fin = m[2] ? parseInt(m[2], 10) : st.size - 1;
        res.writeHead(206, {
          "Content-Type": tipo,
          "Content-Range": `bytes ${ini}-${fin}/${st.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": fin - ini + 1,
          "Cache-Control": cache,
        });
        fs.createReadStream(file, { start: ini, end: fin }).pipe(res);
        return;
      }

      res.writeHead(200, {
        "Content-Type": tipo,
        "Content-Length": st.size,
        "Accept-Ranges": "bytes",
        "Cache-Control": cache,
      });
      fs.createReadStream(file).pipe(res);
    });
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log("carta de Zombra servida en http://127.0.0.1:" + PORT);
    console.log("raiz: " + ROOT);
  });
