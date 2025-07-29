"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Table } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "../CSS/ProgramarMantenimiento.css"

const ProgramarMantenimiento = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }
  const [notification, setNotification] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [tareas, setTareas] = useState([])
  const [loading, setLoading] = useState(true)
  const [salas, setSalas] = useState([])
  const [interactivos, setInteractivos] = useState([])
  const [proyectores, setProyectores] = useState([])
  const [loadingSalas, setLoadingSalas] = useState(false)
  const [loadingInteractivos, setLoadingInteractivos] = useState(false)
  const [loadingProyectores, setLoadingProyectores] = useState(false)
  const [editingTarea, setEditingTarea] = useState(null) // Estado para la tarea que se está editando
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_programada: "",
    interactivo: "",
    area: "",
    tipo: "1",
    estado: "2",
  })

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Función para obtener las salas desde la API
  const fetchSalas = async () => {
    try {
      setLoadingSalas(true)
      const response = await fetch("http://127.0.0.1:8000/api/salas/")
      if (!response.ok) {
        throw new Error("Error al obtener las salas")
      }
      const data = await response.json()
      setSalas(data)
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar las salas", "error")
    } finally {
      setLoadingSalas(false)
    }
  }

  // Función para obtener los interactivos desde la API
  const fetchInteractivos = async () => {
    try {
      setLoadingInteractivos(true)
      const response = await fetch("http://127.0.0.1:8000/api/interactivos/")
      if (!response.ok) {
        throw new Error("Error al obtener los interactivos")
      }
      const data = await response.json()
      setInteractivos(data)
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar los interactivos", "error")
    } finally {
      setLoadingInteractivos(false)
    }
  }

  // Función para obtener los proyectores desde la API
  const fetchProyectores = async () => {
    try {
      setLoadingProyectores(true)
      const response = await fetch("http://127.0.0.1:8000/api/proyectores/")
      if (!response.ok) {
        throw new Error("Error al obtener los proyectores")
      }
      const data = await response.json()
      setProyectores(data)
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar los proyectores", "error")
    } finally {
      setLoadingProyectores(false)
    }
  }

  // Función para obtener las tareas desde la API
  const fetchTareas = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://127.0.0.1:8000/api/tareas-mantenimiento/")
      if (!response.ok) {
        throw new Error("Error al obtener las tareas")
      }
      const data = await response.json()
      setTareas(data)
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar las tareas de mantenimiento", "error")
    } finally {
      setLoading(false)
    }
  }

  // Función para crear una nueva tarea
  const createTarea = async (nuevaTarea) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tareas-mantenimiento/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...nuevaTarea,
          fecha_realizada: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear la tarea")
      }

      const data = await response.json()
      setTareas((prev) => [...prev, data])
      showNotification("Tarea de mantenimiento creada exitosamente", "success")
      return data
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al crear la tarea de mantenimiento", "error")
      throw error
    }
  }

  // Función para actualizar una tarea existente
  const updateTarea = async (id, updatedData) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tareas-mantenimiento/${id}/`, {
        method: "PUT", // O PATCH si solo envías los campos modificados
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar la tarea")
      }

      const data = await response.json()
      setTareas((prev) => prev.map((t) => (t.id === id ? data : t)))
      showNotification("Tarea de mantenimiento actualizada exitosamente", "success")
      return data
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al actualizar la tarea de mantenimiento", "error")
      throw error
    }
  }

  // Función para eliminar una tarea
  const deleteTarea = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      return
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tareas-mantenimiento/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea")
      }

      setTareas((prev) => prev.filter((t) => t.id !== id))
      showNotification("Tarea de mantenimiento eliminada exitosamente", "success")
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al eliminar la tarea de mantenimiento", "error")
    }
  }

  useEffect(() => {
    fetchTareas()
    fetchSalas()
    fetchInteractivos()
    fetchProyectores()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Si cambia el área, limpiar el interactivo seleccionado
    if (name === "area") {
      setFormData((prev) => ({
        ...prev,
        interactivo: "",
      }))
    }
  }

  const handleOpenModal = (tarea = null) => {
    if (tarea) {
      setEditingTarea(tarea)
      setFormData({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || "",
        fecha_programada: tarea.fecha_programada,
        interactivo: String(tarea.interactivo), // Convertir a string para el select
        area: String(tarea.area), // Convertir a string para el select
        tipo: String(tarea.tipo),
        estado: String(tarea.estado),
      })
    } else {
      setEditingTarea(null)
      setFormData({
        titulo: "",
        descripcion: "",
        fecha_programada: "",
        interactivo: "",
        area: "",
        tipo: "1",
        estado: "2",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTarea(null) // Limpiar la tarea en edición al cerrar
    setFormData({
      titulo: "",
      descripcion: "",
      fecha_programada: "",
      interactivo: "",
      area: "",
      tipo: "1",
      estado: "2",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.titulo || !formData.fecha_programada || !formData.interactivo) {
      showNotification("Por favor complete todos los campos obligatorios", "error")
      return
    }

    const tareaData = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha_programada: formData.fecha_programada,
      interactivo: Number.parseInt(formData.interactivo),
      reporte: 1, // Valor fijo, ajustar si es necesario
      area: Number.parseInt(formData.area) || 1,
      tipo: Number.parseInt(formData.tipo),
      estado: Number.parseInt(formData.estado),
    }

    try {
      if (editingTarea) {
        await updateTarea(editingTarea.id, tareaData)
      } else {
        await createTarea(tareaData)
      }
      handleCloseModal()
    } catch (error) {
      // El error ya se maneja en createTarea/updateTarea
    }
  }

  const getTipoLabel = (tipo) => {
    const tipos = {
      1: "Preventivo",
      2: "Correctivo",
      3: "Emergencia",
    }
    return tipos[tipo] || "Desconocido"
  }

  const getEstadoLabel = (estado) => {
    const estados = {
      1: "Pendiente",
      2: "Programado",
      3: "En Progreso",
      4: "Completado",
      5: "Cancelado",
    }
    return estados[estado] || "Desconocido"
  }

  const getTipoBadge = (tipo) => {
    const tipoLabel = getTipoLabel(tipo)
    return tipo === 2 ? (
      <Badge bg="danger" className="px-3 py-2">
        <i className="bi bi-tools me-1"></i>
        {tipoLabel}
      </Badge>
    ) : (
      <Badge bg="primary" className="px-3 py-2">
        <i className="bi bi-calendar-check me-1"></i>
        {tipoLabel}
      </Badge>
    )
  }

  const getEstadoBadge = (estado) => {
    const estadoLabel = getEstadoLabel(estado)
    const badgeConfig = {
      1: { bg: "secondary", icon: "clock" }, // Pendiente
      2: { bg: "info", icon: "calendar-event" }, // Programado
      3: { bg: "warning", icon: "clock" }, // En Progreso
      4: { bg: "success", icon: "check-circle" }, // Completado
      5: { bg: "secondary", icon: "x-circle" }, // Cancelado
    }

    const config = badgeConfig[estado] || { bg: "secondary", icon: "circle" }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {estadoLabel}
      </Badge>
    )
  }

  // Calcular estadísticas
  const estadisticas = {
    totalProgramados: tareas.length,
    enProgreso: tareas.filter((t) => t.estado === 3).length,
    urgentes: tareas.filter((t) => t.tipo === 3).length,
    completados: tareas.filter((t) => t.estado === 4).length,
  }

  // Filtrar interactivos y proyectores por sala seleccionada
  const getItemsFiltradosPorSala = () => {
    if (!formData.area) return []
    const selectedAreaId = Number.parseInt(formData.area)

    const filteredInteractivos = interactivos
      .filter((item) => item.sala === selectedAreaId)
      .map((item) => ({ ...item, type: "interactivo" }))

    const filteredProyectores = proyectores
      .filter((item) => item.sala === selectedAreaId)
      .map((item) => ({ ...item, type: "proyector" }))

    return [...filteredInteractivos, ...filteredProyectores]
  }

  // Obtener nombre de la sala por ID
  const getNombreSala = (salaId) => {
    const sala = salas.find((s) => s.id === salaId)
    return sala ? sala.nombre : `Sala #${salaId}`
  }

  // Obtener nombre del interactivo/proyector por ID
  const getNombreItem = (itemId) => {
    const item = [...interactivos, ...proyectores].find((i) => i.id === itemId)
    return item ? item.nombre : `Item #${itemId}`
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
                      <i className="bi bi-calendar-plus me-3"></i>
                      Programar Mantenimiento
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      Gestión y programación de mantenimientos preventivos y correctivos
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                    <Button
                      variant="light"
                      size="lg"
                      onClick={() => handleOpenModal()} // Abre el modal para crear
                      className="new-maintenance-btn"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Nuevo Mantenimiento
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Métricas Principales */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-calendar-event text-info fs-4"></i>
                  </div>
                  <h3 className="text-info fw-bold mb-1">{estadisticas.totalProgramados}</h3>
                  <p className="text-muted mb-0 fw-medium">Total Programados</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-clock text-warning fs-4"></i>
                  </div>
                  <h3 className="text-warning fw-bold mb-1">{estadisticas.enProgreso}</h3>
                  <p className="text-muted mb-0 fw-medium">En Progreso</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
                  </div>
                  <h3 className="text-danger fw-bold mb-1">{estadisticas.urgentes}</h3>
                  <p className="text-muted mb-0 fw-medium">Urgentes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-check-circle text-success fs-4"></i>
                  </div>
                  <h3 className="text-success fw-bold mb-1">{estadisticas.completados}</h3>
                  <p className="text-muted mb-0 fw-medium">Completados</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Lista de Mantenimientos Programados */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="bi bi-list-check me-2 text-primary"></i>
                      Tareas de Mantenimiento
                    </h5>
                    <Button variant="outline-primary" size="sm" onClick={fetchTareas}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Actualizar
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  {loading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table-custom" hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Fecha Programada</th>
                            <th>Interactivo/Proyector</th>
                            <th>Área</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tareas.map((tarea) => (
                            <tr key={tarea.id}>
                              <td>
                                <strong className="text-primary">#{tarea.id}</strong>
                              </td>
                              <td>
                                <div className="fw-medium">{tarea.titulo}</div>
                              </td>
                              <td>
                                <div>
                                  {tarea.descripcion && <small className="text-muted">{tarea.descripcion}</small>}
                                </div>
                              </td>
                              <td>
                                <div className="fw-medium">{tarea.fecha_programada}</div>
                                {tarea.fecha_realizada && (
                                  <small className="text-success">Realizada: {tarea.fecha_realizada}</small>
                                )}
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">{getNombreItem(tarea.interactivo)}</span>
                              </td>
                              <td>
                                <span className="badge bg-secondary">{getNombreSala(tarea.area)}</span>
                              </td>
                              <td>{getTipoBadge(tarea.tipo)}</td>
                              <td>{getEstadoBadge(tarea.estado)}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button variant="outline-primary" size="sm" className="action-btn">
                                    <i className="bi bi-eye"></i>
                                  </Button>
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    className="action-btn"
                                    onClick={() => handleOpenModal(tarea)} // Abre el modal para editar
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="action-btn"
                                    onClick={() => deleteTarea(tarea.id)} // Llama a la función de eliminar
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal para Nueva Tarea / Editar Tarea */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" className="maintenance-modal">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="bi bi-calendar-plus me-2"></i>
            {editingTarea ? "Editar Tarea de Mantenimiento" : "Crear Nueva Tarea de Mantenimiento"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-card-text me-1"></i>
                    Título *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Revisión de pantalla táctil"
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-gear me-1"></i>
                    Tipo de Mantenimiento *
                  </Form.Label>
                  <Form.Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="1">Preventivo</option>
                    <option value="2">Correctivo</option>
                    <option value="3">Emergencia</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-geo-alt me-1"></i>
                    Área/Sala *
                  </Form.Label>
                  <Form.Select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                    disabled={loadingSalas}
                  >
                    <option value="">{loadingSalas ? "Cargando salas..." : "Seleccionar sala..."}</option>
                    {salas.map((sala) => (
                      <option key={sala.id} value={sala.id}>
                        {sala.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-display me-1"></i>
                    Interactivo/Proyector *
                  </Form.Label>
                  <Form.Select
                    name="interactivo"
                    value={formData.interactivo}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                    disabled={!formData.area || loadingInteractivos || loadingProyectores}
                  >
                    <option value="">
                      {!formData.area
                        ? "Primero selecciona una sala..."
                        : loadingInteractivos || loadingProyectores
                          ? "Cargando items..."
                          : "Seleccionar item..."}
                    </option>
                    {getItemsFiltradosPorSala().map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombre} ({item.type === "proyector" ? "Proyector" : "Interactivo"})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-calendar me-1"></i>
                    Fecha Programada *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_programada"
                    value={formData.fecha_programada}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-flag me-1"></i>
                    Estado
                  </Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  >
                    <option value="1">Pendiente</option>
                    <option value="2">Programado</option>
                    <option value="3">En Progreso</option>
                    <option value="4">Completado</option>
                    <option value="5">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <i className="bi bi-file-text me-1"></i>
                Descripción
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe el trabajo a realizar..."
                className="form-control-custom"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={handleCloseModal}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="btn-primary-custom">
              <i className="bi bi-calendar-plus me-2"></i>
              {editingTarea ? "Actualizar Tarea" : "Crear Tarea"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default ProgramarMantenimiento
