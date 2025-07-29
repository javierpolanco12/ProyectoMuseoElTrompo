"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar, Table, Modal } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "bootstrap/dist/css/bootstrap.min.css"
import "../CSS/RegistroInteractivo.css"

const Usuarios = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    // Datos del usuario
    nombre_usuario: "",
    correo: "",
    contrasena: "",
    confirmar_contrasena: "",
    rol: "",
    // Datos del perfil
    nombre_completo: "",
    telefono: "",
    foto_url: "",
    direccion: "",
    fecha_nacimiento: "",
    genero: "",
  })

  const [validated, setValidated] = useState(false)
  const [notification, setNotification] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [perfiles, setPerfiles] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [currentPerfilId, setCurrentPerfilId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Roles disponibles
  const roles = [
    {
      value: "administrador",
      label: "Administrador",
      icon: "bi-person-gear",
      color: "warning",
      description: "Acceso completo al sistema y gestión de usuarios",
    },
    {
      value: "usuario",
      label: "Usuario",
      icon: "bi-person",
      color: "success",
      description: "Usuario general del sistema con permisos básicos",
    },
    {
      value: "tecnico",
      label: "Técnico",
      icon: "bi-tools",
      color: "info",
      description: "Personal técnico de mantenimiento",
    },
  ]

  // Géneros disponibles
  const generos = [
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "otro", label: "Otro" },

  ]

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData()
  }, [])

  // Función para obtener usuarios y perfiles
  const fetchData = async () => {
    try {
      setLoadingData(true)
      setErrorData(null)

      // Obtener usuarios
      const usuariosResponse = await fetch("http://127.0.0.1:8000/api/usuarios/")
      if (!usuariosResponse.ok) {
        throw new Error(`Error al cargar usuarios: ${usuariosResponse.status}`)
      }
      const usuariosData = await usuariosResponse.json()

      // Obtener perfiles
      const perfilesResponse = await fetch("http://127.0.0.1:8000/api/perfiles/")
      if (!perfilesResponse.ok) {
        throw new Error(`Error al cargar perfiles: ${perfilesResponse.status}`)
      }
      const perfilesData = await perfilesResponse.json()

      setUsuarios(usuariosData)
      setPerfiles(perfilesData)
      console.log("Usuarios cargados:", usuariosData)
      console.log("Perfiles cargados:", perfilesData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setErrorData("Error al cargar la información de usuarios")
      showNotification("Error al cargar datos. Intente nuevamente.", "error")
    } finally {
      setLoadingData(false)
    }
  }

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

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const resetForm = () => {
    setFormData({
      nombre_usuario: "",
      correo: "",
      contrasena: "",
      confirmar_contrasena: "",
      rol: "",
      nombre_completo: "",
      telefono: "",
      foto_url: "",
      direccion: "",
      fecha_nacimiento: "",
      genero: "",
    })
    setValidated(false)
    setEditMode(false)
    setCurrentUserId(null)
    setCurrentPerfilId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    // Validaciones personalizadas
    let isValid = true
    let errorMessage = ""

    if (!formData.nombre_usuario.trim()) {
      isValid = false
      errorMessage = "El nombre de usuario es requerido"
    }

    if (!formData.correo.trim() || !validateEmail(formData.correo)) {
      isValid = false
      errorMessage = "Ingrese un correo electrónico válido"
    }

    if (!editMode) {
      if (!formData.contrasena || !validatePassword(formData.contrasena)) {
        isValid = false
        errorMessage = "La contraseña debe tener al menos 6 caracteres"
      }

      if (formData.contrasena !== formData.confirmar_contrasena) {
        isValid = false
        errorMessage = "Las contraseñas no coinciden"
      }
    }

    if (!formData.rol) {
      isValid = false
      errorMessage = "Seleccione un rol"
    }

    if (form.checkValidity() === false || !isValid) {
      e.stopPropagation()
      setValidated(true)
      showNotification(errorMessage || "Por favor complete todos los campos requeridos correctamente", "error")
      return
    }

    setIsLoading(true)

    try {
      if (editMode) {
        // Actualizar usuario existente
        await updateUsuario()
      } else {
        // Crear nuevo usuario
        await createUsuario()
      }

      // Recargar datos
      fetchData()

      // Resetear el formulario después de 1 segundo
      setTimeout(() => {
        resetForm()
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error al procesar usuario:", error)
      showNotification(`Error al ${editMode ? "actualizar" : "registrar"} usuario: ${error.message}`, "error")
      setIsLoading(false)
    }
  }

  const createUsuario = async () => {
    // 1. Crear usuario
    const usuarioData = {
      nombre_usuario: formData.nombre_usuario,
      correo: formData.correo,
      contrasena_hash: formData.contrasena, // El backend se encargará del hash
      rol: formData.rol,
    }

    const usuarioResponse = await fetch("http://127.0.0.1:8000/api/usuarios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    })

    if (!usuarioResponse.ok) {
      const errorData = await usuarioResponse.json()
      throw new Error(`Error al crear usuario: ${JSON.stringify(errorData)}`)
    }

    const usuarioCreado = await usuarioResponse.json()
    console.log("Usuario creado:", usuarioCreado)

    // 2. Crear perfil asociado al usuario
    const perfilData = {
      nombre_completo: formData.nombre_completo || "",
      telefono: formData.telefono || "",
      foto_url: formData.foto_url || "",
      direccion: formData.direccion || "",
      fecha_nacimiento: formData.fecha_nacimiento || null,
      genero: formData.genero || "",
      usuario: usuarioCreado.id,
    }

    const perfilResponse = await fetch("http://127.0.0.1:8000/api/perfiles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(perfilData),
    })

    if (!perfilResponse.ok) {
      const errorData = await perfilResponse.json()
      console.error("Error al crear perfil:", errorData)
      // No lanzamos error aquí para no fallar todo el proceso
    }

    showNotification("¡Usuario y perfil registrados con éxito!", "success")
  }

  const updateUsuario = async () => {
    // 1. Actualizar usuario
    const usuarioData = {
      nombre_usuario: formData.nombre_usuario,
      correo: formData.correo,
      rol: formData.rol,
    }

    // Solo incluir contraseña si se proporcionó una nueva
    if (formData.contrasena) {
      usuarioData.contrasena_hash = formData.contrasena
    }

    const usuarioResponse = await fetch(`http://127.0.0.1:8000/api/usuarios/${currentUserId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    })

    if (!usuarioResponse.ok) {
      const errorData = await usuarioResponse.json()
      throw new Error(`Error al actualizar usuario: ${JSON.stringify(errorData)}`)
    }

    // 2. Actualizar o crear perfil
    const perfilData = {
      nombre_completo: formData.nombre_completo || "",
      telefono: formData.telefono || "",
      foto_url: formData.foto_url || "",
      direccion: formData.direccion || "",
      fecha_nacimiento: formData.fecha_nacimiento || null,
      genero: formData.genero || "",
      usuario: currentUserId,
    }

    if (currentPerfilId) {
      // Actualizar perfil existente
      const perfilResponse = await fetch(`http://127.0.0.1:8000/api/perfiles/${currentPerfilId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(perfilData),
      })

      if (!perfilResponse.ok) {
        console.error("Error al actualizar perfil")
      }
    } else {
      // Crear nuevo perfil
      const perfilResponse = await fetch("http://127.0.0.1:8000/api/perfiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(perfilData),
      })

      if (!perfilResponse.ok) {
        console.error("Error al crear perfil")
      }
    }

    showNotification("¡Usuario actualizado con éxito!", "success")
  }

  // Función para editar un usuario
  const handleEdit = (usuario) => {
    const perfil = perfiles.find((p) => p.usuario === usuario.id)

    setFormData({
      nombre_usuario: usuario.nombre_usuario || "",
      correo: usuario.correo || "",
      contrasena: "",
      confirmar_contrasena: "",
      rol: usuario.rol || "",
      nombre_completo: perfil?.nombre_completo || "",
      telefono: perfil?.telefono || "",
      foto_url: perfil?.foto_url || "",
      direccion: perfil?.direccion || "",
      fecha_nacimiento: perfil?.fecha_nacimiento || "",
      genero: perfil?.genero || "",
    })

    setEditMode(true)
    setCurrentUserId(usuario.id)
    setCurrentPerfilId(perfil?.id || null)
    setValidated(false)

    // Desplazar hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Función para confirmar eliminación
  const confirmDelete = (usuario) => {
    setUserToDelete(usuario)
    setShowDeleteModal(true)
  }

  // Función para eliminar un usuario
  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      // Buscar y eliminar perfil asociado
      const perfil = perfiles.find((p) => p.usuario === userToDelete.id)
      if (perfil) {
        await fetch(`http://127.0.0.1:8000/api/perfiles/${perfil.id}/`, {
          method: "DELETE",
        })
      }

      // Eliminar usuario
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${userToDelete.id}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar usuario")
      }

      showNotification("Usuario eliminado con éxito", "success")
      fetchData()
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      showNotification("Error al eliminar usuario", "error")
    } finally {
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  const getRolBadge = (rol) => {
    const rolInfo = roles.find((r) => r.value === rol)
    if (!rolInfo) {
      return <Badge bg="secondary">{rol}</Badge>
    }

    return (
      <Badge bg={rolInfo.color} className="px-2 py-1">
        <i className={`bi ${rolInfo.icon} me-1`}></i>
        {rolInfo.label}
      </Badge>
    )
  }

  const getCompletionPercentage = () => {
    const requiredFields = ["nombre_usuario", "correo", "rol"]
    if (!editMode) {
      requiredFields.push("contrasena")
    }
    const completedFields = requiredFields.filter((field) => formData[field] && formData[field].trim() !== "")
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }

  const getRolInfo = () => {
    return roles.find((rol) => rol.value === formData.rol)
  }

  // Combinar usuarios con sus perfiles para mostrar en la tabla
  const usuariosConPerfiles = usuarios.map((usuario) => {
    const perfil = perfiles.find((p) => p.usuario === usuario.id)
    return {
      ...usuario,
      perfil: perfil || null,
    }
  })

  // Filtrar usuarios según término de búsqueda
  const filteredUsuarios = usuariosConPerfiles.filter(
    (usuario) =>
      usuario.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.rol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.perfil?.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.perfil?.telefono?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loadingData) {
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
              <p className="mt-3">Cargando usuarios y perfiles...</p>
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
                      <i className="bi bi-person-plus me-3"></i>
                      {editMode ? "Editar Usuario" : "Registro de Usuarios"}
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      {editMode
                        ? "Actualiza la información del usuario y perfil seleccionado"
                        : "Registra un nuevo usuario y su perfil en el sistema"}
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
          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <Card className="border-0 shadow-sm registration-card">
                <Card.Header className="bg-light border-0 py-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="bi bi-clipboard-data me-2 text-primary"></i>
                      Información del Usuario y Perfil
                    </h5>
                    <div className="d-flex align-items-center gap-2">
                      {editMode && (
                        <Button variant="outline-secondary" size="sm" onClick={resetForm} disabled={isLoading}>
                          <i className="bi bi-plus-circle me-1"></i>
                          Nuevo Usuario
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">
                  <Form className={validated ? "was-validated" : ""} onSubmit={handleSubmit} noValidate>
                    {/* Información de Usuario */}
                    <div className="mb-4">
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-person-circle me-2"></i>
                        Información de Usuario (Requerida)
                      </h6>

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-person me-1"></i>
                              Nombre de Usuario *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="nombre_usuario"
                              value={formData.nombre_usuario}
                              onChange={handleChange}
                              required
                              className="form-control-custom"
                              placeholder="Ingrese el nombre de usuario"
                              disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor ingrese un nombre de usuario válido.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-envelope me-1"></i>
                              Correo Electrónico *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="correo"
                              value={formData.correo}
                              onChange={handleChange}
                              required
                              className="form-control-custom"
                              placeholder="usuario@museo.com"
                              disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor ingrese un correo electrónico válido.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

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
                              <i className="bi bi-lock me-1"></i>
                              Contraseña {!editMode && "*"}
                            </Form.Label>
                            <div className="input-group">
                              <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required={!editMode}
                                className="form-control-custom"
                                placeholder={editMode ? "Dejar vacío para mantener actual" : "Mínimo 6 caracteres"}
                                disabled={isLoading}
                              />
                              <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                              </Button>
                            </div>
                            <Form.Control.Feedback type="invalid">
                              La contraseña debe tener al menos 6 caracteres.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        {!editMode && (
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                <i className="bi bi-lock-fill me-1"></i>
                                Confirmar Contraseña *
                              </Form.Label>
                              <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="confirmar_contrasena"
                                value={formData.confirmar_contrasena}
                                onChange={handleChange}
                                required={!editMode}
                                className="form-control-custom"
                                placeholder="Confirme la contraseña"
                                disabled={isLoading}
                              />
                              <Form.Control.Feedback type="invalid">
                                Las contraseñas deben coincidir.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        )}
                      </Row>
                    </div>

                    {/* Información de Perfil */}
                    <div className="mb-4">
                      <h6 className="text-success fw-bold mb-3">
                        <i className="bi bi-person-badge me-2"></i>
                        Información de Perfil (Opcional)
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
                              value={formData.nombre_completo}
                              onChange={handleChange}
                              className="form-control-custom"
                              placeholder="Nombre completo del usuario"
                              disabled={isLoading}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-phone me-1"></i>
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

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <i className="bi bi-calendar-date me-1"></i>
                              Fecha de Nacimiento
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="fecha_nacimiento"
                              value={formData.fecha_nacimiento}
                              onChange={handleChange}
                              className="form-control-custom"
                              disabled={isLoading}
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
                              value={formData.genero}
                              onChange={handleChange}
                              className="form-control-custom"
                              disabled={isLoading}
                            >
                              <option value="">Seleccionar género...</option>
                              {generos.map((genero, index) => (
                                <option key={index} value={genero.value}>
                                  {genero.label}
                                </option>
                              ))}
                            </Form.Select>
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
                              value={formData.foto_url}
                              onChange={handleChange}
                              className="form-control-custom"
                              placeholder="https://ejemplo.com/foto.jpg"
                              disabled={isLoading}
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
                              value={formData.direccion}
                              onChange={handleChange}
                              className="form-control-custom"
                              placeholder="Dirección completa"
                              disabled={isLoading}
                            />
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

                    {/* Botones de Acción */}
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <div className="text-muted small">Los campos marcados con * son obligatorios</div>

                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" onClick={resetForm} disabled={isLoading}>
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          {editMode ? "Cancelar" : "Limpiar"}
                        </Button>

                        <Button
                          type="submit"
                          variant={editMode ? "primary" : "success"}
                          className="submit-btn"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              {editMode ? "Actualizando..." : "Registrando..."}
                            </>
                          ) : (
                            <>
                              <i className={`bi ${editMode ? "bi-save" : "bi-check-circle"} me-2`}></i>
                              {editMode ? "Actualizar Usuario" : "Registrar Usuario"}
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

          {/* Tabla de Usuarios */}
          <Row className="mt-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                      <i className="bi bi-people me-2 text-primary"></i>
                      Lista de Usuarios y Perfiles
                    </h5>
                    <div className="d-flex gap-2 align-items-center">
                      <Form.Control
                        type="text"
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-sm"
                        style={{ width: "250px" }}
                      />
                      <Button variant="outline-primary" size="sm" onClick={fetchData} disabled={loadingData}>
                        <i className="bi bi-arrow-clockwise"></i>
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  {errorData ? (
                    <div className="text-center py-5">
                      <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "2rem" }}></i>
                      <p className="mt-3 text-danger">{errorData}</p>
                      <Button variant="outline-primary" size="sm" onClick={fetchData}>
                        Reintentar
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Nombre Completo</th>
                            <th>Teléfono</th>
                            <th>Género</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsuarios.length > 0 ? (
                            filteredUsuarios.map((usuario) => (
                              <tr key={usuario.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="avatar-circle bg-light text-primary me-2">
                                      {usuario.perfil?.foto_url ? (
                                        <img
                                          src={usuario.perfil.foto_url || "/placeholder.svg"}
                                          alt="Avatar"
                                          className="rounded-circle"
                                          style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                        />
                                      ) : (
                                        <i className="bi bi-person"></i>
                                      )}
                                    </div>
                                    <div>
                                      <div className="fw-bold">{usuario.nombre_usuario}</div>
                                      <small className="text-muted">ID: {usuario.id}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>{usuario.correo}</td>
                                <td>{getRolBadge(usuario.rol)}</td>
                                <td>{usuario.perfil?.nombre_completo || "No registrado"}</td>
                                <td>{usuario.perfil?.telefono || "No registrado"}</td>
                                <td>
                                  {usuario.perfil?.genero ? (
                                    <span className="badge bg-light text-dark">
                                      {generos.find((g) => g.value === usuario.perfil.genero)?.label ||
                                        usuario.perfil.genero}
                                    </span>
                                  ) : (
                                    "No especificado"
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => handleEdit(usuario)}
                                      title="Editar"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => confirmDelete(usuario)}
                                      title="Eliminar"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                {searchTerm ? (
                                  <>
                                    <i className="bi bi-search text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                    <p className="mb-0">No se encontraron usuarios que coincidan con "{searchTerm}"</p>
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-people text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                    <p className="mb-0">No hay usuarios registrados</p>
                                  </>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white border-0 p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      Total: {filteredUsuarios.length} usuarios | Perfiles: {perfiles.length}
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          resetForm()
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Nuevo Usuario
                      </Button>
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <div>
              <p>
                ¿Está seguro que desea eliminar al usuario <strong>{userToDelete.nombre_usuario}</strong> y su perfil
                asociado?
              </p>
              <p className="text-danger mb-0">Esta acción no se puede deshacer.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Usuarios
