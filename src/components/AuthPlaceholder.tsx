/**
 * Marcador hasta definir cómo el host inyecta sesión (token, usuario, claims).
 * No añadir secretos ni flujos OAuth acoplados al remote aislado.
 */
export function AuthPlaceholder() {
  return (
    <section
      className="rounded-[0.5rem] border border-[#fcd34d] border-l-[6px] border-l-[#eab308] bg-[#fefce8] p-5 text-left"
      aria-labelledby="auth-placeholder-title"
    >
      <h3
        id="auth-placeholder-title"
        className="text-lg font-semibold text-st-body"
      >
        Autenticación
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-st-muted-text">
        Este remote <strong className="text-st-body">no impone</strong> un proveedor OAuth
        propio. Cuando se conecte con el host, se documentará cómo el host pasa usuario,
        token o contexto (por ejemplo vía props, contexto compartido o runtime MF).{' '}
        <strong className="text-st-body">Pendiente de definir.</strong>
      </p>
    </section>
  )
}
