import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { API } from '../api'
import './registro.css'
import logoFondo from '../assets/login/logo-fondo.svg'
import logoIcono from '../assets/login/logo-icono.svg'
import iconoOjo from '../assets/login/ojo.svg'
import iconoFlecha from '../assets/login/flecha.svg'
import iconoAlerta from '../assets/login/alerta.svg'

const CAMPOS = [
  { id: 'nombres', etiqueta: 'Nombres', placeholder: 'Ej. Juan Andrés', tipo: 'text', auto: 'given-name' },
  { id: 'apellidos', etiqueta: 'Apellidos', placeholder: 'Ej. Pérez González', tipo: 'text', auto: 'family-name' },
  { id: 'identificacion', etiqueta: 'Cédula de identidad', placeholder: '1102938475', tipo: 'text', auto: 'off' },
  { id: 'telefono', etiqueta: 'Teléfono celular', placeholder: '0991234567', tipo: 'tel', auto: 'tel' },
  { id: 'correo', etiqueta: 'Correo electrónico', placeholder: 'ejemplo@correo.com', tipo: 'email', auto: 'email' },
]

const PRODUCTOS = [
  { valor: 'ahorro', texto: 'Ahorro' },
  { valor: 'credito', texto: 'Crédito' },
  { valor: 'inversion', texto: 'Inversión' },
]

const VACIO = {
  nombres: '',
  apellidos: '',
  identificacion: '',
  telefono: '',
  correo: '',
  producto_interes: '',
  contrasena: '',
}

function validar(datos, acepto) {
  const e = {}
  for (const k of Object.keys(VACIO)) {
    if (!datos[k].trim()) e[k] = 'Este campo es obligatorio'
  }
  if (!e.identificacion && !/^\d{10}$/.test(datos.identificacion)) e.identificacion = 'La cédula debe tener 10 números'
  if (!e.telefono && !/^09\d{8}$/.test(datos.telefono)) e.telefono = 'Debe tener 10 números y empezar con 09'
  if (!e.correo && !/^\S+@\S+\.\S+$/.test(datos.correo)) e.correo = 'Escribe un correo válido'
  if (!e.contrasena && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(datos.contrasena))
    e.contrasena = 'Mínimo 8 caracteres, con letras y números'
  if (!acepto) e.acepto = 'Debes aceptar el tratamiento de tus datos'
  return e
}

function Registro() {
  const [params] = useSearchParams()
  const codigoInvitacion = params.get('ref') || ''

  const [invitante, setInvitante] = useState(null)
  const [invitacionMala, setInvitacionMala] = useState(false)
  const [datos, setDatos] = useState(VACIO)
  const [acepto, setAcepto] = useState(false)
  const [verContrasena, setVerContrasena] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  // Si llegó con ?ref=CODIGO, buscamos quién lo invitó
  useEffect(() => {
    if (!codigoInvitacion) return
    fetch(`${API}/auth/invitacion/${encodeURIComponent(codigoInvitacion)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Código no válido')
        return res.json()
      })
      .then((json) => setInvitante(json.invitante))
      .catch(() => setInvitacionMala(true))
  }, [codigoInvitacion])

  const cambiar = (campo, valor) => {
    setDatos({ ...datos, [campo]: valor })
    setErrores({ ...errores, [campo]: '' })
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErrorGeneral('')

    const nuevos = validar(datos, acepto)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setCargando(true)
    try {
      const res = await fetch(`${API}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nombres: datos.nombres.trim(),
          apellidos: datos.apellidos.trim(),
          identificacion: datos.identificacion.trim(),
          telefono: datos.telefono.trim(),
          correo: datos.correo.trim(),
          producto_interes: datos.producto_interes,
          contrasena: datos.contrasena,
          acepto_politica: acepto,
          codigo_invitacion: invitante ? codigoInvitacion : undefined,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setExito(true)
        setDatos(VACIO)
        setAcepto(false)
      } else {
        setErrorGeneral(json.mensaje)
      }
    } catch {
      setErrorGeneral('No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  const iniciales = invitante
    ? `${invitante.nombres[0] || ''}${invitante.apellidos[0] || ''}`.toUpperCase()
    : ''

  return (
    <div className="registro-pagina">
      <header className="registro-header">
        <Link to="/login" className="registro-marca">
          <div className="registro-logo">
            <img className="registro-logo-fondo" src={logoFondo} alt="" />
            <img className="registro-logo-icono" src={logoIcono} alt="" />
          </div>
          <div>
            <div className="registro-marca-nombre">
              Coopera <span>++</span>
            </div>
            <div className="registro-marca-sub">COOPERATIVA PADRE JULIÁN LORENTE</div>
          </div>
        </Link>
        <p className="registro-ya">
          ¿Ya eres socio registrado?
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </header>

      {invitante && (
        <div className="registro-invitacion">
          <div className="registro-invitante">
            <div className="registro-avatar">{iniciales}</div>
            <div>
              <strong>
                Te invitó {invitante.nombres} {invitante.apellidos}
              </strong>
              <small>Socio activo • Programa de Beneficios Coopera ++</small>
            </div>
          </div>
          <span className="registro-premio">★ Gana puntos de bienvenida</span>
        </div>
      )}

      {invitacionMala && (
        <div className="registro-invitacion-mala">
          El enlace de invitación no es válido. Puedes registrarte igual sin él.
        </div>
      )}

      <main className="registro-main">
        <div className="registro-tarjeta">
          <div className="registro-cabecera">
            <span className="registro-chip">{invitante ? 'Registro de Referido' : 'Registro de Socio'}</span>
            <span className="registro-estado">Pendiente de verificación</span>
          </div>
          <h2>Únete a Coopera ++</h2>
          <p className="registro-subtitulo">Completa tus datos para activar tu cuenta cooperativa.</p>

          <form className="registro-form" onSubmit={enviar} noValidate>
            <div className="registro-grid">
              {CAMPOS.map((c) => (
                <div key={c.id}>
                  <label className="registro-etiqueta" htmlFor={c.id}>
                    {c.etiqueta}
                    <span>*</span>
                  </label>
                  <div className="registro-entrada">
                    <input
                      id={c.id}
                      type={c.tipo}
                      autoComplete={c.auto}
                      placeholder={c.placeholder}
                      value={datos[c.id]}
                      className={errores[c.id] ? 'invalido' : ''}
                      onChange={(e) => cambiar(c.id, e.target.value)}
                    />
                  </div>
                  {errores[c.id] && <p className="registro-aviso">{errores[c.id]}</p>}
                </div>
              ))}

              <div>
                <label className="registro-etiqueta" htmlFor="producto_interes">
                  Producto de interés
                  <span>*</span>
                </label>
                <div className="registro-entrada">
                  <select
                    id="producto_interes"
                    value={datos.producto_interes}
                    className={`${datos.producto_interes ? '' : 'sin-valor'}${errores.producto_interes ? ' invalido' : ''}`}
                    onChange={(e) => cambiar('producto_interes', e.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    {PRODUCTOS.map((p) => (
                      <option key={p.valor} value={p.valor}>
                        {p.texto}
                      </option>
                    ))}
                  </select>
                </div>
                {errores.producto_interes && <p className="registro-aviso">{errores.producto_interes}</p>}
              </div>

              <div className="registro-ancho">
                <label className="registro-etiqueta" htmlFor="contrasena">
                  Contraseña
                  <span>*</span>
                </label>
                <div className="registro-entrada">
                  <input
                    id="contrasena"
                    type={verContrasena ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres, con letras y números"
                    value={datos.contrasena}
                    className={`con-ojo${errores.contrasena ? ' invalido' : ''}`}
                    onChange={(e) => cambiar('contrasena', e.target.value)}
                  />
                  <button
                    type="button"
                    className="registro-ojo"
                    onClick={() => setVerContrasena(!verContrasena)}
                    aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <img src={iconoOjo} alt="" />
                  </button>
                </div>
                {errores.contrasena && <p className="registro-aviso">{errores.contrasena}</p>}
              </div>
            </div>

            <label className="registro-check">
              <input
                type="checkbox"
                checked={acepto}
                onChange={(e) => {
                  setAcepto(e.target.checked)
                  setErrores({ ...errores, acepto: '' })
                }}
              />
              <span>
                Acepto el tratamiento de mis datos personales (<b>LOPDP</b>).
              </span>
            </label>
            {errores.acepto && <p className="registro-aviso">{errores.acepto}</p>}

            <button type="submit" className="registro-boton" disabled={cargando}>
              {cargando ? (
                'Creando cuenta...'
              ) : (
                <>
                  Crear cuenta <img src={iconoFlecha} alt="" />
                </>
              )}
            </button>
          </form>

          <p className="registro-nota">Tu cuenta quedará pendiente hasta que la Cooperativa la verifique.</p>

          {errorGeneral && (
            <div className="registro-error" role="alert">
              <img src={iconoAlerta} alt="" />
              <span>{errorGeneral}</span>
            </div>
          )}

          {exito && (
            <div className="registro-exito" role="status">
              <span>
                ¡Cuenta creada! Cuando la Cooperativa la active podrás
                <Link to="/login">iniciar sesión</Link>.
              </span>
            </div>
          )}
        </div>
      </main>

      <footer className="registro-pie">
        Cooperativa de Ahorro y Crédito Padre Julián Lorente R.L. • Loja, Ecuador
      </footer>
    </div>
  )
}

export default Registro