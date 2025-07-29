"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import logo from "../components/IMG/logo.jpg"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Función para validar credenciales contra la API
  const validateCredentials = async (correo, contrasena) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/usuarios/")

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const usuarios = await response.json()
      console.log("Usuarios obtenidos:", usuarios)

      // Buscar usuario por correo
      const usuario = usuarios.find((user) => user.correo === correo)

      if (!usuario) {
        return { success: false, message: "Correo electrónico no encontrado" }
      }

      // Validar contraseña
      if (usuario.contrasena_hash === contrasena) {
        return {
          success: true,
          user: {
            id: usuario.id,
            nombre_usuario: usuario.nombre_usuario,
            correo: usuario.correo,
            rol: usuario.rol,
          },
        }
      } else {
        return { success: false, message: "Contraseña incorrecta" }
      }
    } catch (error) {
      console.error("Error al validar credenciales:", error)
      return {
        success: false,
        message: "Error de conexión. Verifique su conexión a internet.",
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validar campos
      if (!email.trim() || !password.trim()) {
        setError("Por favor complete todos los campos")
        setIsLoading(false)
        return
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Por favor ingrese un correo electrónico válido")
        setIsLoading(false)
        return
      }

      // Validar credenciales contra la API
      const result = await validateCredentials(email, password)

      if (result.success) {
        // Guardar información del usuario autenticado
        const userInfo = {
          ...result.user,
          loginTime: new Date().toISOString(),
          rememberMe: rememberMe,
        }

        // Guardar en localStorage o sessionStorage según "Recordarme"
        if (rememberMe) {
          localStorage.setItem("userSession", JSON.stringify(userInfo))
        } else {
          sessionStorage.setItem("userSession", JSON.stringify(userInfo))
        }

        // Redireccionar según el rol
        switch (result.user.rol.toLowerCase()) {
          case "administrador":
          case "admin":
            navigate("/InicioAdmin")
            break
          case "usuario":
            navigate("/InicioUsuario")
            break
          case "tecnico":
            navigate("/InicioTecnico")
            break
          default:
            navigate("/InicioUsuario") // Ruta por defecto
        }

        console.log("Login exitoso:", result.user)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error durante el login:", error)
      setError("Error inesperado. Por favor intente nuevamente.")
    } finally {
      setIsLoading(false)
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
                <img src={logo || "/placeholder.svg"} alt="Logo" className="img-fluid" style={{ maxHeight: "175px" }} />
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
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
                      color: "#fff",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verificando...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
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
