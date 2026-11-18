import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api'

function Bienvenida() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    fetch(`${API}/auth/yo`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Sin sesión')
        return res.json()
      })
      .then((json) => setUsuario(json.usuario))
      .catch(() => navigate('/login'))
  }, [navigate])

  const cerrarSesion = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    navigate('/login')
  }

  if (!usuario) return <p>Cargando...</p>

  return (
    <div>
      <h1>Bienvenido, {usuario.nombres}</h1>
      <p>Rol: {usuario.rol}</p>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  )
}

export default Bienvenida