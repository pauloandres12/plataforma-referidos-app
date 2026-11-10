import { useState } from 'react'
import { API } from '../api'

function Registro() {
  const [datos, setDatos] = useState({
    nombres: '',
    apellidos: '',
    identificacion: '',
    correo: '',
    telefono: '',
    contrasena: '',
    acepto_politica: false,
  })
  const [respuesta, setRespuesta] = useState(null)

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target
    setDatos({ ...datos, [name]: type === 'checkbox' ? checked : value })
  }

  const enviar = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datos),
      })
      const json = await res.json()
      setRespuesta({ ok: res.ok, mensaje: json.mensaje })
    } catch {
      setRespuesta({ ok: false, mensaje: 'No se pudo conectar con el servidor' })
    }
  }

  return (
    <div>
      <h1>Registro de socios</h1>
      <form onSubmit={enviar}>
        <label>
          Nombres
          <input type="text" name="nombres" value={datos.nombres} onChange={cambiar} />
        </label>
        <label>
          Apellidos
          <input type="text" name="apellidos" value={datos.apellidos} onChange={cambiar} />
        </label>
        <label>
          Número de identificación
          <input type="text" name="identificacion" value={datos.identificacion} onChange={cambiar} />
        </label>
        <label>
          Correo electrónico
          <input type="email" name="correo" value={datos.correo} onChange={cambiar} />
        </label>
        <label>
          Teléfono (opcional)
          <input type="text" name="telefono" value={datos.telefono} onChange={cambiar} />
        </label>
        <label>
          Contraseña (mínimo 8 caracteres, con letras y números)
          <input type="password" name="contrasena" value={datos.contrasena} onChange={cambiar} />
        </label>
        <label className="casilla">
          <input
            type="checkbox"
            name="acepto_politica"
            checked={datos.acepto_politica}
            onChange={cambiar}
          />
          Acepto la política de privacidad
        </label>
        <button type="submit">Registrarme</button>
        {respuesta && (
          <div className={`mensaje ${respuesta.ok ? 'ok' : 'error'}`}>{respuesta.mensaje}</div>
        )}
      </form>
    </div>
  )
}

export default Registro