import { Routes, Route, Link, Outlet } from 'react-router-dom'
import Inicio from './paginas/Inicio'
import Registro from './paginas/Registro'
import Login from './paginas/Login'
import Bienvenida from './paginas/Bienvenida'

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
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/bienvenida" element={<Bienvenida />} />
      </Route>
    </Routes>
  )
}

export default App