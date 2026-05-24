# Vite + React + Module Federation (este repo)

Complemento a [AGENTS.md](../AGENTS.md) y [stack.md](stack.md). Sustituye el rol de **`streamlit-notes.md`** del seed Streamlit hermano.

## Entry y routers

- **Standalone**: [src/App.tsx](../src/App.tsx) usa `BrowserRouter` + [AppRoutes](../src/router/AppRoutes.tsx).
- **Remote federado**: [RemoteShell.tsx](../src/mf-remote/RemoteShell.tsx) envuelve las mismas rutas con **`MemoryRouter`** para no competir con el historial del **host**.
- Vista principal del producto del seed (copy + especificación): **[SeedLandingPage.tsx](../src/pages/SeedLandingPage.tsx)** una sola pantalla `/`.

## Navbar y chrome

Este seed **no** incluye navbar de aplicación; el host la provee. El layout sólo contenido ([AppLayout.tsx](../src/layout/AppLayout.tsx)).

## Estilos (look tipo Streamlit)

- Tokens y helpers en [src/index.css](../src/index.css): colores `#FF4B4B` primario, fondos `#fff` / `#f0f2f6`, texto `#31333f`, enlaces `#0068c9`; fuentes IBM Plex cargadas en [index.html](../index.html).
- Preferir `.st-inline-code`, `.st-btn-primary`, `.st-btn-secondary` antes de nuevo sistema de botones si el objetivo es coherencia con apps Streamlit del mismo equipo.

## Module Federation + URLs

- Producción/CDN: alinear **`VITE_REMOTE_BASE`** con la URL donde se publican chunks; errores típicos = 404 de assets cuando el host carga desde otro origin.
- [nginx.conf](../nginx.conf) incluye headers útiles para carga entre orígenes; revisar CORP/CORS con seguridad corporativa del host.

## Auth

- **No** hay proveedor OAuth en el remote sólo; [AuthPlaceholder](../src/components/AuthPlaceholder.tsx) documenta pendiente del puente con el host ([AGENTS.md](../AGENTS.md)).

## Favicon + título de pestaña (paridad Streamlit)

- Streamlit arma la pestaña con **`configure_page`** → `st.set_page_config`: título combinado **`{title} · {PLATFORM_APP_TITLE}`** (ej. `Inicio · Boogiepop Streamlit Seed`; `PLATFORM_APP_TITLE` en `seed_main.py`).
- En este repo, [index.html](../index.html): **`<title>Inicio · Boogiepop React Remote Seed</title>`** (equiv. plataforma = “Boogiepop React Remote Seed”).
- [public/favicon.svg](../public/favicon.svg): **brote dibujado en SVG** (no emoji), fondo **`#f0f2f6`**, paralelo conceptual al 🌱 de Streamlit.

## ESLint

- Ejecutar `npm run lint` tras cambios de UI o imports grandes.
