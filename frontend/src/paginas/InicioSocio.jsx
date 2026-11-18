import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api'
import './inicio.css'
import logoIcono from '../assets/login/logo-icono.svg'

function InicioSocio() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    fetch(`${API}/auth/yo`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Sin sesión')
        return res.json()
      })
      .then((json) => {
        if (json.usuario.rol === 'administrador') navigate('/admin')
        else setUsuario(json.usuario)
      })
      .catch(() => navigate('/login'))
  }, [navigate])

  const cerrarSesion = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    navigate('/login')
  }

  if (!usuario) return <p style={{ padding: 32 }}>Cargando...</p>

  const enlace = `${window.location.origin}/registro?ref=${usuario.codigo_referido}`
  const iniciales = `${usuario.nombres[0] || ''}${usuario.apellidos[0] || ''}`.toUpperCase()

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      window.prompt('Copia tu enlace:', enlace)
    }
  }

  return (
    <div className="ini-pagina">
      <header className="ini-header">
        <div className="ini-marca">
          <div className="ini-logo">
            <img src={logoIcono} alt="" />
          </div>
          <div>
            <div className="ini-marca-nombre">
              Coopera <span>++</span>
            </div>
            <div className="ini-marca-sub">PADRE JULIÁN LORENTE</div>
          </div>
        </div>

        <div className="ini-menu">
          <span className="activo">Inicio</span>
          <span title="Próximamente">Mis Referidos</span>
          <span title="Próximamente">Puntos y Recompensas</span>
          <span title="Próximamente">Aprende</span>
          <span title="Próximamente">Comunidad</span>
        </div>

        <div className="ini-derecha">
          <span className="ini-puntos-pill">★ 0 pts</span>
          <span className="ini-estado-pill">SOCIO ACTIVO</span>
          <div className="ini-avatar">{iniciales}</div>
          <div className="ini-usuario">
            {usuario.nombres} {usuario.apellidos[0]}.
            <small>{usuario.codigo_referido}</small>
          </div>
          <button className="ini-salir" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="ini-contenido">
        <div className="ini-saludo">
          <h1>Hola, {usuario.nombres} 👋</h1>
          <p>Panel principal de socio · {usuario.correo}</p>
        </div>

        <div className="ini-kpis">
          <div className="ini-kpi">
            <div className="ini-kpi-titulo">Puntos acumulados</div>
            <div className="ini-kpi-valor dorado">0 pts</div>
            <div className="ini-kpi-nota">Gana puntos con tus referidos</div>
          </div>
          <div className="ini-kpi">
            <div className="ini-kpi-titulo">Nivel de socio</div>
            <div className="ini-kpi-valor">Bronce</div>
            <div className="ini-kpi-nota">1.000 pts para Nivel Plata</div>
          </div>
          <div className="ini-kpi">
            <div className="ini-kpi-titulo">Personas invitadas</div>
            <div className="ini-kpi-valor">{usuario.invitados}</div>
            <div className="ini-kpi-nota">{usuario.invitados_activos} con cuenta activa</div>
          </div>
          <div className="ini-kpi">
            <div className="ini-kpi-titulo">Insignias ganadas</div>
            <div className="ini-kpi-valor">0</div>
            <div className="ini-kpi-nota">Próxima: Primer referido</div>
          </div>
        </div>

        <div className="ini-fila">
          <div className="ini-banner">
            <span className="ini-chip">CAMPAÑA VIGENTE</span>
            <h2>Recomienda a un amigo y gana puntos</h2>
            <p>Comparte tu enlace. Cuando tu invitado se registre, quedará vinculado a tu cuenta.</p>
            <div className="ini-enlace">
              <code>{enlace}</code>
              <button className="ini-copiar" onClick={copiar}>
                {copiado ? '¡Copiado!' : 'Copiar enlace'}
              </button>
            </div>
            <div className="ini-codigo">
              Tu código de referido: <b>{usuario.codigo_referido}</b>
            </div>
          </div>

          <div className="ini-caja">
            <h3>Notificaciones</h3>
            <div className="ini-noti">
              Bienvenido a Coopera ++
              <small>Tu cuenta está activa</small>
            </div>
            {usuario.invitados > 0 && (
              <div className="ini-noti">
                {usuario.invitados} persona(s) se registraron con tu enlace
                <small>{usuario.invitados_activos} ya tienen la cuenta activa</small>
              </div>
            )}
            <div className="ini-noti">
              Completa tu perfil
              <small>Próximamente</small>
            </div>
          </div>
        </div>

        <div className="ini-accesos">
          <div className="ini-acceso">
            <strong>Próximo taller</strong>
            <small>Ahorro inteligente para tu familia</small>
            <span className="ini-pronto">Próximamente</span>
          </div>
          <div className="ini-acceso">
            <strong>Reto de la semana</strong>
            <small>Invita a 1 amigo y gana +50 pts</small>
            <span className="ini-pronto">Próximamente</span>
          </div>
          <div className="ini-acceso">
            <strong>Juego financiero</strong>
            <small>Trivia cooperativa (+30 pts)</small>
            <span className="ini-pronto">Próximamente</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InicioSocio