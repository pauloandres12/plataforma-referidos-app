import { Routes, Route, Link, Outlet, Navigate } from 'react-router-dom'
import Inicio from './paginas/Inicio'
import Registro from './paginas/Registro'
import Login from './paginas/Login'
import InicioSocio from './paginas/InicioSocio'
import PanelAdmin from './paginas/PanelAdmin'

function Layout() {
  return (
    <>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/registro">Registro</Link>
        <Link to="/login">Iniciar sesión</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inicio" element={<InicioSocio />} />
      <Route path="/admin" element={<PanelAdmin />} />
      <Route path="/bienvenida" element={<Navigate to="/inicio" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
      </Route>
    </Routes>
  )
}

export default App