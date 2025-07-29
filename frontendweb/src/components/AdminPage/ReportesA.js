"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal, InputGroup } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "../CSS/ReportesA.css"

const ReportesA = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [showNuevoReporteModal, setShowNuevoReporteModal] = useState(false)
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    estado: "",
    busqueda: "",
  })
  const [estadisticas, setEstadisticas] = useState({
    totalReportes: 0,
    reportesConFecha: 0,
    reportesSinFecha: 0,
    estadosDistintos: 0,
  })

  // Formulario para nuevo reporte
  const [nuevoReporte, setNuevoReporte] = useState({
    observaciones: "",
    fecha: "",
    interactivo: null,
    tarea: null,
    estado: null,
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

  // Función para obtener los reportes desde la API
  const fetchReportes = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://127.0.0.1:8000/api/reportes-mantenimiento/")

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Reportes recibidos:", data)
      setReportes(data)

      // Calcular estadísticas
      const stats = {
        totalReportes: data.length,
        reportesConFecha: data.filter((r) => r.fecha !== null).length,
        reportesSinFecha: data.filter((r) => r.fecha === null).length,
        estadosDistintos: new Set(data.map((r) => r.estado).filter((e) => e !== null)).size,
      }

      setEstadisticas(stats)
      showNotification("Reportes cargados correctamente", "success")
    } catch (error) {
      console.error("Error al cargar reportes:", error)
      showNotification("Error al cargar los reportes", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportes()
  }, [])

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: "",
      fechaFin: "",
      estado: "",
      busqueda: "",
    })
  }

  const reportesFiltrados = reportes.filter((reporte) => {
    const cumpleFechaInicio = !filtros.fechaInicio || (reporte.fecha && reporte.fecha >= filtros.fechaInicio)
    const cumpleFechaFin = !filtros.fechaFin || (reporte.fecha && reporte.fecha <= filtros.fechaFin)
    const cumpleEstado = !filtros.estado || reporte.estado?.toString() === filtros.estado
    const cumpleBusqueda =
      !filtros.busqueda ||
      reporte.observaciones?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      reporte.id?.toString().includes(filtros.busqueda)

    return cumpleFechaInicio && cumpleFechaFin && cumpleEstado && cumpleBusqueda
  })

  const verDetalle = (reporte) => {
    setReporteSeleccionado(reporte)
    setShowDetalleModal(true)
  }

  const handleNuevoReporteChange = (e) => {
    const { name, value, type } = e.target

    if (type === "select-one" && (name === "interactivo" || name === "tarea" || name === "estado")) {
      setNuevoReporte({
        ...nuevoReporte,
        [name]: value ? Number.parseInt(value) : null,
      })
    } else {
      setNuevoReporte({
        ...nuevoReporte,
        [name]: value || null,
      })
    }
  }

  const handleSubmitNuevoReporte = async (e) => {
    e.preventDefault()

    try {
      const dataToSend = {
        observaciones: nuevoReporte.observaciones || "",
        fecha: nuevoReporte.fecha || null,
        interactivo: nuevoReporte.interactivo,
        tarea: nuevoReporte.tarea,
        estado: nuevoReporte.estado,
      }

      console.log("Enviando nuevo reporte:", dataToSend)

      const response = await fetch("http://127.0.0.1:8000/api/reportes-mantenimiento/", {
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
      console.log("Reporte creado:", result)

      showNotification("¡Reporte creado con éxito!", "success")
      setShowNuevoReporteModal(false)
      setNuevoReporte({
        observaciones: "",
        fecha: "",
        interactivo: null,
        tarea: null,
        estado: null,
      })

      // Recargar reportes
      fetchReportes()
    } catch (error) {
      console.error("Error al crear reporte:", error)
      showNotification(`Error al crear reporte: ${error.message}`, "error")
    }
  }

  const getEstadoBadge = (estado) => {
    if (estado === null || estado === undefined) {
      return (
        <Badge bg="secondary" className="px-3 py-2">
          <i className="bi bi-question-circle me-1"></i>
          Sin Estado
        </Badge>
      )
    }

    // Mapeo básico de estados - ajusta según tu API
    const estadoConfig = {
      1: { bg: "danger", icon: "clock", text: "Pendiente" },
      2: { bg: "warning", icon: "gear", text: "En Proceso" },
      3: { bg: "success", icon: "check-circle", text: "Completado" },
    }

    const config = estadoConfig[estado] || {
      bg: "secondary",
      icon: "circle",
      text: `Estado ${estado}`,
    }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {config.text}
      </Badge>
    )
  }

  const formatFecha = (fecha) => {
    if (!fecha) return "No especificada"
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
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
              <p className="mt-3">Cargando reportes de mantenimiento...</p>
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
                      <i className="bi bi-clipboard-data me-3"></i>
                      Reportes de Mantenimiento
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      Gestión completa de reportes de mantenimiento del sistema
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Estadísticas Principales */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-file-text text-primary fs-4"></i>
                  </div>
                  <h3 className="text-primary fw-bold mb-1">{estadisticas.totalReportes}</h3>
                  <p className="text-muted mb-0 fw-medium">Total Reportes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-calendar-check text-success fs-4"></i>
                  </div>
                  <h3 className="text-success fw-bold mb-1">{estadisticas.reportesConFecha}</h3>
                  <p className="text-muted mb-0 fw-medium">Con Fecha</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-calendar-x text-warning fs-4"></i>
                  </div>
                  <h3 className="text-warning fw-bold mb-1">{estadisticas.reportesSinFecha}</h3>
                  <p className="text-muted mb-0 fw-medium">Sin Fecha</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-list-check text-info fs-4"></i>
                  </div>
                  <h3 className="text-info fw-bold mb-1">{estadisticas.estadosDistintos}</h3>
                  <p className="text-muted mb-0 fw-medium">Estados Diferentes</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filtros */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">
                  <i className="bi bi-funnel me-2 text-primary"></i>
                  Filtros de Búsqueda
                </h5>
                <Button variant="primary" onClick={() => setShowNuevoReporteModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Reporte
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                <Col lg={3} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-dark">
                      <i className="bi bi-calendar-event me-1"></i>
                      Fecha Inicio
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="fechaInicio"
                      value={filtros.fechaInicio}
                      onChange={handleFiltroChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col lg={3} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-dark">
                      <i className="bi bi-calendar-check me-1"></i>
                      Fecha Fin
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="fechaFin"
                      value={filtros.fechaFin}
                      onChange={handleFiltroChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col lg={3} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-dark">
                      <i className="bi bi-list-check me-1"></i>
                      Estado
                    </Form.Label>
                    <Form.Select
                      name="estado"
                      value={filtros.estado}
                      onChange={handleFiltroChange}
                      className="form-control-custom"
                    >
                      <option value="">Todos los estados</option>
                      <option value="1">Pendiente</option>
                      <option value="2">En Proceso</option>
                      <option value="3">Completado</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={3} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-dark">
                      <i className="bi bi-search me-1"></i>
                      Búsqueda
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="busqueda"
                        value={filtros.busqueda}
                        onChange={handleFiltroChange}
                        placeholder="Buscar en observaciones..."
                        className="form-control-custom"
                      />
                      <Button variant="outline-primary" className="search-btn">
                        <i className="bi bi-search"></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={limpiarFiltros}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Limpiar Filtros
                    </Button>
                    <Button variant="outline-primary" onClick={fetchReportes}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Actualizar
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tabla de Reportes */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-0 py-3">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold text-dark">
                  <i className="bi bi-table me-2 text-primary"></i>
                  Reportes de Mantenimiento
                </h5>
                <Badge bg="primary" className="px-3 py-2 fs-6">
                  {reportesFiltrados.length} reportes
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="table-custom" hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Interactivo ID</th>
                      <th>Tarea ID</th>
                      <th>Estado</th>
                      <th>Observaciones</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportesFiltrados.map((reporte) => (
                      <tr key={reporte.id}>
                        <td>
                          <strong className="text-primary">#{reporte.id}</strong>
                        </td>
                        <td>
                          <div className="fw-medium">{formatFecha(reporte.fecha)}</div>
                        </td>
                        <td>
                          {reporte.interactivo ? (
                            <span className="badge bg-info text-white px-3 py-2">ID: {reporte.interactivo}</span>
                          ) : (
                            <span className="text-muted">No asignado</span>
                          )}
                        </td>
                        <td>
                          {reporte.tarea ? (
                            <span className="badge bg-secondary text-white px-3 py-2">ID: {reporte.tarea}</span>
                          ) : (
                            <span className="text-muted">No asignada</span>
                          )}
                        </td>
                        <td>{getEstadoBadge(reporte.estado)}</td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: "200px" }}>
                            {reporte.observaciones || "Sin observaciones"}
                          </div>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => verDetalle(reporte)}
                            className="action-btn"
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {reportesFiltrados.length === 0 && (
                <div className="empty-state">
                  <div className="mb-3">
                    <i className="bi bi-search text-muted" style={{ fontSize: "3rem" }}></i>
                  </div>
                  <h5 className="text-muted">No se encontraron reportes</h5>
                  <p className="text-muted mb-0">No hay reportes que coincidan con los filtros aplicados.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Modal de Detalle */}
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fw-bold">
            <i className="bi bi-file-text me-2"></i>
            Detalle del Reporte - #{reporteSeleccionado?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {reporteSeleccionado && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Información General
                      </h6>
                      <div className="mb-2">
                        <strong>ID del Reporte:</strong>
                        <span className="badge bg-primary ms-2">#{reporteSeleccionado.id}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Fecha:</strong> {formatFecha(reporteSeleccionado.fecha)}
                      </div>
                      <div className="mb-2">
                        <strong>Estado:</strong> {getEstadoBadge(reporteSeleccionado.estado)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-link me-2"></i>
                        Referencias
                      </h6>
                      <div className="mb-2">
                        <strong>Interactivo ID:</strong>
                        {reporteSeleccionado.interactivo ? (
                          <span className="badge bg-info ms-2">ID: {reporteSeleccionado.interactivo}</span>
                        ) : (
                          <span className="text-muted ms-2">No asignado</span>
                        )}
                      </div>
                      <div className="mb-2">
                        <strong>Tarea ID:</strong>
                        {reporteSeleccionado.tarea ? (
                          <span className="badge bg-secondary ms-2">ID: {reporteSeleccionado.tarea}</span>
                        ) : (
                          <span className="text-muted ms-2">No asignada</span>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-chat-text me-2"></i>
                        Observaciones
                      </h6>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-muted mb-0">
                          {reporteSeleccionado.observaciones || "No hay observaciones registradas"}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
            <i className="bi bi-x-circle me-2"></i>
            Cerrar
          </Button>
          <Button variant="primary">
            <i className="bi bi-printer me-2"></i>
            Imprimir
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Nuevo Reporte */}
      <Modal show={showNuevoReporteModal} onHide={() => setShowNuevoReporteModal(false)} size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fw-bold">
            <i className="bi bi-plus-circle me-2"></i>
            Crear Nuevo Reporte
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitNuevoReporte}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-calendar me-1"></i>
                    Fecha
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={nuevoReporte.fecha}
                    onChange={handleNuevoReporteChange}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-list-check me-1"></i>
                    Estado
                  </Form.Label>
                  <Form.Select
                    name="estado"
                    value={nuevoReporte.estado || ""}
                    onChange={handleNuevoReporteChange}
                    className="form-control-custom"
                  >
                    <option value="">Seleccionar estado...</option>
                    <option value="1">Pendiente</option>
                    <option value="2">En Proceso</option>
                    <option value="3">Completado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-display me-1"></i>
                    ID Interactivo
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="interactivo"
                    value={nuevoReporte.interactivo || ""}
                    onChange={handleNuevoReporteChange}
                    className="form-control-custom"
                    placeholder="ID del interactivo"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-clipboard-check me-1"></i>
                    ID Tarea
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="tarea"
                    value={nuevoReporte.tarea || ""}
                    onChange={handleNuevoReporteChange}
                    className="form-control-custom"
                    placeholder="ID de la tarea"
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
                    rows={4}
                    name="observaciones"
                    value={nuevoReporte.observaciones}
                    onChange={handleNuevoReporteChange}
                    className="form-control-custom"
                    placeholder="Escriba las observaciones del reporte..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowNuevoReporteModal(false)}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              <i className="bi bi-check-circle me-2"></i>
              Crear Reporte
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default ReportesA
