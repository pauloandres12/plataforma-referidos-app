import { useState } from 'react'
import { API } from '../api'

function Login() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [respuesta, setRespuesta] = useState(null)

  const enviar = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ correo, contrasena }),
      })
      const json = await res.json()
      const mensaje = res.ok ? `${json.mensaje}. Bienvenido, ${json.usuario.nombres}` : json.mensaje
      setRespuesta({ ok: res.ok, mensaje })
    } catch {
      setRespuesta({ ok: false, mensaje: 'No se pudo conectar con el servidor' })
    }
  }

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={enviar}>
        <label>
          Correo electrónico
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        </label>
        <button type="submit">Entrar</button>
        {respuesta && (
          <div className={`mensaje ${respuesta.ok ? 'ok' : 'error'}`}>{respuesta.mensaje}</div>
        )}
      </form>
    </div>
  )
}

export default Login