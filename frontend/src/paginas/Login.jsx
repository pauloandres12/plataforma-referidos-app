import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../api'
import './login.css'
import logoFondo from '../assets/login/logo-fondo.svg'
import logoIcono from '../assets/login/logo-icono.svg'
import iconoInsignia from '../assets/login/insignia.svg'
import iconoCorreo from '../assets/login/correo.svg'
import iconoCandado from '../assets/login/candado.svg'
import iconoOjo from '../assets/login/ojo.svg'
import iconoFlecha from '../assets/login/flecha.svg'
import iconoAlerta from '../assets/login/alerta.svg'
import iconoEscudo from '../assets/login/escudo.svg'

function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setErrorGeneral('')

    const nuevos = {}
    if (!correo.trim()) nuevos.correo = 'Este campo es obligatorio'
    if (!contrasena) nuevos.contrasena = 'Este campo es obligatorio'
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setCargando(true)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ correo: correo.trim(), contrasena }),
      })
      const json = await res.json()
      if (res.ok) {
        navigate('/bienvenida')
      } else {
        setErrorGeneral(json.mensaje)
      }
    } catch {
      setErrorGeneral('No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-pagina">
      <section className="login-izq">
        <div className="login-marca">
          <div className="login-logo">
            <img className="login-logo-fondo" src={logoFondo} alt="" />
            <img className="login-logo-icono" src={logoIcono} alt="" />
          </div>
          <div>
            <div className="login-marca-nombre">
              Coopera <span>++</span>
            </div>
            <div className="login-marca-sub">COOPERATIVA PADRE JULIÁN LORENTE</div>
          </div>
        </div>

        <div className="login-hero">
          <div className="login-insignia">
            <img src={iconoInsignia} alt="" />
            Plataforma Oficial de Beneficios
          </div>
          <h1>
            Recomienda, participa y gana
            <br />
            recompensas
          </h1>
          <p>
            Tu lealtad cooperativa ahora impulsa nuevas oportunidades y
            <br />
            beneficios exclusivos para socios.
          </p>
        </div>

        <div className="login-pie">
          <span className="login-pie-seguro">
            <img src={iconoEscudo} alt="" />
            Conexión segura y datos protegidos
          </span>
          <span>Loja, Ecuador</span>
        </div>
      </section>

      <section className="login-der">
        <div className="login-tarjeta">
          <h2>Iniciar Sesión</h2>
          <p className="login-subtitulo">Ingresa a tu cuenta de Coopera ++</p>

          <form className="login-form" onSubmit={enviar} noValidate>
            <div className="login-campo">
              <label className="login-etiqueta" htmlFor="correo">
                Correo Electrónico
              </label>
              <div className="login-entrada">
                <img src={iconoCorreo} alt="" />
                <input
                  id="correo"
                  type="email"
                  autoComplete="email"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  className={errores.correo ? 'invalido' : ''}
                  onChange={(e) => {
                    setCorreo(e.target.value)
                    setErrores({ ...errores, correo: '' })
                  }}
                />
              </div>
              {errores.correo && <p className="login-aviso">{errores.correo}</p>}
            </div>

            <div className="login-campo">
              <label className="login-etiqueta" htmlFor="contrasena">
                Contraseña
              </label>
              <div className="login-entrada">
                <img src={iconoCandado} alt="" />
                <input
                  id="contrasena"
                  type={verContrasena ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={contrasena}
                  className={`con-ojo${errores.contrasena ? ' invalido' : ''}`}
                  onChange={(e) => {
                    setContrasena(e.target.value)
                    setErrores({ ...errores, contrasena: '' })
                  }}
                />
                <button
                  type="button"
                  className="login-ojo"
                  onClick={() => setVerContrasena(!verContrasena)}
                  aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <img src={iconoOjo} alt="" />
                </button>
              </div>
              {errores.contrasena && <p className="login-aviso">{errores.contrasena}</p>}
            </div>

            {/* Pendiente: la recuperación de contraseña se hará más adelante */}
            <a href="#recuperar" className="login-olvido" onClick={(e) => e.preventDefault()}>
              ¿Olvidaste tu contraseña?
            </a>

            <button type="submit" className="login-boton" disabled={cargando}>
              {cargando ? (
                'Ingresando...'
              ) : (
                <>
                  Ingresar <img src={iconoFlecha} alt="" />
                </>
              )}
            </button>
          </form>

          <p className="login-cuenta">
            ¿No tienes cuenta?
            <Link to="/registro">Crear cuenta</Link>
          </p>

          {errorGeneral && (
            <div className="login-error" role="alert">
              <img src={iconoAlerta} alt="" />
              <span>{errorGeneral}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Login