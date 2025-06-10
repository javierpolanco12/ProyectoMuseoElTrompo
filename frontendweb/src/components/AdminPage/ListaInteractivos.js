"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Menu from "../menus/MenuAdmin"
import logo from "../IMG/logo.jpg"
import Header from "../headers/header"
import "../CSS/ListaInteractivos.css"

const ListaSalas = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [salas, setSalas] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }
  useEffect(() => {
    // Datos simulados con salas e interactivos asociados
    const datosMuseo = [
      {
        id: 1,
        nombre: "Integra",
        descripcion: "Experiencias sensoriales e interactivas que estimulan todos los sentidos",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#FF6B6B",
        interactivos: [
          {
            id: 1,
            nombre: "Puente de Colores",
            descripcion:
              "Cruza un puente con sensores de luz que reaccionan a tus movimientos creando un espectáculo visual único",
            categoria: "Sensorial",
            estado: "Activo",
          },
          {
            id: 2,
            nombre: "Círculo Musical",
            descripcion:
              "Haz música con tus pasos en esta experiencia sonora interactiva que combina movimiento y sonido",
            categoria: "Musical",
            estado: "Activo",
          },
        ],
      },
      {
        id: 2,
        nombre: "Explica",
        descripcion: "Conceptos científicos explicados de forma interactiva y didáctica",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#4ECDC4",
        interactivos: [
          {
            id: 3,
            nombre: "Ciclo del Agua",
            descripcion: "Simulación interactiva del ciclo del agua con efectos visuales y controles táctiles",
            categoria: "Ciencias Naturales",
            estado: "Activo",
          },
        ],
      },

      {
        id: 3,
        nombre: "Experimenta",
        descripcion: "Laboratorio de experimentos científicos para aprender haciendo",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#45B7D1",
        interactivos: [
          {
            id: 4,
            nombre: "Generador de Van de Graaff",
            descripcion: "Electricidad estática y ciencia divertida para toda la familia con demostraciones en vivo",
            categoria: "Física",
            estado: "Mantenimiento",
          },
        ],
      },
      {
        id: 4,
        nombre: "Educa",
        descripcion: "Aprendizaje interactivo y educativo para todas las edades",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#96CEB4",
        interactivos: [
          {
            id: 5,
            nombre: "Panel Solar",
            descripcion: "Aprende cómo funciona la energía solar y las tecnologías renovables del futuro",
            categoria: "Energía",
            estado: "Activo",
          },
        ],
      },
      {
        id: 5,
        nombre: "Genera",
        descripcion: "Creatividad y generación de contenido digital",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#FFEAA7",
        interactivos: [],
      },
      {
        id: 6,
        nombre: "Valora",
        descripcion: "Evaluación y retroalimentación de experiencias",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#DDA0DD",
        interactivos: [],
      },
      {
        id: 7,
        nombre: "Sala de usos Múltiples",
        descripcion: "Espacio versátil para eventos especiales y actividades grupales",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#98D8C8",
        interactivos: [],
      },
      {
        id: 8,
        nombre: "Sala de proyección",
        descripcion: "Experiencias audiovisuales inmersivas y contenido multimedia",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#F7DC6F",
        interactivos: [],
      },
      {
        id: 9,
        nombre: "Sala De Baja California",
        descripcion: "Historia y cultura regional de Baja California",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#BB8FCE",
        interactivos: [],
      },
      {
        id: 10,
        nombre: "Zona Espacial",
        descripcion: "Exploración del cosmos y astronomía",
        imagen: "/placeholder.svg?height=200&width=300",
        color: "#85C1E9",
        interactivos: [
          {
            id: 6,
            nombre: "Simulador de Gravedad",
            descripcion:
              "Explora la física en el espacio y experimenta los efectos de la gravedad en diferentes planetas",
            categoria: "Astronomía",
            estado: "Activo",
          },
        ],
      },
    ]
    setSalas(datosMuseo)
  }, [])

  const filtrarSalas = () => {
    return salas.filter(
      (sala) =>
        sala.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        sala.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
    )
  }

  const handleVerSala = (salaId, nombreSala) => {
    // Navegar a la vista detallada de la sala usando React Router
    navigate(`/admin/sala/${salaId}`, {
      state: {
        nombreSala: nombreSala,
        salaData: salas.find((s) => s.id === salaId),
      },
    })
  }

  const getEstadoSala = (interactivos) => {
    if (interactivos.length === 0) {
      return { estado: "En desarrollo", color: "secondary", icon: "tools" }
    }

    const activos = interactivos.filter((i) => i.estado === "Activo").length
    const total = interactivos.length

    if (activos === total) {
      return { estado: "Operativa", color: "success", icon: "check-circle" }
    } else if (activos > 0) {
      return { estado: "Parcial", color: "warning", icon: "exclamation-triangle" }
    } else {
      return { estado: "Mantenimiento", color: "danger", icon: "tools" }
    }
  }

  const totalSalas = salas.length
  const salasOperativas = salas.filter((sala) => {
    const estado = getEstadoSala(sala.interactivos)
    return estado.estado === "Operativa"
  }).length
  const totalInteractivos = salas.reduce((total, sala) => total + sala.interactivos.length, 0)

  const salasFiltradas = filtrarSalas()

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
                    <p className="mb-0 opacity-90 text-white">Vista general de todas las salas y sus interactivos</p>
                  </div>
                  <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
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
                    placeholder="Buscar sala por nombre o descripción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </Col>
          </Row>

          {/* Grid de Salas */}
          <Row className="g-4">
            {salasFiltradas.map((sala) => {
              const estadoSala = getEstadoSala(sala.interactivos)
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
                          {sala.interactivos.length} items
                        </Badge>
                      </div>

                      <Card.Text className="interactive-description text-muted">{sala.descripcion}</Card.Text>

                      {/* Información adicional */}
                      <div className="mb-3">
                        {sala.interactivos.length > 0 ? (
                          <div>
                            <small className="text-muted">
                              <i className="bi bi-collection me-1"></i>
                              {sala.interactivos.filter((i) => i.estado === "Activo").length} activos de{" "}
                              {sala.interactivos.length} total
                            </small>
                          </div>
                        ) : (
                          <div>
                            <small className="text-muted">
                              <i className="bi bi-tools me-1"></i>
                              Sala en desarrollo
                            </small>
                          </div>
                        )}
                      </div>

                      <div className="action-buttons mt-auto">
                        <Button
                          variant="primary"
                          className="btn-custom btn-primary-custom w-100"
                          onClick={() => handleVerSala(sala.id, sala.nombre)}
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

          {/* Estado cuando no hay resultados */}
          {salasFiltradas.length === 0 && (
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
        </Container>
      </div>
    </div>
  )
}

export default ListaSalas
