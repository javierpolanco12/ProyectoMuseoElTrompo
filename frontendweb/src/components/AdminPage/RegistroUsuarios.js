"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "bootstrap/dist/css/bootstrap.min.css"
import "../CSS/RegistroInteractivo.css"

const RegistroUsuarios = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    rol: "",
    departamento: "",
    estado: "Activo",
    fechaIngreso: "",
    observaciones: "",
  })
  const [validated, setValidated] = useState(false)
  const [notification, setNotification] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Roles disponibles
  const roles = [
    {
      value: "Administrador",
      label: "Administrador",
      icon: "bi-person",
      color: "warning",
      description: "Personal encargado del mantenimiento de equipos e instalaciones",
    },

    {
      value: "usuario",
      label: "Usuario",
      icon: "bi-person",
      color: "success",
      description: "Usuario general del sistema con permisos básicos",
    },
  ]

  // Departamentos disponibles
  const departamentos = [
    "Sistemas",
    "Mantenimiento",
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
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    // Validaciones personalizadas
    let isValid = true

    if (!formData.nombre.trim()) {
      isValid = false
    }

    if (!formData.apellidos.trim()) {
      isValid = false
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      isValid = false
    }

    if (!formData.rol) {
      isValid = false
    }

    if (form.checkValidity() === false || !isValid) {
      e.stopPropagation()
      setValidated(true)
      showNotification("Por favor complete todos los campos requeridos correctamente", "error")
      return
    }

    setIsLoading(true)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Datos del usuario:", formData)
      showNotification("¡Usuario registrado con éxito!", "success")

      // Resetear el formulario después de 1 segundo
      setTimeout(() => {
        setFormData({
          nombre: "",
          apellidos: "",
          email: "",
          telefono: "",
          rol: "",
          departamento: "",
          estado: "Activo",
          fechaIngreso: "",
          observaciones: "",
        })
        setValidated(false)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      showNotification("Error al registrar usuario. Intente nuevamente.", "error")
      setIsLoading(false)
    }
  }

  const getEstadoBadge = (estado) => {
    const badgeConfig = {
      Activo: { bg: "success", icon: "check-circle" },
      Inactivo: { bg: "secondary", icon: "x-circle" },
      Suspendido: { bg: "danger", icon: "exclamation-circle" },
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
    const requiredFields = ["nombre", "apellidos", "email", "rol"]
    const completedFields = requiredFields.filter((field) => formData[field] && formData[field].trim() !== "")
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }

  const getRolInfo = () => {
    return roles.find((rol) => rol.value === formData.rol)
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
                      <i className="bi bi-person-plus me-3"></i>
                      Registro de Usuarios
                    </h1> 
                    <p className="mb-0 opacity-90 text-white">
                      Registra un nuevo usuario en el sistema de gestión del museo

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
            <Col lg={8}>
              <Card className="border-0 shadow-sm registration-card">
                <Card.Header className="bg-light border-0 py-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="bi bi-clipboard-data me-2 text-primary"></i>
                      Información del Usuario
                    </h5>
                    <div className="d-flex align-items-center gap-2">{getEstadoBadge(formData.estado)}</div>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">
                  <Form className={validated ? "was-validated" : ""} onSubmit={handleSubmit} noValidate>
                    {/* Información Personal */}
                    <div className="mb-4">
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-person-circle me-2"></i>
                        Información Personal
                      </h6>

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-person me-1"></i>
                              Nombre *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleChange}
                              required
                              className="form-control-custom"
                              placeholder="Ingrese el nombre"
                              disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor ingrese un nombre válido.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-person me-1"></i>
                              Apellidos *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="apellidos"
                              value={formData.apellidos}
                              onChange={handleChange}
                              required
                              className="form-control-custom"
                              placeholder="Ingrese los apellidos"
                              disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor ingrese los apellidos.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-envelope me-1"></i>
                              Email *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="form-control-custom"
                              placeholder="usuario@museo.com"
                              disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor ingrese un email válido.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-telephone me-1"></i>
                              Teléfono
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="telefono"
                              value={formData.telefono}
                              onChange={handleChange}
                              className="form-control-custom"
                              placeholder="+52 664 123 4567"
                              disabled={isLoading}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Información Laboral */}
                    <div className="mb-4">
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-briefcase me-2"></i>
                        Información Laboral
                      </h6>

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-shield-check me-1"></i>
                              Rol *
                            </Form.Label>
                            <Form.Select
                              name="rol"
                              value={formData.rol}
                              onChange={handleChange}
                              required
                              className="form-control-custom"
                              disabled={isLoading}
                            >
                              <option value="">Seleccionar rol...</option>
                              {roles.map((rol, index) => (
                                <option key={index} value={rol.value}>
                                  {rol.label}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Por favor seleccione un rol.</Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-building me-1"></i>
                              Departamento
                            </Form.Label>
                            <Form.Select
                              name="departamento"
                              value={formData.departamento}
                              onChange={handleChange}
                              className="form-control-custom"
                              disabled={isLoading}
                            >
                              <option value="">Seleccionar departamento...</option>
                              {departamentos.map((dept, index) => (
                                <option key={index} value={dept}>
                                  {dept}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-calendar-event me-1"></i>
                              Fecha de Ingreso
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="fechaIngreso"
                              value={formData.fechaIngreso}
                              onChange={handleChange}
                              className="form-control-custom"
                              disabled={isLoading}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-activity me-1"></i>
                              Estado
                            </Form.Label>
                            <Form.Select
                              name="estado"
                              value={formData.estado}
                              onChange={handleChange}
                              className="form-control-custom"
                              disabled={isLoading}
                            >
                              <option value="Activo">Activo</option>
                              <option value="Inactivo">Inactivo</option>
                              <option value="Suspendido">Suspendido</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Preview del Rol Seleccionado */}
                    {getRolInfo() && (
                      <div className="mb-4">
                        <Card className="border-0 bg-light">
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="role-icon">
                                <i
                                  className={`bi ${getRolInfo().icon} text-${getRolInfo().color}`}
                                  style={{ fontSize: "2rem" }}
                                ></i>
                              </div>
                              <div>
                                <h6 className="mb-1">
                                  <Badge bg={getRolInfo().color} className="me-2">
                                    {getRolInfo().label}
                                  </Badge>
                                  Rol Seleccionado
                                </h6>
                                <p className="text-muted mb-0 small">{getRolInfo().description}</p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    )}

                    {/* Observaciones */}
                    <div className="mb-4">
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-chat-text me-2"></i>
                        Información Adicional
                      </h6>

                      <Form.Group>
                        <Form.Label className="fw-bold">
                          <i className="bi bi-file-text me-1"></i>
                          Observaciones
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="observaciones"
                          value={formData.observaciones}
                          onChange={handleChange}
                          className="form-control-custom"
                          placeholder="Observaciones adicionales sobre el usuario..."
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </div>

                    {/* Botones de Acción */}
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <div className="text-muted small">Los campos marcados con * son obligatorios</div>

                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" onClick={() => window.history.back()} disabled={isLoading}>
                          <i className="bi bi-arrow-left me-2"></i>
                          Cancelar
                        </Button>

                        <Button
                          variant="outline-warning"
                          type="button"
                          onClick={() => {
                            setFormData({
                              nombre: "",
                              apellidos: "",
                              email: "",
                              telefono: "",
                              rol: "",
                              departamento: "",
                              estado: "Activo",
                              fechaIngreso: "",
                              observaciones: "",
                            })
                            setValidated(false)
                          }}
                          disabled={isLoading}
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Limpiar
                        </Button>

                        <Button type="submit" variant="success" className="submit-btn" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Registrando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Registrar Usuario
                            </>
                          )}
                        </Button>
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

export default RegistroUsuarios
