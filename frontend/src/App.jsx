import { Routes, Route, Link } from 'react-router-dom'
import Inicio from './paginas/Inicio'
import Registro from './paginas/Registro'
import Login from './paginas/Login'

function App() {
  return (
    <>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/registro">Registro</Link>
        <Link to="/login">Iniciar sesión</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  )
}

export default App