"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "bootstrap/dist/css/bootstrap.min.css"
import "../CSS/RegistroInteractivo.css"

const RegistroInteractivo = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    numero_serie: "",
    modelo_computadora: "",
    marca_computadora: "",
    fecha_instalado: "",
    sala: null,
    tipo: null,
    status: null,
  })
  const [validated, setValidated] = useState(false)
  const [notification, setNotification] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Estados para datos de la API
  const [salas, setSalas] = useState([])
  const [tipos, setTipos] = useState([])
  const [estados, setEstados] = useState([])

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Cargar datos iniciales (salas, tipos, estados) - puedes ajustar estas URLs según tu API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Datos básicos para los selects - ajusta según tu API
        setSalas([
          { id: 1, nombre: "Integra" },
          { id: 2, nombre: "Explica" },
          { id: 3, nombre: "Experimenta" },
          { id: 4, nombre: "Educa" },
          { id: 5, nombre: "Genera" },
          { id: 6, nombre: "Valora" },
          { id: 7, nombre: "Sala de usos Múltiples" },
          { id: 8, nombre: "Sala de proyección" },
        ])

        setTipos([
          { id: 1, nombre: "Mecánico" },
          { id: 2, nombre: "Digital" },
        ])

        setEstados([
          { id: 1, nombre: "Activo" },
          { id: 2, nombre: "En Mantenimiento" },
          { id: 3, nombre: "Fuera de Servicio" },
        ])
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error)
        showNotification("Error al cargar datos iniciales", "error")
      }
    }

    fetchInitialData()
  }, [])

  const handleChange = (e) => {
    const { name, value, type } = e.target

    if (type === "select-one" && (name === "sala" || name === "tipo" || name === "status")) {
      // Convertir a número para los IDs
      setFormData({
        ...formData,
        [name]: value ? Number.parseInt(value) : null,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      showNotification("Por favor complete todos los campos requeridos", "error")
      return
    }

    setLoading(true)

    try {
      // Preparar datos para enviar a la API
      const dataToSend = {
        nombre: formData.nombre,
        numero_serie: formData.numero_serie,
        modelo_computadora: formData.modelo_computadora,
        marca_computadora: formData.marca_computadora,
        fecha_instalado: formData.fecha_instalado || null,
        sala: formData.sala,
        tipo: formData.tipo,
        status: formData.status,
      }

      console.log("Enviando datos:", dataToSend)

      const response = await fetch("http://127.0.0.1:8000/api/interactivos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error ${response.status}: ${JSON.stringify(errorData)}`)
      }

      const result = await response.json()
      console.log("Interactivo creado:", result)

      showNotification("¡Interactivo registrado con éxito!", "success")

      // Resetear el formulario después de 1 segundo
      setTimeout(() => {
        setFormData({
          nombre: "",
          numero_serie: "",
          modelo_computadora: "",
          marca_computadora: "",
          fecha_instalado: "",
          sala: null,
          tipo: null,
          status: null,
        })
        setValidated(false)
        setCurrentStep(1)
      }, 1000)
    } catch (error) {
      console.error("Error al registrar interactivo:", error)
      showNotification(`Error al registrar interactivo: ${error.message}`, "error")
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estadoId) => {
    const estado = estados.find((e) => e.id === estadoId)
    if (!estado) return null

    const badgeConfig = {
      Activo: { bg: "success", icon: "check-circle" },
      "En Mantenimiento": { bg: "warning", icon: "tools" },
      "Fuera de Servicio": { bg: "danger", icon: "x-circle" },
      Baja: { bg: "secondary", icon: "archive" },
    }

    const config = badgeConfig[estado.nombre] || { bg: "secondary", icon: "circle" }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {estado.nombre}
      </Badge>
    )
  }

  const getCompletionPercentage = () => {
    const requiredFields = ["nombre", "numero_serie", "sala", "tipo", "status"]
    const completedFields = requiredFields.filter((field) => {
      const value = formData[field]
      return value !== null && value !== undefined && value !== ""
    })
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="container">
      {/* Notificación */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="notification-close-btn">
              ×
            </button>
          </div>
        </div>
      )}

      <Menu onToggle={handleMenuToggle} />
      <Header isMenuOpen={isMenuOpen} />

      <div
        className="main-content"
        style={{
          marginLeft: isMenuOpen ? "200px" : "0",
        }}
      >
        <Container fluid className="py-4">
          {/* Header del Dashboard */}
          <Row className="mb-4">
            <Col>
              <div className="header-gradient p-4 rounded-3 text-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h1 className="h2 mb-2 fw-bold text-white">
                      <i className="bi bi-plus-circle me-3"></i>
                      Registro de Interactivo
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      Registra un nuevo interactivo en el sistema de gestión del museo
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                    <div className="completion-indicator">
                      <div className="text-white text-center mb-2">
                        <small>Progreso del formulario</small>
                      </div>
                      <ProgressBar
                        now={getCompletionPercentage()}
                        variant="light"
                        className="progress-custom"
                        style={{ height: "8px", width: "150px" }}
                      />
                      <div className="text-white text-center mt-1">
                        <small>{getCompletionPercentage()}% completado</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Formulario Principal */}
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="border-0 shadow-sm registration-card">
                <Card.Header className="bg-light border-0 py-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="bi bi-clipboard-data me-2 text-primary"></i>
                      Formulario de Registro
                    </h5>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted">Paso {currentStep} de 3</span>
                      {formData.status && getEstadoBadge(formData.status)}
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">
                  <Form className={validated ? "was-validated" : ""} onSubmit={handleSubmit} noValidate>
                    {/* Paso 1: Información Básica */}
                    {currentStep === 1 && (
                      <div className="form-step">
                        <div className="step-header mb-4">
                          <h6 className="text-primary fw-bold mb-3">
                            <i className="bi bi-info-circle me-2"></i>
                            Información Básica
                          </h6>
                        </div>

                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-tag me-1"></i>
                                Nombre del Interactivo *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                                placeholder="Ingrese el nombre del interactivo"
                              />
                              <Form.Control.Feedback type="invalid">Por favor ingrese un nombre.</Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-hash me-1"></i>
                                Número de Serie *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="numero_serie"
                                value={formData.numero_serie}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                                placeholder="Número de serie del equipo"
                              />
                              <Form.Control.Feedback type="invalid">
                                Por favor ingrese el número de serie.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-building me-1"></i>
                                Sala *
                              </Form.Label>
                              <Form.Select
                                name="sala"
                                value={formData.sala || ""}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                              >
                                <option value="">Seleccionar sala...</option>
                                {salas.map((sala) => (
                                  <option key={sala.id} value={sala.id}>
                                    {sala.nombre}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Por favor seleccione una sala.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-grid me-1"></i>
                                Tipo de Interactivo *
                              </Form.Label>
                              <Form.Select
                                name="tipo"
                                value={formData.tipo || ""}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                              >
                                <option value="">Seleccionar tipo...</option>
                                {tipos.map((tipo) => (
                                  <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Por favor seleccione un tipo.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-activity me-1"></i>
                                Estado *
                              </Form.Label>
                              <Form.Select
                                name="status"
                                value={formData.status || ""}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                              >
                                <option value="">Seleccionar estado...</option>
                                {estados.map((estado) => (
                                  <option key={estado.id} value={estado.id}>
                                    {estado.nombre}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Por favor seleccione un estado.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-calendar-event me-1"></i>
                                Fecha de Instalación
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="fecha_instalado"
                                value={formData.fecha_instalado}
                                onChange={handleChange}
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {/* Paso 2: Información Técnica */}
                    {currentStep === 2 && (
                      <div className="form-step">
                        <div className="step-header mb-4">
                          <h6 className="text-primary fw-bold mb-3">
                            <i className="bi bi-cpu me-2"></i>
                            Información Técnica de la Computadora
                          </h6>
                        </div>

                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-box me-1"></i>
                                Modelo de Computadora
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="modelo_computadora"
                                value={formData.modelo_computadora}
                                onChange={handleChange}
                                className="form-control-custom"
                                placeholder="Ej: Dell OptiPlex 7090, HP EliteDesk 800"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-building-gear me-1"></i>
                                Marca de Computadora
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="marca_computadora"
                                value={formData.marca_computadora}
                                onChange={handleChange}
                                className="form-control-custom"
                                placeholder="Ej: Dell, HP, Lenovo, ASUS"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Card className="border-0 bg-light">
                              <Card.Body>
                                <h6 className="text-info fw-bold mb-3">
                                  <i className="bi bi-info-circle me-2"></i>
                                  Información Adicional
                                </h6>
                                <p className="text-muted mb-0">
                                  La información técnica de la computadora es opcional pero recomendada para un mejor
                                  seguimiento del equipo. Puede completar estos campos más tarde si no tiene la
                                  información disponible en este momento.
                                </p>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {/* Paso 3: Resumen */}
                    {currentStep === 3 && (
                      <div className="form-step">
                        <div className="step-header mb-4">
                          <h6 className="text-primary fw-bold mb-3">
                            <i className="bi bi-check-circle me-2"></i>
                            Resumen del Registro
                          </h6>
                        </div>

                        <Row className="g-3">
                          <Col md={12}>
                            <Card className="border-0 bg-light">
                              <Card.Body>
                                <h6 className="text-dark fw-bold mb-3">Información a Registrar:</h6>
                                <Row>
                                  <Col md={6}>
                                    <div className="mb-2">
                                      <strong>Nombre:</strong> {formData.nombre || "No especificado"}
                                    </div>
                                    <div className="mb-2">
                                      <strong>Número de Serie:</strong> {formData.numero_serie || "No especificado"}
                                    </div>
                                    <div className="mb-2">
                                      <strong>Sala:</strong>{" "}
                                      {salas.find((s) => s.id === formData.sala)?.nombre || "No especificada"}
                                    </div>
                                    <div className="mb-2">
                                      <strong>Tipo:</strong>{" "}
                                      {tipos.find((t) => t.id === formData.tipo)?.nombre || "No especificado"}
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <div className="mb-2">
                                      <strong>Estado:</strong>{" "}
                                      {estados.find((e) => e.id === formData.status)?.nombre || "No especificado"}
                                    </div>
                                    <div className="mb-2">
                                      <strong>Fecha de Instalación:</strong>{" "}
                                      {formData.fecha_instalado || "No especificada"}
                                    </div>
                                    <div className="mb-2">
                                      <strong>Modelo PC:</strong> {formData.modelo_computadora || "No especificado"}
                                    </div>
                                    <div className="mb-2">
                                      <strong>Marca PC:</strong> {formData.marca_computadora || "No especificada"}
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {/* Navegación entre pasos */}
                    <div className="step-navigation mt-5 pt-4 border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {currentStep > 1 && (
                            <Button variant="outline-secondary" onClick={prevStep} className="step-btn">
                              <i className="bi bi-arrow-left me-2"></i>
                              Anterior
                            </Button>
                          )}
                        </div>

                        <div className="step-indicators d-flex gap-2">
                          {[1, 2, 3].map((step) => (
                            <div
                              key={step}
                              className={`step-indicator ${currentStep === step ? "active" : ""} ${
                                currentStep > step ? "completed" : ""
                              }`}
                            >
                              {currentStep > step ? <i className="bi bi-check"></i> : step}
                            </div>
                          ))}
                        </div>

                        <div>
                          {currentStep < 3 ? (
                            <Button variant="primary" onClick={nextStep} className="step-btn">
                              Siguiente
                              <i className="bi bi-arrow-right ms-2"></i>
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button variant="outline-secondary" onClick={() => window.history.back()}>
                                <i className="bi bi-x-circle me-2"></i>
                                Cancelar
                              </Button>
                              <Button type="submit" variant="success" className="submit-btn" disabled={loading}>
                                {loading ? (
                                  <>
                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                      <span className="visually-hidden">Cargando...</span>
                                    </div>
                                    Registrando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-check-circle me-2"></i>
                                    Registrar Interactivo
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default RegistroInteractivo
