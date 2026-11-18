import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api'
import './admin.css'
import logoIcono from '../assets/login/logo-icono.svg'

const PRODUCTO = { ahorro: 'Ahorro', credito: 'Crédito', inversion: 'Inversión' }
const PESTANAS = [
  { id: 'pendiente', texto: 'Pendientes' },
  { id: 'activa', texto: 'Activas' },
  { id: 'inactiva', texto: 'Inactivas' },
  { id: 'todos', texto: 'Todos' },
]

function PanelAdmin() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [pestana, setPestana] = useState('pendiente')
  const [aviso, setAviso] = useState(null)

  const cargarUsuarios = useCallback(async () => {
    const res = await fetch(`${API}/admin/usuarios`, { credentials: 'include' })
    if (res.ok) {
      const json = await res.json()
      setUsuarios(json.usuarios)
    }
  }, [])

  useEffect(() => {
    fetch(`${API}/auth/yo`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Sin sesión')
        return res.json()
      })
      .then((json) => {
        if (json.usuario.rol !== 'administrador') {
          navigate('/inicio')
          return
        }
        setAdmin(json.usuario)
        cargarUsuarios()
      })
      .catch(() => navigate('/login'))
  }, [navigate, cargarUsuarios])

  const cambiarEstado = async (usuario, estado) => {
    setAviso(null)
    const res = await fetch(`${API}/admin/usuarios/${usuario.id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ estado }),
    })
    const json = await res.json()
    setAviso({ ok: res.ok, texto: res.ok ? `${json.mensaje}: ${usuario.nombres} ${usuario.apellidos}` : json.mensaje })
    if (res.ok) cargarUsuarios()
  }

  const cerrarSesion = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    navigate('/login')
  }

  if (!admin) return <p style={{ padding: 32 }}>Cargando...</p>

  const contar = (estado) => usuarios.filter((u) => u.estado === estado).length
  const lista = pestana === 'todos' ? usuarios : usuarios.filter((u) => u.estado === pestana)

  return (
    <div className="adm-pagina">
      <aside className="adm-lateral">
        <div className="adm-marca">
          <div className="adm-logo">
            <img src={logoIcono} alt="" />
          </div>
          <div>
            <div className="adm-marca-nombre">
              Coopera <span>++</span>
            </div>
            <div className="adm-marca-sub">PANEL ADMINISTRADOR</div>
          </div>
        </div>

        <div className="adm-item activo">Usuarios</div>
        <div className="adm-item">Referidos <small>Próximamente</small></div>
        <div className="adm-item">Campañas y retos <small>Próximamente</small></div>
        <div className="adm-item">Recompensas <small>Próximamente</small></div>
        <div className="adm-item">Reportes <small>Próximamente</small></div>

        <div className="adm-pie">
          {admin.nombres} {admin.apellidos}
          <small>Administrador</small>
          <button className="adm-salir" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="adm-contenido">
        <div className="adm-migas">PLATAFORMA COOPERA ++ · SEGURIDAD Y CONTROL</div>
        <h1>Gestión de Usuarios</h1>
        <p>Verifica y activa las cuentas nuevas de socios y referidos.</p>

        <div className="adm-kpis">
          <div className="adm-kpi">
            <span>Usuarios totales</span>
            <b>{usuarios.length}</b>
          </div>
          <div className="adm-kpi">
            <span>Por verificar</span>
            <b className="naranja">{contar('pendiente')}</b>
          </div>
          <div className="adm-kpi">
            <span>Cuentas activas</span>
            <b className="verde">{contar('activa')}</b>
          </div>
          <div className="adm-kpi">
            <span>Cuentas inactivas</span>
            <b className="rojo">{contar('inactiva')}</b>
          </div>
        </div>

        {aviso && <div className={`adm-aviso${aviso.ok ? '' : ' error'}`}>{aviso.texto}</div>}

        <div className="adm-tarjeta">
          <div className="adm-pestanas">
            {PESTANAS.map((p) => (
              <button
                key={p.id}
                className={`adm-pestana${pestana === p.id ? ' activa' : ''}`}
                onClick={() => setPestana(p.id)}
              >
                {p.texto} ({p.id === 'todos' ? usuarios.length : contar(p.id)})
              </button>
            ))}
          </div>

          {lista.length === 0 ? (
            <div className="adm-vacio">No hay usuarios en esta lista.</div>
          ) : (
            <table className="adm-tabla">
              <thead>
                <tr>
                  <th>Nombre y cédula</th>
                  <th>Correo y teléfono</th>
                  <th>Producto</th>
                  <th>Invitado por</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <b>{u.nombres} {u.apellidos}</b>
                      <small>{u.identificacion}</small>
                    </td>
                    <td>
                      {u.correo}
                      <small>{u.telefono || '—'}</small>
                    </td>
                    <td>{PRODUCTO[u.producto_interes] || '—'}</td>
                    <td>{u.invitado_por || '—'}</td>
                    <td>{u.rol}</td>
                    <td>
                      <span className={`adm-estado ${u.estado}`}>{u.estado}</span>
                    </td>
                    <td>
                      {u.id === admin.id ? (
                        <small>Tu cuenta</small>
                      ) : u.estado === 'activa' ? (
                        <button className="adm-desactivar" onClick={() => cambiarEstado(u, 'inactiva')}>
                          Desactivar
                        </button>
                      ) : (
                        <button className="adm-activar" onClick={() => cambiarEstado(u, 'activa')}>
                          Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default PanelAdmin