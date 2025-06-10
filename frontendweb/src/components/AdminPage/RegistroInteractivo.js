"use client"

import { useState } from "react"
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
    tipo: "",
    ubicacion: "",
    sala: "",
    numeroSerie: "",
    modelo: "",
    fabricante: "",
    fechaAdquisicion: "",
    estado: "Activo",
    descripcion: "",
    responsable: "",
    mantenimientoProgramado: false,
    frecuenciaMantenimiento: "6",
    observaciones: "",
    imagen: null,
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [validated, setValidated] = useState(false)
  const [notification, setNotification] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Lista de salas disponibles
  const salas = [
    "Integra",
    "Explica",
    "Experimenta",
    "Educa",
    "Genera",
    "Valora",
    "Sala de usos Múltiples",
    "Sala de proyección",
    "Sala De Baja California",
    "Zona Espacial",
  ]

  // Tipos de interactivos con iconos
  const tiposInteractivos = [
    { value: "Pantalla Táctil", icon: "bi-tablet", color: "primary" },
    { value: "Proyector Interactivo", icon: "bi-projector", color: "info" },
    { value: "Kiosco Informativo", icon: "bi-display", color: "success" },
    { value: "Simulador", icon: "bi-controller", color: "warning" },
    { value: "Realidad Virtual", icon: "bi-headset-vr", color: "danger" },
    { value: "Otro", icon: "bi-gear", color: "secondary" },
  ]

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      })
    } else if (type === "file") {
      if (files && files[0]) {
        setFormData({
          ...formData,
          [name]: files[0],
        })

        // Crear preview de la imagen
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewImage(e.target.result)
        }
        reader.readAsDataURL(files[0])
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      showNotification("Por favor complete todos los campos requeridos", "error")
      return
    }

    console.log("Datos del formulario:", formData)
    showNotification("¡Interactivo registrado con éxito!", "success")

    // Resetear el formulario después de 1 segundo
    setTimeout(() => {
      setFormData({
        nombre: "",
        tipo: "",
        ubicacion: "",
        sala: "",
        numeroSerie: "",
        modelo: "",
        fabricante: "",
        fechaAdquisicion: "",
        estado: "Activo",
        descripcion: "",
        responsable: "",
        mantenimientoProgramado: false,
        frecuenciaMantenimiento: "6",
        observaciones: "",
        imagen: null,
      })
      setPreviewImage(null)
      setValidated(false)
      setCurrentStep(1)
    }, 1000)
  }

  const getEstadoBadge = (estado) => {
    const badgeConfig = {
      Activo: { bg: "success", icon: "check-circle" },
      "En Mantenimiento": { bg: "warning", icon: "tools" },
      "Fuera de Servicio": { bg: "danger", icon: "x-circle" },
      Baja: { bg: "secondary", icon: "archive" },
    }

    const config = badgeConfig[estado] || { bg: "secondary", icon: "circle" }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {estado}
      </Badge>
    )
  }

  const getCompletionPercentage = () => {
    const requiredFields = ["nombre", "tipo", "sala", "ubicacion", "numeroSerie", "fechaAdquisicion"]
    const completedFields = requiredFields.filter((field) => formData[field] && formData[field].trim() !== "")
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
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
                      <span className="text-muted">Paso {currentStep} de 4</span>
                      {getEstadoBadge(formData.estado)}
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
                                <i className="bi bi-grid me-1"></i>
                                Tipo de Interactivo *
                              </Form.Label>
                              <Form.Select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                              >
                                <option value="">Seleccionar tipo...</option>
                                {tiposInteractivos.map((tipo, index) => (
                                  <option key={index} value={tipo.value}>
                                    {tipo.value}
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
                                <i className="bi bi-building me-1"></i>
                                Sala *
                              </Form.Label>
                              <Form.Select
                                name="sala"
                                value={formData.sala}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                              >
                                <option value="">Seleccionar sala...</option>
                                {salas.map((sala, index) => (
                                  <option key={index} value={sala}>
                                    {sala}
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
                                <i className="bi bi-geo-alt me-1"></i>
                                Ubicación Específica *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="ubicacion"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                                placeholder="Ej: Esquina noreste, Junto a la entrada"
                              />
                              <Form.Control.Feedback type="invalid">
                                Por favor ingrese la ubicación específica.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-person-gear me-1"></i>
                                Responsable
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="responsable"
                                value={formData.responsable}
                                onChange={handleChange}
                                className="form-control-custom"
                                placeholder="Nombre del responsable del interactivo"
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
                            Información Técnica
                          </h6>
                        </div>

                        <Row className="g-3">
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-hash me-1"></i>
                                Número de Serie *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="numeroSerie"
                                value={formData.numeroSerie}
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

                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-box me-1"></i>
                                Modelo
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleChange}
                                className="form-control-custom"
                                placeholder="Modelo del equipo"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-building-gear me-1"></i>
                                Fabricante
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="fabricante"
                                value={formData.fabricante}
                                onChange={handleChange}
                                className="form-control-custom"
                                placeholder="Fabricante del equipo"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-calendar-event me-1"></i>
                                Fecha de Adquisición *
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="fechaAdquisicion"
                                value={formData.fechaAdquisicion}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                              />
                              <Form.Control.Feedback type="invalid">
                                Por favor seleccione una fecha.
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
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                                className="form-control-custom"
                              >
                                <option value="Activo">Activo</option>
                                <option value="En Mantenimiento">En Mantenimiento</option>
                                <option value="Fuera de Servicio">Fuera de Servicio</option>
                                <option value="Baja">Baja</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {/* Paso 3: Mantenimiento */}
                    {currentStep === 3 && (
                      <div className="form-step">
                        <div className="step-header mb-4">
                          <h6 className="text-primary fw-bold mb-3">
                            <i className="bi bi-tools me-2"></i>
                            Configuración de Mantenimiento
                          </h6>
                        </div>

                        <Row className="g-3">
                          <Col md={12}>
                            <Card className="border-0 bg-light">
                              <Card.Body>
                                <Form.Check
                                  type="switch"
                                  id="mantenimientoProgramado"
                                  name="mantenimientoProgramado"
                                  checked={formData.mantenimientoProgramado}
                                  onChange={handleChange}
                                  label="Requiere mantenimiento programado"
                                  className="maintenance-switch"
                                />
                              </Card.Body>
                            </Card>
                          </Col>

                          {formData.mantenimientoProgramado && (
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="fw-bold">
                                  <i className="bi bi-calendar-range me-1"></i>
                                  Frecuencia de Mantenimiento
                                </Form.Label>
                                <Form.Select
                                  name="frecuenciaMantenimiento"
                                  value={formData.frecuenciaMantenimiento}
                                  onChange={handleChange}
                                  className="form-control-custom"
                                >
                                  <option value="1">1 mes</option>
                                  <option value="3">3 meses</option>
                                  <option value="6">6 meses</option>
                                  <option value="12">12 meses</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          )}

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-file-text me-1"></i>
                                Descripción del Interactivo
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={4}
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="form-control-custom"
                                placeholder="Describe las características y funcionalidades del interactivo..."
                              />
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-chat-text me-1"></i>
                                Observaciones
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                className="form-control-custom"
                                placeholder="Observaciones adicionales, notas especiales, etc..."
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {/* Paso 4: Imagen */}
                    {currentStep === 4 && (
                      <div className="form-step">
                        <div className="step-header mb-4">
                          <h6 className="text-primary fw-bold mb-3">
                            <i className="bi bi-image me-2"></i>
                            Imagen del Interactivo
                          </h6>
                        </div>

                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-cloud-upload me-1"></i>
                                Subir Imagen
                              </Form.Label>
                              <Form.Control
                                type="file"
                                name="imagen"
                                accept="image/*"
                                onChange={handleChange}
                                className="form-control-custom"
                              />
                              <Form.Text className="text-muted">
                                Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                              </Form.Text>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <div className="image-preview-container">
                              {previewImage ? (
                                <div className="text-center">
                                  <img
                                    src={previewImage || "/placeholder.svg"}
                                    alt="Vista previa"
                                    className="img-thumbnail preview-image"
                                  />
                                  <div className="mt-2">
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => {
                                        setPreviewImage(null)
                                        setFormData({ ...formData, imagen: null })
                                      }}
                                    >
                                      <i className="bi bi-trash me-1"></i>
                                      Eliminar imagen
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="upload-placeholder">
                                  <i className="bi bi-image text-muted" style={{ fontSize: "3rem" }}></i>
                                  <p className="text-muted mt-2">Vista previa de la imagen</p>
                                </div>
                              )}
                            </div>
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
                          {[1, 2, 3, 4].map((step) => (
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
                          {currentStep < 4 ? (
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
                              <Button type="submit" variant="success" className="submit-btn">
                                <i className="bi bi-check-circle me-2"></i>
                                Registrar Interactivo
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
