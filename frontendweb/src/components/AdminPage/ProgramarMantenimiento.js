"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Table, ProgressBar } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "../CSS/ProgramarMantenimiento.css"

const ProgramarMantenimiento = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [tipoMantenimiento, setTipoMantenimiento] = useState("preventivo")
  const [formData, setFormData] = useState({
    interactivo: "",
    sala: "",
    tipoMantenimiento: "preventivo",
    prioridad: "media",
    fechaProgramada: "",
    horaProgramada: "",
    tecnicoAsignado: "",
    descripcion: "",
    materialesNecesarios: "",
    tiempoEstimado: "",
  })
  const [interactivos, setInteractivos] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [mantenimientosProgramados, setMantenimientosProgramados] = useState([])
  const [estadisticas, setEstadisticas] = useState({})

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
    // Datos de interactivos por sala
    const datosInteractivos = [
      {
        sala: "Integra",
        interactivos: [
          {
            id: 1,
            nombre: "Puente de Colores",
            estado: "Operativo",
            ultimoMantenimiento: "2023-12-15",
            proximoMantenimiento: "2024-01-15",
            departamento: "Sistema",
          },
          {
            id: 2,
            nombre: "Círculo Musical",
            estado: "Operativo",
            ultimoMantenimiento: "2023-12-20",
            proximoMantenimiento: "2024-01-20",
            departamento: "Sistema",
          },
        ],
      },
      {
        sala: "Experimenta",
        interactivos: [
          {
            id: 4,
            nombre: "Generador de Van de Graaff",
            estado: "Fuera de Servicio",
            ultimoMantenimiento: "2023-11-30",
            proximoMantenimiento: "Inmediato",
            departamento: "Sistema",
          },
        ],
      },
      {
        sala: "Explica",
        interactivos: [
          {
            id: 3,
            nombre: "Ciclo del Agua",
            estado: "Mantenimiento Vencido",
            ultimoMantenimiento: "2023-11-15",
            proximoMantenimiento: "Vencido",
            departamento: "Mantenimiento",
          },
        ],
      },
      {
        sala: "Educa",
        interactivos: [
          {
            id: 5,
            nombre: "Panel Solar",
            estado: "Operativo",
            ultimoMantenimiento: "2024-01-05",
            proximoMantenimiento: "2024-02-05",
            departamento: "Sistema",
          },
        ],
      },
      {
        sala: "Zona Espacial",
        interactivos: [
          {
            id: 6,
            nombre: "Simulador de Gravedad",
            estado: "Operativo",
            ultimoMantenimiento: "2023-12-10",
            proximoMantenimiento: "2024-01-16",
            departamento: "Mantenimiento",
          },
        ],
      },
    ]

    // Lista de técnicos disponibles
    const listaTecnicos = [
      { id: 1, nombre: "Juan Pérez", especialidad: "Electrónica", disponible: true, departamento: "Sistema" },
      { id: 2, nombre: "María García", especialidad: "Mecánica", disponible: true, departamento: "Mantenimiento" },
      { id: 3, nombre: "Carlos López", especialidad: "Software", disponible: false, departamento: "Sistema" },
      { id: 4, nombre: "Ana Martínez", especialidad: "Sistemas", disponible: true, departamento: "Sistema" },
      { id: 5, nombre: "Roberto Silva", especialidad: "Electrónica", disponible: true, departamento: "Mantenimiento" },
    ]

    // Mantenimientos ya programados
    const mantenimientosProgramados = [
      {
        id: "MT001",
        interactivo: "Puente de Colores",
        sala: "Integra",
        tipo: "Preventivo",
        fecha: "2024-01-15",
        hora: "09:00",
        tecnico: "Juan Pérez",
        prioridad: "Media",
        estado: "Programado",
        departamento: "Sistema",
        descripcion: "Revisión general de componentes eléctricos",
        tiempoEstimado: "2.0",
      },
      {
        id: "MT002",
        interactivo: "Generador de Van de Graaff",
        sala: "Experimenta",
        tipo: "Correctivo",
        fecha: "2024-01-12",
        hora: "08:00",
        tecnico: "María García",
        prioridad: "Urgente",
        estado: "En Progreso",
        departamento: "Sistema",
        descripcion: "Reparación de falla eléctrica crítica",
        tiempoEstimado: "4.0",
      },
      {
        id: "MT003",
        interactivo: "Simulador de Gravedad",
        sala: "Zona Espacial",
        tipo: "Preventivo",
        fecha: "2024-01-16",
        hora: "14:00",
        tecnico: "Carlos López",
        prioridad: "Baja",
        estado: "Programado",
        departamento: "Mantenimiento",
        descripcion: "Mantenimiento preventivo programado",
        tiempoEstimado: "1.5",
      },
    ]

    // Estadísticas del sistema
    const estadisticas = {
      totalProgramados: mantenimientosProgramados.length,
      enProgreso: mantenimientosProgramados.filter((m) => m.estado === "En Progreso").length,
      urgentes: mantenimientosProgramados.filter((m) => m.prioridad === "Urgente").length,
      tecnicosDisponibles: listaTecnicos.filter((t) => t.disponible).length,
      eficienciaProgramacion: 92,
      cumplimientoTiempos: 87,
    }

    setInteractivos(datosInteractivos)
    setTecnicos(listaTecnicos)
    setMantenimientosProgramados(mantenimientosProgramados)
    setEstadisticas(estadisticas)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Si cambia el interactivo, actualizar la sala automáticamente
    if (name === "interactivo") {
      const interactivoSeleccionado = interactivos
        .flatMap((sala) => sala.interactivos.map((int) => ({ ...int, sala: sala.sala })))
        .find((int) => int.nombre === value)

      if (interactivoSeleccionado) {
        setFormData((prev) => ({
          ...prev,
          sala: interactivoSeleccionado.sala,
        }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.interactivo || !formData.fechaProgramada || !formData.tecnicoAsignado) {
      showNotification("Por favor complete todos los campos obligatorios", "error")
      return
    }

    // Simular guardado
    const nuevoMantenimiento = {
      id: `MT${String(mantenimientosProgramados.length + 4).padStart(3, "0")}`,
      interactivo: formData.interactivo,
      sala: formData.sala,
      tipo: formData.tipoMantenimiento === "preventivo" ? "Preventivo" : "Correctivo",
      fecha: formData.fechaProgramada,
      hora: formData.horaProgramada || "08:00",
      tecnico: formData.tecnicoAsignado,
      prioridad: formData.prioridad.charAt(0).toUpperCase() + formData.prioridad.slice(1),
      estado: "Programado",
      descripcion: formData.descripcion,
      materiales: formData.materialesNecesarios,
      tiempoEstimado: formData.tiempoEstimado,
      departamento: tecnicos.find((t) => t.nombre === formData.tecnicoAsignado)?.departamento || "Sistema",
    }

    setMantenimientosProgramados((prev) => [...prev, nuevoMantenimiento])
    showNotification("Mantenimiento programado exitosamente", "success")

    // Limpiar formulario
    setFormData({
      interactivo: "",
      sala: "",
      tipoMantenimiento: "preventivo",
      prioridad: "media",
      fechaProgramada: "",
      horaProgramada: "",
      tecnicoAsignado: "",
      descripcion: "",
      materialesNecesarios: "",
      tiempoEstimado: "",
    })
    setShowModal(false)
  }

  const getPrioridadBadge = (prioridad) => {
    const badgeConfig = {
      Urgente: { bg: "danger", icon: "exclamation-triangle-fill" },
      Alta: { bg: "warning", icon: "exclamation-triangle" },
      Media: { bg: "info", icon: "info-circle" },
      Baja: { bg: "secondary", icon: "circle" },
    }

    const config = badgeConfig[prioridad] || { bg: "secondary", icon: "circle" }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {prioridad}
      </Badge>
    )
  }

  const getTipoBadge = (tipo) => {
    return tipo === "Correctivo" ? (
      <Badge bg="danger" className="px-3 py-2">
        <i className="bi bi-tools me-1"></i>
        Correctivo
      </Badge>
    ) : (
      <Badge bg="primary" className="px-3 py-2">
        <i className="bi bi-calendar-check me-1"></i>
        Preventivo
      </Badge>
    )
  }

  const getEstadoBadge = (estado) => {
    const badgeConfig = {
      Programado: { bg: "info", icon: "calendar-event" },
      "En Progreso": { bg: "warning", icon: "clock" },
      Completado: { bg: "success", icon: "check-circle" },
      Cancelado: { bg: "secondary", icon: "x-circle" },
    }

    const config = badgeConfig[estado] || { bg: "secondary", icon: "circle" }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {estado}
      </Badge>
    )
  }

  const getDepartamentoBadge = (departamento) => {
    return departamento === "Sistema" ? (
      <Badge bg="primary" className="px-2 py-1">
        <i className="bi bi-cpu me-1"></i>
        Sistema
      </Badge>
    ) : (
      <Badge bg="success" className="px-2 py-1">
        <i className="bi bi-tools me-1"></i>
        Mantenimiento
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
                      onClick={() => setShowModal(true)}
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
                    <i className="bi bi-people text-success fs-4"></i>
                  </div>
                  <h3 className="text-success fw-bold mb-1">{estadisticas.tecnicosDisponibles}</h3>
                  <p className="text-muted mb-0 fw-medium">Técnicos Disponibles</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Lista de Mantenimientos Programados */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-list-check me-2 text-primary"></i>
                    Mantenimientos Programados
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="table-custom" hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Interactivo</th>
                          <th>Sala</th>
                          <th>Tipo</th>
                          <th>Fecha/Hora</th>
                          <th>Técnico</th>
                          <th>Departamento</th>
                          <th>Prioridad</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mantenimientosProgramados.map((mantenimiento) => (
                          <tr key={mantenimiento.id}>
                            <td>
                              <strong className="text-primary">{mantenimiento.id}</strong>
                            </td>
                            <td>
                              <div>
                                <div className="fw-medium">{mantenimiento.interactivo}</div>
                                {mantenimiento.descripcion && (
                                  <small className="text-muted">{mantenimiento.descripcion}</small>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">{mantenimiento.sala}</span>
                            </td>
                            <td>{getTipoBadge(mantenimiento.tipo)}</td>
                            <td>
                              <div>
                                <div className="fw-medium">{mantenimiento.fecha}</div>
                                <small className="text-muted">{mantenimiento.hora}</small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-person-circle me-2 text-muted"></i>
                                <span>{mantenimiento.tecnico}</span>
                              </div>
                            </td>
                            <td>{getDepartamentoBadge(mantenimiento.departamento)}</td>
                            <td>{getPrioridadBadge(mantenimiento.prioridad)}</td>
                            <td>{getEstadoBadge(mantenimiento.estado)}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button variant="outline-primary" size="sm" className="action-btn">
                                  <i className="bi bi-eye"></i>
                                </Button>
                                <Button variant="outline-warning" size="sm" className="action-btn">
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button variant="outline-danger" size="sm" className="action-btn">
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal para Nuevo Mantenimiento */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="maintenance-modal">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="bi bi-calendar-plus me-2"></i>
            Programar Nuevo Mantenimiento
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-gear me-1"></i>
                    Tipo de Mantenimiento *
                  </Form.Label>
                  <Form.Select
                    name="tipoMantenimiento"
                    value={formData.tipoMantenimiento}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-flag me-1"></i>
                    Prioridad *
                  </Form.Label>
                  <Form.Select
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-display me-1"></i>
                    Interactivo *
                  </Form.Label>
                  <Form.Select
                    name="interactivo"
                    value={formData.interactivo}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="">Seleccionar interactivo...</option>
                    {interactivos.map((sala) =>
                      sala.interactivos.map((interactivo) => (
                        <option key={interactivo.id} value={interactivo.nombre}>
                          {interactivo.nombre} - {sala.sala}
                        </option>
                      )),
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-geo-alt me-1"></i>
                    Sala
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="sala"
                    value={formData.sala}
                    readOnly
                    className="bg-light form-control-custom"
                  />
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
                    name="fechaProgramada"
                    value={formData.fechaProgramada}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-clock me-1"></i>
                    Hora Programada
                  </Form.Label>
                  <Form.Control
                    type="time"
                    name="horaProgramada"
                    value={formData.horaProgramada}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-person-gear me-1"></i>
                    Técnico Asignado *
                  </Form.Label>
                  <Form.Select
                    name="tecnicoAsignado"
                    value={formData.tecnicoAsignado}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="">Seleccionar técnico...</option>
                    {tecnicos
                      .filter((t) => t.disponible)
                      .map((tecnico) => (
                        <option key={tecnico.id} value={tecnico.nombre}>
                          {tecnico.nombre} - {tecnico.especialidad} ({tecnico.departamento})
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-stopwatch me-1"></i>
                    Tiempo Estimado (horas)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="tiempoEstimado"
                    value={formData.tiempoEstimado}
                    onChange={handleInputChange}
                    min="0.5"
                    step="0.5"
                    placeholder="2.0"
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <i className="bi bi-file-text me-1"></i>
                Descripción del Trabajo
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

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <i className="bi bi-tools me-1"></i>
                Materiales Necesarios
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="materialesNecesarios"
                value={formData.materialesNecesarios}
                onChange={handleInputChange}
                placeholder="Lista de materiales y herramientas necesarias..."
                className="form-control-custom"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="btn-primary-custom">
              <i className="bi bi-calendar-plus me-2"></i>
              Programar Mantenimiento
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default ProgramarMantenimiento
