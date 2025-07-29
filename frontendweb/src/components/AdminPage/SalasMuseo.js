"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Alert, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Menu from "../menus/MenuAdmin"
import logo from "../IMG/logo.jpg"
import Header from "../headers/header"
import "../CSS/ListaInteractivos.css"
import SalaProyeccion from "../Salas/SalaProyeccion"

const SalasMuseo = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [salas, setSalas] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

const salasRoutes = {
  Integra: "/Sala-Integra",
  Explica: "/Sala-Explica",
  Experimenta: "/Sala-Experimenta",
  Educa: "/Sala-Educa",
  Genera: "/Sala-Genera",
  Valora: "/Sala-Valora",
  SalaDeUsosMultiples: "/Sala-Usos-Multiples",
  SalaProyeccion: "/Sala-De-Proyeccion",
}

  const getSalaRoute = (nombreSala) => {
    const rutaEspecifica = salasRoutes[nombreSala]

    if (rutaEspecifica) {
      return rutaEspecifica
    }

    const rutaGenerada = `/${nombreSala.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}`

    console.warn(`Ruta no encontrada para "${nombreSala}", usando ruta generada: ${rutaGenerada}`)
    return rutaGenerada
  }

  const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },

    withCredentials: false,
  })

  // Interceptor para manejar errores globalmente
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Error en la petición:", error)
      return Promise.reject(error)
    },
  )

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Función para obtener datos de la API usando Axios
  const fetchSalas = async () => {
    try {
      setLoading(true)
      setError(null)

      // Usando Axios en lugar de fetch
      const response = await apiClient.get("/salas/")

      // Con Axios, los datos ya vienen parseados en response.data
      const data = response.data

      // Procesar los datos de la API para adaptarlos a nuestro componente
      const salasProcessed = data.map((sala) => ({
        id: sala.id,
        nombre: sala.nombre,
        ubicacion: sala.ubicacion,
        descripcion: sala.descripcion,
        // Generamos un color aleatorio para cada sala
        color: getRandomColor(),
        // Simulamos interactivos vacíos ya que no vienen en la API
        interactivos: [],
        // Usamos una imagen de placeholder
        imagen: "/placeholder.svg?height=200&width=300",
        // Agregamos la ruta específica para cada sala
        ruta: getSalaRoute(sala.nombre),
      }))

      setSalas(salasProcessed)
      showNotification("Salas cargadas correctamente", "success")
    } catch (err) {
      console.error("Error al cargar las salas:", err)

      // Manejo de errores específicos de Axios
      let errorMessage = "Error desconocido"

      if (err.response) {
        // El servidor respondió con un código de error
        errorMessage = `Error ${err.response.status}: ${err.response.statusText}`
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = "No se pudo conectar con el servidor"
      } else {
        // Error en la configuración de la petición
        errorMessage = err.message
      }

      setError(errorMessage)
      showNotification("Error al cargar las salas: " + errorMessage, "danger")
    } finally {
      setLoading(false)
    }
  }

  // Función para crear una nueva sala (ejemplo de POST con Axios)
  const crearSala = async (nuevaSala) => {
    try {
      const response = await apiClient.post("/salas/", nuevaSala)
      showNotification("Sala creada correctamente", "success")
      fetchSalas() // Recargar la lista
      return response.data
    } catch (err) {
      console.error("Error al crear la sala:", err)
      showNotification("Error al crear la sala", "danger")
      throw err
    }
  }

  // Función para actualizar una sala (ejemplo de PUT con Axios)
  const actualizarSala = async (id, salaActualizada) => {
    try {
      const response = await apiClient.put(`/salas/${id}/`, salaActualizada)
      showNotification("Sala actualizada correctamente", "success")
      fetchSalas() // Recargar la lista
      return response.data
    } catch (err) {
      console.error("Error al actualizar la sala:", err)
      showNotification("Error al actualizar la sala", "danger")
      throw err
    }
  }

  // Función para eliminar una sala (ejemplo de DELETE con Axios)
  const eliminarSala = async (id) => {
    try {
      await apiClient.delete(`/salas/${id}/`)
      showNotification("Sala eliminada correctamente", "success")
      fetchSalas() // Recargar la lista
    } catch (err) {
      console.error("Error al eliminar la sala:", err)
      showNotification("Error al eliminar la sala", "danger")
      throw err
    }
  }

  // Función para generar colores aleatorios
  const getRandomColor = () => {
    const colors = [
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
      "#F8C471",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  useEffect(() => {
    fetchSalas()
  }, [])

  const filtrarSalas = () => {
    return salas.filter(
      (sala) =>
        sala.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        sala.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        sala.ubicacion.toLowerCase().includes(busqueda.toLowerCase()),
    )
  }

  // Función actualizada para manejar la navegación a rutas específicas
  const handleVerSala = (sala) => {
    const rutaEspecifica = getSalaRoute(sala.nombre)

    console.log(`Navegando a la sala "${sala.nombre}" con ruta: ${rutaEspecifica}`)

    // Navegar a la ruta específica de la sala
    navigate(rutaEspecifica, {
      state: {
        salaId: sala.id,
        nombreSala: sala.nombre,
        salaData: sala,
      },
    })
  }

  const getEstadoSala = () => {
    return {
      icon: "check-circle",
      color: "success",
      estado: "Activa",
    }
  }

  const salasFiltradas = filtrarSalas()

  const handleRecargar = () => {
    fetchSalas()
  }

  return (
    <div className="container">
      {/* Notificación */}
      {notification && (
        <Alert
          variant={notification.type}
          className="position-fixed"
          style={{ top: "20px", right: "20px", zIndex: 9999 }}
          dismissible
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      <Header />
      <Menu onToggle={handleMenuToggle} />

      <div
        className="main-content"
        style={{
          marginLeft: isMenuOpen ? "200px" : "0",
        }}
      >
        <Container fluid className="py-4">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="header-gradient p-4 rounded-3 text-white shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h1 className="h2 mb-2 fw-bold text-white">
                      <i className="bi bi-building me-3"></i>
                      Salas del Museo
                    </h1>
                    <p className="mb-0 opacity-90 text-white">Vista general de todas las salas</p>
                    <small className="text-white-50">Total: {salas.length} salas</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={handleRecargar}
                      disabled={loading}
                      className="me-3"
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      {loading ? "Cargando..." : "Recargar"}
                    </Button>
                    <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Búsqueda */}
          <Row className="mb-4">
            <Col md={12}>
              <div className="search-container">
                <InputGroup>
                  <Form.Control
                    className="search-input"
                    placeholder="Buscar sala por nombre, ubicación o descripción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    disabled={loading}
                  />
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </Col>
          </Row>

          {/* Estado de carga */}
          {loading && (
            <Row>
              <Col>
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Cargando salas...</p>
                </div>
              </Col>
            </Row>
          )}

          {/* Estado de error */}
          {error && !loading && (
            <Row>
              <Col>
                <Alert variant="danger" className="text-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Error al cargar las salas:</strong> {error}
                  <div className="mt-3">
                    <Button variant="outline-danger" onClick={handleRecargar}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Intentar de nuevo
                    </Button>
                  </div>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Grid de Salas */}
          {!loading && !error && (
            <Row className="g-4">
              {salasFiltradas.map((sala) => {
                const estadoSala = getEstadoSala()
                return (
                  <Col lg={4} md={6} key={sala.id} className="mb-4">
                    <Card className="interactive-card h-100">
                      <div
                        className="card-img-top position-relative"
                        style={{
                          height: "200px",
                          background: `linear-gradient(135deg, ${sala.color}20 0%, ${sala.color}40 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div className="text-center">
                          <i
                            className="bi bi-building"
                            style={{
                              fontSize: "4rem",
                              color: sala.color,
                              opacity: 0.8,
                            }}
                          ></i>
                        </div>
                        <div className="position-absolute top-0 end-0 m-3">
                          <Badge bg={estadoSala.color} className="badge-custom">
                            <i className={`bi bi-${estadoSala.icon} me-1`}></i>
                            {estadoSala.estado}
                          </Badge>
                        </div>
                      </div>

                      <Card.Body className="interactive-card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Card.Title className="interactive-title">{sala.nombre}</Card.Title>
                          <Badge bg="info" className="badge-custom badge-category">
                            {sala.ubicacion}
                          </Badge>
                        </div>

                        <Card.Text className="interactive-description text-muted">{sala.descripcion}</Card.Text>

                        {/* Información adicional */}
                        <div className="mb-3">
                          <div>
                            <small className="text-muted">
                              <i className="bi bi-geo-alt me-1"></i>
                              Ubicación: {sala.ubicacion}
                            </small>
                          </div>
                          <div className="mt-1">
                            <small className="text-muted">
                              <i className="bi bi-link-45deg me-1"></i>
                              Ruta: {getSalaRoute(sala.nombre)}
                            </small>
                          </div>
                        </div>

                        <div className="action-buttons mt-auto">
                          <Button
                            variant="primary"
                            className="btn-custom btn-primary-custom w-100"
                            onClick={() => handleVerSala(sala)}
                          >
                            <i className="bi bi-arrow-right-circle me-2"></i>
                            Ver Sala Completa
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}

          {/* Estado cuando no hay resultados */}
          {!loading && !error && salasFiltradas.length === 0 && salas.length > 0 && (
            <Row>
              <Col>
                <div className="no-results">
                  <div className="no-results-icon">
                    <i className="bi bi-search"></i>
                  </div>
                  <h5>No se encontraron salas</h5>
                  <p className="text-muted">No hay salas que coincidan con tu búsqueda.</p>
                </div>
              </Col>
            </Row>
          )}

          {/* Estado cuando no hay datos */}
          {!loading && !error && salas.length === 0 && (
            <Row>
              <Col>
                <div className="no-results">
                  <div className="no-results-icon">
                    <i className="bi bi-building"></i>
                  </div>
                  <h5>No hay salas disponibles</h5>
                  <p className="text-muted">No se encontraron salas en la base de datos.</p>
                  <Button variant="primary" onClick={handleRecargar}>
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Recargar
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  )
}

export default SalasMuseo
