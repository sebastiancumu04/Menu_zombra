# Zombra — carta digital

Carta digital bilingüe (ES/EN) de **Zombra**, cocina singular del chef Pablo Naranjo en
El Poblado, Medellín. Un solo `index.html`, sin dependencias ni build para el sitio real.

## Correr en local

```bash
node serve.js
```

Abre http://127.0.0.1:8790 (usa rangos para el video del intro). En `~/Documents`, macOS
bloquea python: por eso el servidor y el empaquetador son Node.

## Empaquetar un preview en un archivo

```bash
node build/inline.js
```

Incrusta video, fotos, tipografías y logo como data-URI en `carta-inline.html`
(tope del visor: 16 MB; el script imprime el margen).

## Deploy (Vercel)

`vercel.json` cachea `web-assets/` como `immutable` y revalida el HTML. `.vercelignore`
excluye los másters (`Material/`, `fuente/`), el juego de demo y las herramientas locales.

## Estructura

```
index.html            La carta (estructura + estilos + lógica, todo inline)
web-assets/           Assets de producción: intro.mp4, logo.webp, fonts/, platos/*.webp
fuente/               Menús PDF originales (ES/EN) — respaldo, no se publica
Material/             Másters: video en bruto, fotos originales, logos — no se publica
build/inline.js       Empaquetador a archivo único para previews
serve.js              Servidor estático local con soporte de rangos
NOTAS-INTERNAS.md     Pendientes de la casa y decisiones — NO va al comensal
```

## Identidad

Negro `#000` · hueso `#EFEDE7` · rojo de marca `#E1111A`. Tipografías Playfair Display
(display) + Heebo (texto). Claroscuro: el negro manda, la luz cae donde importa.

## Bilingüe

Todos los textos de interfaz salen de un diccionario (`DICT`); cada producto lleva
`{es,en}` en nombre y descripción. El conmutador ES/EN cambia el atributo `lang`, los
`aria-label` y todo el contenido. El idioma **no** persiste entre recargas.
