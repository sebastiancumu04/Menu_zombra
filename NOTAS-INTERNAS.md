# Notas internas — Zombra

Esto **no viaja al comensal**. Nunca meter esto dentro del HTML: en La Chula una
auditoría marcó como defecto crítico que el comensal leyera los pendientes de la casa.

---

## Pendiente de la casa (a confirmar)

- **Impuesto / propina.** El PDF fuente **no trae** ningún pie de impuesto al consumo,
  IVA, propina ni servicio. Por eso **no se puso** el conmutador de "precio final" que sí
  tenía La Chula. Confirmar si aplica impoconsumo/propina y si debe mostrarse.
- **Aviso legal de alcohol.** No estaba en el PDF. Se agregó el aviso estándar de ley
  colombiana (exceso de alcohol / no venta a menores) en el pie. Confirmar redacción.
- **Menú del día.** Se tomó del sitio web (no del PDF): línea informativa en el pie
  ("Lun–Vie 12:00–14:00 · $65.000"). Confirmar que sigue vigente.
- **Tagline en inglés.** La home usa "familiar" y el Linktree usa "singular". Se usó la
  versión "familiar" en ambos idiomas. Confirmar cuál es la canónica en EN.
- **Cita del chef en inglés.** La cita existe en español en el sitio; la traducción al
  inglés es propia. Confirmar.
- **Símbolos de hambre.** El PDF trae 4 glifos ilustrados; acá se representan con números
  1–4 + el texto. Si la casa quiere, se incrustan los glifos reales.
- **Logo.** No existe versión vectorial: se usa el PNG blanco `zombra-logo-blanco.png`
  (926×143). Para el hero del intro conviene un `.svg`/`.ai`. Pedirlo.

## Correcciones respecto del PDF (ortografía evidente; el resto es verbatim)

- Nombres de plato presentados en caja normal (el PDF los imprime en mayúscula display).
- `´PALAK PANEER´` → *palak paneer* (se quitan las comillas agudas decorativas del impreso).
- Cócteles (ES): `Citrico` → **Cítrico** · `condimento de limon` → **limón** ·
  `sirope de pimientas hierbas` → **de pimientas y hierbas** *(se agregó "y"; confirmar)* ·
  `cordial de remolacha/clavo` → **de remolacha y clavo** *(se reemplazó "/" por "y"; confirmar)*.
- Langosta (EN): `ORGANIC PATATO` → **organic potato** (typo evidente). `GUATILA KIMCHI`
  (EN) y `kimchi de cidra` (ES) se dejan como el impreso (cidra = guatila).
- Postres (EN): `limonaria` se tradujo `lemon` tal como el PDF EN lo imprime (no "lemongrass").
- Precios dobles se muestran tal cual: Langosta `90.000 / 180.000`; Agua y Agua con gas
  `12.000 / 24.000` (el PDF EN rotula "small / large").

## Fotos — estado (verificado por visión, plato por plato)

La foto **no va en la lista**: vive en el **reverso**, a un toque. Mientras un plato no
tenga material, su fila se comporta como cualquier otra — sin marca "Ver" y sin hueco.
Para sumar una foto: agregarle `foto:"web-assets/platos/x.webp"` al ítem en `SECCIONES`;
aparece la marca **Ver** sola. (El reverso hoy es solo foto; para sumar video a un plato,
extender `pintaReverso` con una rama `<video>` y un campo `clip`.)

### ⚠️ Corregido: foto mal etiquetada en la fuente

`Material/Platos/Ceviche de hongos Citricos.jpg` **NO es un ceviche: es el Entrecote**
(idéntica a la foto web del entrecote). Se descartó. **El ceviche de hongos no tiene foto.**

### En vivo (alta confianza) — 8 platos

Entrecote · Chuleta de cerdo · Langosta · Goulash de carrillera · Pesca blanca ·
San Marzano · Pablodelle · **Crudo de atún** (nueva).

### A confirmar por la casa antes de publicar (confianza media)

| Ítem | Archivo fuente |
|------|----------------|
| Cogollos / ajonjolí / tocino / paipa | `Material/Platos/497078408_...n.jpg` |
| Tocino / atún curado / guayaba / cebolla brûlée | `Material/Platos/557602228_...n.jpg` |

Si la casa las aprueba: `cwebp -q 86 <fuente> -o web-assets/platos/<slug>.webp` y agregar
`foto:` al ítem.

### Fotos que no calzan con la carta (¿degustación / fuera de carta?)

`Solomito con tubérculos rostizados`, `Piña parrillada` (postre de piña), `Hojas de breva
rellenas de cerdo estofado`, y un bloque braseado con aros de cebolla apanados
(`525244268` / `656291190`, ambiguo entre Contramuslo o Tocino). No se usan sin confirmar.
`Menu degustacion.jpg` y `gallery-fondo-ambiente.jpg` son tomas de proceso/ambiente.

### Platos por fotografiar

Todo lo demás (la mayor parte de A la carta, todos los postres, cócteles, etc.).
Formato sugerido: **vertical, emplatado limpio, fondo oscuro (claroscuro)**, coherente con
la identidad. Video vertical en loop le gana a foto fija cuando exista.

## Assets y pipeline

- **Intro:** `Material/RENDER FINAL.mp4` (2160×3840, 9:16, 60 fps, 5 s, 93 MB) → re-encode
  `web-assets/intro.mp4` a 1080×1920 all-intra (`-g 1 -keyint_min 1 -sc_threshold 0`, CRF 21),
  15 fps, con etalonaje horneado (`eq=contrast=1.12:brightness=-0.03:saturation=0.5`). Es una
  sola toma; el scroll maneja su `currentTime`. All-intra = cada frame es keyframe → el scrub
  es fluido en iOS. Para un intro en B&N total, bajar `saturation` a 0 y re-encodear.
  (El dron viejo `Material/toma dron.mp4` quedó de respaldo, sin usar.)
- **Logo:** `Material/web/zombra-wordmark-blanco.png` → `web-assets/logo.webp`.
- **Tipografías:** Heebo (300/400/500) + Playfair Display (400/600/700 + itálica 400),
  Latin woff2 en `web-assets/fonts/`, incrustadas por `@font-face` (sin Google Fonts).
- **Fondo:** claroscuro por CSS (negro + una luz difusa arriba), sin asset de fondo.

## Servidor y deploy

- Local: **`node serve.js`** → http://127.0.0.1:8790 (python está bloqueado por macOS en ~/Documents).
- Preview en un archivo: **`node build/inline.js`** → `carta-inline.html` (tope 16 MB).
- Deploy: **Vercel**. `vercel.json` cachea `web-assets` immutable y revalida el HTML.
  `.vercelignore` excluye `Material/`, `fuente/`, `web-assets/demo/`, notas y herramientas.

## Auditoría (corrida y aplicada)

Revisión adversarial de 6 lentes (correctitud, accesibilidad, contraste, integridad de datos,
bilingüe, móvil) + síntesis escéptica. **24 defectos confirmados, aplicados los accionables.**
Destacados corregidos: choque de `id="carta"`; foco atrapado + `inert` en el reverso; reset de
búsqueda al cambiar idioma; re-traducción del reverso abierto; id estable por ítem (evita el bug
latente de nombres repetidos: Morandé, Grand Marrenon, Vía Revolucionaria); precio en el
`aria-label` de los "Ver"; región `aria-live` de resultados; `h1` estable fuera del intro;
foco visible en el buscador; targets táctiles 44px; `svh` con fallback; `-webkit-tap-highlight`;
hora de la casa calculada en `America/Bogota`; atributos iOS del buscador; scroll instantáneo al
cerrar el reverso.

- **Contraste WCAG AA: 0 hallazgos** (verificado contra el parche más claro del fondo).
- **Integridad de datos: sin faltantes ni sobrantes** — 44 ítems + 22 vinos, precios y pareo
  ES↔EN correctos.
- Verbatim conservado a propósito: el descriptor del vino blanco **Morandé Terroir Wines**
  difiere entre ES ("Frutal / Ligero") y EN ("Balanced acidity / Fresh") **porque así está en el
  PDF fuente** (la traducción del cliente es inconsistente). No se "corrigió".
- Pendiente (dependen de hardware real): verificar el scrub del intro en un iPhone físico.
