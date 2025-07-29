"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Image } from "react-bootstrap"
import { fetchUserProfile } from "./fetchUserProfile"

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
  const [userData, setUserData] = useState(null) // Almacenará datos combinados de usuario y perfil
  const [editData, setEditData] = useState({}) // Datos para el formulario de edición
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false) // Para el estado de guardado/actualización
  const [selectedFile, setSelectedFile] = useState(null) // Para la foto de perfil seleccionada
  const [previewUrl, setPreviewUrl] = useState(null) // Para la previsualización de la imagen
  const [isPhotoSelected, setIsPhotoSelected] = useState(false) // Para habilitar/deshabilitar el botón de guardar foto

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Función para obtener el puesto/rol legible
  const getPuestoFromRol = (rol) => {
    switch (rol?.toLowerCase()) {
      case "administrador":
      case "admin":
        return "Administrador del Sistema"
      case "usuario":
        return "Usuario General"
      case "tecnico":
        return "Técnico de Mantenimiento"
      default:
        return "Rol Desconocido"
    }
  }

  // Función para obtener el género legible
  const getGeneroLabel = (generoValue) => {
    switch (generoValue?.toLowerCase()) {
      case "masculino":
        return "Masculino"
      case "femenino":
        return "Femenino"

    }
  }

  // Cargar datos del usuario y su perfil al iniciar
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true)
      try {
        const data = await fetchUserProfile() // Llama a la función importada
        setUserData(data)
        setEditData(data) // Inicializar editData con los datos actuales
        setPreviewUrl(data.foto_url || null) // Establecer la URL de previsualización inicial
        showNotification("Datos de perfil cargados correctamente", "success")
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
        showNotification(`Error al cargar el perfil: ${error.message}`, "error")
        setUserData(null) // Limpiar datos si hay error
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const filePreviewUrl = URL.createObjectURL(file)
      setPreviewUrl(filePreviewUrl)

 

      setEditData((prev) => ({
        ...prev,
        foto_url: filePreviewUrl,
      }))
      setIsPhotoSelected(true) 
    } else {
      setSelectedFile(null)
      setPreviewUrl(userData?.foto_url || null) 
      setEditData((prev) => ({
        ...prev,
        foto_url: userData?.foto_url || null,
      }))
      setIsPhotoSelected(false) 
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    // Validaciones básicas para los campos de usuario
    
    if (!editData.nombre_usuario || !editData.correo || !editData.rol) {
      showNotification("Los campos de usuario (nombre, correo, rol) son obligatorios", "error")
      setIsSaving(false)
      return
    }

    const userSession =
      JSON.parse(localStorage.getItem("userSession")) || JSON.parse(sessionStorage.getItem("userSession"))
    const userId = userSession?.id

    if (!userId) {
      showNotification("Error: No hay usuario logueado para actualizar.", "error")
      setIsSaving(false)
      return
    }

    try {
      let finalFotoUrl = editData.foto_url // Usar la URL actual en editData por defecto

      if (selectedFile) {

        finalFotoUrl = `/placeholder.svg?text=Foto+de+Perfil+${userId}&width=120&height=120` // URL de placeholder
        showNotification("Simulando subida de imagen...", "info")
      }

      // 1. Actualizar datos del usuario
      const userUpdatePayload = {
        nombre_usuario: editData.nombre_usuario,
        correo: editData.correo,
        rol: editData.rol,
      }

      // Incluir contrasena_hash si existe en editData (obtenido del fetch inicial)
      // Esto es crucial si el PUT del backend lo requiere incluso para cambios no relacionados con la contraseña.
      if (editData.contrasena_hash) {
        userUpdatePayload.contrasena_hash = editData.contrasena_hash
      }

      const userUpdateResponse = await fetch(`http://127.0.0.1:8000/api/usuarios/${userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userUpdatePayload),
      })

      if (!userUpdateResponse.ok) {
        const errorData = await userUpdateResponse.json()
        throw new Error(`Error al actualizar usuario: ${JSON.stringify(errorData)}`)
      }

      // 2. Actualizar o crear datos del perfil
      const profilePayload = {
        nombre_completo: editData.nombre_completo,
        telefono: editData.telefono,
        foto_url: finalFotoUrl, // Usar la URL final (original o de la nueva imagen)
        direccion: editData.direccion,
        fecha_nacimiento: editData.fecha_nacimiento || null,
        genero: editData.genero,
        usuario: userId, // Asegurar que el perfil esté vinculado al usuario
      }

      if (editData.perfilId) {
        // Si ya existe un perfil, actualizarlo
        const profileUpdateResponse = await fetch(`http://127.0.0.1:8000/api/perfiles/${editData.perfilId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profilePayload),
        })
        if (!profileUpdateResponse.ok) {
          console.error("Error al actualizar perfil:", await profileUpdateResponse.json())
          // No lanzamos error aquí para no detener el proceso si el perfil falla pero el usuario se actualiza
        }
      } else {
        // Si no existe un perfil, crearlo
        const profileCreateResponse = await fetch("http://127.0.0.1:8000/api/perfiles/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profilePayload),
        })
        if (!profileCreateResponse.ok) {
          console.error("Error al crear perfil:", await profileCreateResponse.json())
        } else {
          const newProfile = await profileCreateResponse.json()
          setEditData((prev) => ({ ...prev, perfilId: newProfile.id })) // Actualizar perfilId en editData
        }
      }

      // Actualizar el estado local del componente con los nuevos datos, incluyendo la foto
      const newUserData = {
        ...userData, // Mantener los datos existentes del usuario
        ...editData, // Aplicar los cambios del formulario de edición
        foto_url: finalFotoUrl, // Asegurar que la nueva URL de la foto se establezca
      }

      setUserData(newUserData)
      setEditData(newUserData) // Mantener editData sincronizado para futuras ediciones
      setPreviewUrl(finalFotoUrl) // Actualizar la previsualización con la nueva URL

      setSelectedFile(null) // Limpiar archivo seleccionado
      setIsPhotoSelected(false) // Deshabilitar el botón de guardar foto
      setShowEditModal(false) // Cerrar modal si se abrió desde ahí
      showNotification("Perfil actualizado exitosamente", "success")


    } catch (error) {
      console.error("Error al guardar perfil:", error)
      showNotification(`Error al guardar perfil: ${error.message}`, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showNotification("Por favor complete todos los campos", "error")
      setIsSaving(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Las nuevas contraseñas no coinciden", "error")
      setIsSaving(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      showNotification("La nueva contraseña debe tener al menos 6 caracteres", "error")
      setIsSaving(false)
      return
    }

    const userSession =
      JSON.parse(localStorage.getItem("userSession")) || JSON.parse(sessionStorage.getItem("userSession"))
    const userId = userSession?.id

    if (!userId) {
      showNotification("Error: No hay usuario logueado para cambiar la contraseña.", "error")
      setIsSaving(false)
      return
    }

    try {
      // En un sistema real, primero verificarías la contraseña actual en el backend
      // y luego enviarías la nueva contraseña hasheada.
      // Aquí, por simplicidad, solo enviamos la nueva contraseña.
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contrasena_hash: passwordData.newPassword, // El backend debe hashear esto
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error al cambiar contraseña: ${JSON.stringify(errorData)}`)
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowPasswordModal(false)
      showNotification("Contraseña actualizada exitosamente", "success")
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      showNotification(`Error al cambiar contraseña: ${error.message}`, "error")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <Header />
        <Menu />
        <div className="main-content" style={{ marginLeft: isMenuOpen ? "200px" : "0" }}>
          <Container fluid className="py-4">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando datos del perfil...</p>
            </div>
          </Container>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container">
        <Header />
        <Menu />
        <div className="main-content" style={{ marginLeft: isMenuOpen ? "200px" : "0" }}>
          <Container fluid className="py-4">
            <div className="text-center alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              No se pudieron cargar los datos del perfil. Asegúrate de estar logueado.
            </div>
          </Container>
        </div>
      </div>
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
                        {userData.foto_url ? (
                          <Image
                            src={userData.foto_url || "/placeholder.svg"}
                            alt="Foto de Perfil"
                            className="rounded-circle img-fluid"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                          />
                        ) : (
                          <i className="bi bi-person-fill"></i>
                        )}
                      </div>
                      <h4 className="mt-3 mb-2 fw-bold">
                        {userData.nombre_completo || userData.nombre_usuario || "Usuario Desconocido"}
                      </h4>
                      <Badge bg="primary" className="px-3 py-2">
                        <i className="bi bi-person-badge me-1"></i>
                        {getPuestoFromRol(userData.rol)}
                      </Badge>
                      <div className="mt-3">
                        <small className="text-muted d-block">Rol del Sistema</small>
                        <strong>{userData.rol}</strong>
                      </div>

                      {/* Nuevo: Opción para subir foto de perfil directamente */}
                      <div className="mt-4">
                        <Form.Group controlId="formFile" className="mb-2">
                          <Form.Label className="fw-bold small">Cambiar Foto de Perfil</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control-sm"
                            disabled={isSaving}
                          />
                        </Form.Group>
                        {previewUrl &&
                          isPhotoSelected && ( // Mostrar previsualización solo si hay un archivo nuevo seleccionado
                            <div className="text-center mb-2">
                              <Image
                                src={previewUrl || "/placeholder.svg"}
                                alt="Previsualización de la foto"
                                className="rounded-circle border"
                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                              />
                              <Form.Text className="d-block text-muted">Previsualización</Form.Text>
                            </div>
                          )}
                        <Button
                          variant="success"
                          size="sm"
                          onClick={handleSaveProfile}
                          disabled={isSaving || !isPhotoSelected} // Deshabilitar si está guardando o no hay foto seleccionada
                          className="w-100"
                        >
                          {isSaving && isPhotoSelected ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Guardando Foto...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-upload me-2"></i>
                              Guardar Foto
                            </>
                          )}
                        </Button>
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
                              <i className="bi bi-person me-1"></i>
                              Nombre de Usuario:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.nombre_usuario}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-envelope me-1"></i>
                              Email:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.correo}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-person-lines-fill me-1"></i>
                              Nombre Completo:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.nombre_completo || "No especificado"}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-telephone me-1"></i>
                              Teléfono:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.telefono || "No especificado"}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-geo-alt me-1"></i>
                              Dirección:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.direccion || "No especificada"}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-calendar-date me-1"></i>
                              Fecha Nacimiento:
                            </strong>
                          </Col>
                          <Col sm={8}>{userData.fecha_nacimiento || "No especificada"}</Col>
                        </Row>
                        <Row className="mb-3">
                          <Col sm={4}>
                            <strong className="text-muted">
                              <i className="bi bi-gender-ambiguous me-1"></i>
                              Género:
                            </strong>
                          </Col>
                          <Col sm={8}>{getGeneroLabel(userData.genero)}</Col>
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
            <h6 className="text-primary fw-bold mb-3">
              <i className="bi bi-person-circle me-2"></i>
              Información de Usuario
            </h6>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-person me-1"></i>
                    Nombre de Usuario *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_usuario"
                    value={editData.nombre_usuario || ""}
                    onChange={handleEditChange}
                    required
                    className="form-control-custom"
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-envelope me-1"></i>
                    Correo *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={editData.correo || ""}
                    onChange={handleEditChange}
                    required
                    className="form-control-custom"
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-shield-check me-1"></i>
                    Rol *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="rol"
                    value={editData.rol || ""}
                    readOnly
                    className="bg-light form-control-custom"
                    disabled={isSaving}
                  />
                  <Form.Text className="text-muted">El rol solo puede ser cambiado por un administrador.</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-success fw-bold mb-3">
              <i className="bi bi-person-badge me-2"></i>
              Información de Perfil
            </h6>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-person-lines-fill me-1"></i>
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_completo"
                    value={editData.nombre_completo || ""}
                    onChange={handleEditChange}
                    className="form-control-custom"
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-image me-1"></i>
                    URL de Foto
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="foto_url"
                    value={editData.foto_url || ""}
                    onChange={handleEditChange}
                    className="form-control-custom"
                    placeholder="https://ejemplo.com/foto.jpg"
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-geo-alt me-1"></i>
                    Dirección
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={editData.direccion || ""}
                    onChange={handleEditChange}
                    className="form-control-custom"
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-calendar-date me-1"></i>
                    Fecha de Nacimiento
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_nacimiento"
                    value={editData.fecha_nacimiento || ""}
                    onChange={handleEditChange}
                    className="form-control-custom"
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-gender-ambiguous me-1"></i>
                    Género
                  </Form.Label>
                  <Form.Select
                    name="genero"
                    value={editData.genero || ""}
                    onChange={handleEditChange}
                    className="form-control-custom"
                    disabled={isSaving}
                  >
                    <option value="">Seleccionar género...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>

                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={isSaving}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="btn-primary-custom" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Guardar Cambios
                </>
              )}
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
                disabled={isSaving}
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
                disabled={isSaving}
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
                disabled={isSaving}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)} disabled={isSaving}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button variant="warning" type="submit" className="btn-warning-custom" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Cambiando...
                </>
              ) : (
                <>
                  <i className="bi bi-key me-2"></i>
                  Cambiar Contraseña
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default PerfilA
