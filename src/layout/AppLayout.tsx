import { NavLink, Outlet } from 'react-router-dom'

const linkClass =
  'block rounded-lg px-3 py-2 text-sm font-medium text-st-body transition hover:bg-white hover:text-st-body'
const activeClass = 'bg-white text-st-primary shadow-sm ring-1 ring-st-border'

/**
 * Ocupa todo el alto/ancho disponible: standalone (`App` ya da `min-h-svh`), y en hub el padre usa
 * `HOST_HUB_EMBED_FILL_CLASS` para estirar el remote. Mantener esta cadena flexible (no usar
 * solo `min-h-svh` aquí dentro del área del hub, evitaría scrollbar doble — ver docs del host).
 */
export function AppLayout() {
  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 overflow-hidden bg-st-bg">
      <aside className="flex w-44 shrink-0 flex-col border-r border-st-border bg-st-muted-bg">
        <div className="border-b border-st-border px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-st-muted-text">Menú</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          <NavLink to="." end className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}>
            Calculadora
          </NavLink>
          <NavLink
            to="buscamina"
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
          >
            Buscamina
          </NavLink>
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
        <Outlet />
      </div>
    </div>
  )
}
