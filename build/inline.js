// Empaqueta la carta de Zombra en un solo archivo, con todo el material embebido.
//
// El sitio real sirve los assets sueltos desde web-assets/. Esto es solo para
// compartir un enlace de previsualización que funcione sin servidor: cada video,
// imagen, tipografía y logo entra como data-URI. Como todo va en base64 (que
// infla ~33%) y el tope del visor es 16 MB, conviene medir el margen al final.
//
// En node y no en python: macOS bloquea python en ~/Documents.
//
//   node build/inline.js [salida.html]
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");
const MIME = {
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function dataurl(rel) {
  const abs = path.join(RAIZ, rel);
  const mime = MIME[path.extname(abs).toLowerCase()] || "application/octet-stream";
  return "data:" + mime + ";base64," + fs.readFileSync(abs).toString("base64");
}

function main() {
  const destino = process.argv[2] || path.join(RAIZ, "carta-inline.html");
  let html = fs.readFileSync(path.join(RAIZ, "index.html"), "utf8");

  // los preload son solo hints y apuntan a rutas que si no embeberíamos dos veces
  html = html.replace(/\s*<link rel="preload"[^>]*>\n/g, "\n");

  // embebe cada asset referenciado como "web-assets/..."
  const refs = [...new Set([...html.matchAll(/"(web-assets\/[^"]+)"/g)].map((m) => m[1]))].sort();
  for (const ref of refs) {
    if (!fs.existsSync(path.join(RAIZ, ref))) {
      console.error("falta el asset: " + ref);
      process.exit(1);
    }
    html = html.split('"' + ref + '"').join('"' + dataurl(ref) + '"');
  }

  const resto = html.match(/"web-assets\/[^"]+"/g);
  if (resto) {
    console.error("quedaron assets sin embeber: " + [...new Set(resto)].join(", "));
    process.exit(1);
  }

  // el visor aporta su propio doctype/head/body: acá va solo el fragmento
  html = html.replace(/^<!doctype html>\s*<html[^>]*>\s*<head>\s*/i, "");
  html = html.replace("</head>\n<body>", "");
  html = html.replace(/\s*<\/body>\s*<\/html>\s*$/i, "\n");
  for (const p of ["<!doctype", "<html", "</html", "<head>", "</head>", "<body>", "</body>"]) {
    if (html.toLowerCase().includes(p)) {
      console.error("quedó " + p + " en el fragmento");
      process.exit(1);
    }
  }

  fs.writeFileSync(destino, html);
  const mb = Buffer.byteLength(html) / 1e6;
  console.log(mb.toFixed(2) + " MB  ·  tope 16 MB  ·  margen " + (16 - mb).toFixed(2) + " MB");
}

main();
