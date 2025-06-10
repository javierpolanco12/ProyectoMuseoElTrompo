"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Badge, Modal } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "bootstrap/dist/css/bootstrap.min.css"
import "../CSS/PerfilA.css"

const PerfilA = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [userData, setUserData] = useState({})
  const [editData, setEditData] = useState({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

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
    // Datos del usuario administrador
    const datosUsuario = {
      id: "ADM001",
      nombre: "Juan Carlos",
      apellidos: "Pérez García",
      email: "admin@museo.com",
      telefono: "+52 664 123 4567",
      puesto: "Administrador de Mantenimiento",
      departamento: "Mantenimiento Técnico",
      fechaIngreso: "2022-03-15",
      ultimoAcceso: "2024-01-12 09:30:00",
      estado: "Activo",
    }

    setUserData(datosUsuario)
    setEditData(datosUsuario)

  }, [])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()

    // Validaciones básicas
    if (!editData.nombre || !editData.email) {
      showNotification("Por favor complete los campos obligatorios", "error")
      return
    }

    // Simular guardado
    setUserData(editData)
    setShowEditModal(false)
    showNotification("Perfil actualizado exitosamente", "success")
  }

  const handleChangePassword = (e) => {
    e.preventDefault()

    // Validaciones
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showNotification("Por favor complete todos los campos", "error")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error")
      return
    }

    if (passwordData.newPassword.length < 6) {
      showNotification("La contraseña debe tener al menos 6 caracteres", "error")
      return
    }

    // Simular cambio de contraseña
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setShowPasswordModal(false)
    showNotification("Contraseña actualizada exitosamente", "success")
  }

  const getEstadoBadge = (estado) => {
    return (
      <Badge bg="success" className="px-3 py-2">
        <i className="bi bi-check-circle me-1"></i>
        {estado}
      </Badge>
    )
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
                      <i className="bi bi-person-circle me-3"></i>
                      Mi Perfil
                    </h1>
                    <p className="mb-0 opacity-90 text-white">Información personal y configuración de cuenta</p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Información Personal */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    Información Personal
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row>
                    <Col md={4} className="text-center mb-4">
                      <div className="user-avatar">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <h4 className="mt-3 mb-2 fw-bold">
                        {userData.nombre} {userData.apellidos}
                      </h4>
                      {getEstadoBadge(userData.estado)}
                      <div className="mt-3">
                        <small className="text-muted d-block">Miembro desde</small>
                        <strong>{userData.fechaIngreso}</strong>
                      </div>
                    </Col>
                    <Col md={8}>
                      <div className="user-details">
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-hash me-1"></i>
                              ID Usuario:
                            </strong>
                          </Col>
                          <Col sm={8}>
                            <span className="badge bg-light text-dark border">{userData.id}</span>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-envelope me-1"></i>
                              Email:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.email}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-telephone me-1"></i>
                              Teléfono:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.telefono}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-briefcase me-1"></i>
                              Puesto:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.puesto}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-building me-1"></i>
                              Departamento:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.departamento}</Col>
                        </Row>
                        <Row>
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-clock-history me-1"></i>
                              Último Acceso:
                            </strong>
                          </Col>
                          <Col sm={8}>
                            <span className="badge bg-info text-white">{userData.ultimoAcceso}</span>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="bg-light border-0 py-3">
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="primary" onClick={() => setShowEditModal(true)} className="action-btn">
                      <i className="bi bi-pencil me-2"></i>
                      Editar Perfil
                    </Button>
                    <Button variant="warning" onClick={() => setShowPasswordModal(true)} className="action-btn">
                      <i className="bi bi-key me-2"></i>
                      Cambiar Contraseña
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal Editar Perfil */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" className="profile-modal">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fw-bold">
            <i className="bi bi-pencil me-2"></i>
            Editar Perfil
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveProfile}>
          <Modal.Body className="p-4">
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
                    value={editData.nombre || ""}
                    onChange={handleEditChange}
                    required
                    className="form-control-custom"
                  />
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
                    value={editData.apellidos || ""}
                    onChange={handleEditChange}
                    required
                    className="form-control-custom"
                  />
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
                    value={editData.email || ""}
                    onChange={handleEditChange}
                    required
                    className="form-control-custom"
                  />
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
                    value={editData.telefono || ""}
                    onChange={handleEditChange}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-briefcase me-1"></i>
                    Puesto
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="puesto"
                    value={editData.puesto || ""}
                    onChange={handleEditChange}
                    readOnly
                    className="bg-light form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-building me-1"></i>
                    Departamento
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="departamento"
                    value={editData.departamento || ""}
                    onChange={handleEditChange}
                    readOnly
                    className="bg-light form-control-custom"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="btn-primary-custom">
              <i className="bi bi-check-circle me-2"></i>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Cambiar Contraseña */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} className="profile-modal">
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title className="fw-bold">
            <i className="bi bi-key me-2"></i>
            Cambiar Contraseña
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangePassword}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <i className="bi bi-lock me-1"></i>
                Contraseña Actual *
              </Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="form-control-custom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <i className="bi bi-lock-fill me-1"></i>
                Nueva Contraseña *
              </Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                className="form-control-custom"
              />
              <Form.Text className="text-muted">La contraseña debe tener al menos 6 caracteres.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <i className="bi bi-lock-fill me-1"></i>
                Confirmar Nueva Contraseña *
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="form-control-custom"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button variant="warning" type="submit" className="btn-warning-custom">
              <i className="bi bi-key me-2"></i>
              Cambiar Contraseña
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default PerfilA
