"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import logo from '../components/IMG/logo.jpg';

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Usuarios de prueba
  const users = [
    { email: "admin123@example.com", password: "admin123", role: "Admin" },
    { email: "user123@example.com", password: "user123", role: "Usuario" }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    )

    if (foundUser) {

      // Redirige según el rol
      if (foundUser.role === "Admin") {
        navigate("/InicioAdmin") // Ruta para Gerente
      } else if (foundUser.role === "Usuario") {
        navigate("/InicioUsuario") // Ruta para Técnico
      }

    } else {
      setError("Correo o contraseña incorrectos.")
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-3">Iniciar Sesión</h2>

              <div className="d-flex justify-content-center mb-4">
                <img
                  src={logo}
                  alt="Logo"
                  className="img-fluid"
                  style={{ maxHeight: "175px" }}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Recordarme
                  </label>
                </div>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: "#6f42c1",
                      borderColor: "#6f42c1",
                      color: "#fff"
                    }}
                  >
                    Iniciar Sesión
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <a href="#" className="text-decoration-none">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="mt-3 text-center">
                  <span>¿No tienes una cuenta? </span>
                  <a href="#" className="text-decoration-none">
                    Regístrate
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
