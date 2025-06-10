"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal, InputGroup, ProgressBar } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "../CSS/ReportesA.css"

const ReportesA = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    sala: "",
    tipoMantenimiento: "",
    tecnico: "",
    busqueda: "",
  })
  const [reportesFinalizados, setReportesFinalizados] = useState([])
  const [estadisticas, setEstadisticas] = useState({})
  const [salas, setSalas] = useState([])
  const [tecnicos, setTecnicos] = useState([])

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
    // Datos de reportes de mantenimientos finalizados
    const reportesData = [
      {
        id: "RPT001",
        ordenTrabajo: "MT001",
        interactivo: "Puente de Colores",
        sala: "Integra",
        tipoMantenimiento: "Preventivo",
        tecnico: "Juan Pérez",
        departamento: "Sistema",
        fechaInicio: "2024-01-10",
        fechaFinalizacion: "2024-01-10",
        horaInicio: "09:00",
        horaFinalizacion: "11:30",
        tiempoTotal: "2.5",
        estado: "Completado",
        prioridad: "Media",
        descripcionTrabajo:
          "Limpieza general de sensores, calibración de luces LED y verificación de conexiones eléctricas.",
        problemasEncontrados: "Sensor de movimiento con sensibilidad reducida",
        solucionAplicada: "Limpieza profunda del sensor y ajuste de calibración",
        materialesUsados: "Alcohol isopropílico, paños de microfibra, herramientas de calibración",
        observaciones: "Interactivo funcionando correctamente. Se recomienda limpieza cada 3 meses.",
        calificacion: 5,
        proximoMantenimiento: "2024-04-10",
      },
      {
        id: "RPT002",
        ordenTrabajo: "MT002",
        interactivo: "Generador de Van de Graaff",
        sala: "Experimenta",
        tipoMantenimiento: "Correctivo",
        tecnico: "María García",
        departamento: "Sistema",
        fechaInicio: "2024-01-08",
        fechaFinalizacion: "2024-01-09",
        horaInicio: "08:00",
        horaFinalizacion: "16:00",
        tiempoTotal: "8.0",
        estado: "Completado",
        prioridad: "Urgente",
        descripcionTrabajo: "Reparación de falla eléctrica en el sistema de generación de carga estática.",
        problemasEncontrados: "Cortocircuito en el sistema de alimentación principal",
        solucionAplicada: "Reemplazo de componentes dañados y rewiring del sistema eléctrico",
        materialesUsados: "Cables eléctricos, fusibles, conectores, soldadura",
        observaciones: "Falla causada por sobrecarga. Se instaló protección adicional.",
        calificacion: 4,
        proximoMantenimiento: "2024-03-08",
      },
      {
        id: "RPT003",
        ordenTrabajo: "MT003",
        interactivo: "Ciclo del Agua",
        sala: "Explica",
        tipoMantenimiento: "Preventivo",
        tecnico: "Carlos López",
        departamento: "Mantenimiento",
        fechaInicio: "2024-01-05",
        fechaFinalizacion: "2024-01-05",
        horaInicio: "14:00",
        horaFinalizacion: "17:00",
        tiempoTotal: "3.0",
        estado: "Completado",
        prioridad: "Alta",
        descripcionTrabajo: "Mantenimiento preventivo del sistema de bombeo y filtración de agua.",
        problemasEncontrados: "Filtros con acumulación de sedimentos",
        solucionAplicada: "Reemplazo de filtros y limpieza del sistema de tuberías",
        materialesUsados: "Filtros nuevos, productos de limpieza, sellos de goma",
        observaciones: "Sistema funcionando óptimamente. Filtros cambiados según cronograma.",
        calificacion: 5,
        proximoMantenimiento: "2024-04-05",
      },
      {
        id: "RPT004",
        ordenTrabajo: "MT004",
        interactivo: "Panel Solar",
        sala: "Educa",
        tipoMantenimiento: "Preventivo",
        tecnico: "Ana Martínez",
        departamento: "Sistema",
        fechaInicio: "2024-01-03",
        fechaFinalizacion: "2024-01-03",
        horaInicio: "10:00",
        horaFinalizacion: "12:00",
        tiempoTotal: "2.0",
        estado: "Completado",
        prioridad: "Baja",
        descripcionTrabajo: "Limpieza de paneles solares y verificación de conexiones del sistema.",
        problemasEncontrados: "Acumulación de polvo en paneles",
        solucionAplicada: "Limpieza profunda de paneles y verificación de eficiencia",
        materialesUsados: "Agua destilada, paños especiales, medidor de eficiencia",
        observaciones: "Eficiencia restaurada al 98%. Excelente estado general.",
        calificacion: 5,
        proximoMantenimiento: "2024-04-03",
      },
      {
        id: "RPT005",
        ordenTrabajo: "MT005",
        interactivo: "Simulador de Gravedad",
        sala: "Zona Espacial",
        tipoMantenimiento: "Correctivo",
        tecnico: "Roberto Silva",
        departamento: "Mantenimiento",
        fechaInicio: "2023-12-28",
        fechaFinalizacion: "2023-12-29",
        horaInicio: "13:00",
        horaFinalizacion: "11:00",
        tiempoTotal: "6.0",
        estado: "Completado",
        prioridad: "Media",
        descripcionTrabajo: "Reparación de sistema de control de movimiento y recalibración de sensores.",
        problemasEncontrados: "Desalineación en sistema de movimiento",
        solucionAplicada: "Realineación mecánica y recalibración completa del sistema",
        materialesUsados: "Lubricantes especiales, herramientas de precisión, sensores de repuesto",
        observaciones: "Sistema funcionando perfectamente. Se mejoró la precisión del movimiento.",
        calificacion: 4,
        proximoMantenimiento: "2024-03-28",
      },
    ]

    // Estadísticas generales
    const estadisticasData = {
      totalReportes: reportesData.length,
      mantenimientosPreventivos: reportesData.filter((r) => r.tipoMantenimiento === "Preventivo").length,
      mantenimientosCorrectivos: reportesData.filter((r) => r.tipoMantenimiento === "Correctivo").length,
      tiempoPromedioReparacion:
        reportesData.reduce((acc, r) => acc + Number.parseFloat(r.tiempoTotal), 0) / reportesData.length,
      eficienciaPromedio: reportesData.reduce((acc, r) => acc + r.calificacion, 0) / reportesData.length,
      interactivosMantenidos: new Set(reportesData.map((r) => r.interactivo)).size,
      satisfaccionCliente: 92,
      cumplimientoTiempos: 88,
    }

    // Listas para filtros
    const salasUnicas = [...new Set(reportesData.map((r) => r.sala))]
    const tecnicosUnicos = [...new Set(reportesData.map((r) => r.tecnico))]

    setReportesFinalizados(reportesData)
    setEstadisticas(estadisticasData)
    setSalas(salasUnicas)
    setTecnicos(tecnicosUnicos)


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
      sala: "",
      tipoMantenimiento: "",
      tecnico: "",
      busqueda: "",
    })
  }

  const reportesFiltrados = reportesFinalizados.filter((reporte) => {
    const cumpleFechaInicio = !filtros.fechaInicio || reporte.fechaFinalizacion >= filtros.fechaInicio
    const cumpleFechaFin = !filtros.fechaFin || reporte.fechaFinalizacion <= filtros.fechaFin
    const cumpleSala = !filtros.sala || reporte.sala === filtros.sala
    const cumpleTipo = !filtros.tipoMantenimiento || reporte.tipoMantenimiento === filtros.tipoMantenimiento
    const cumpleTecnico = !filtros.tecnico || reporte.tecnico === filtros.tecnico
    const cumpleBusqueda =
      !filtros.busqueda ||
      reporte.interactivo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      reporte.id.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      reporte.ordenTrabajo.toLowerCase().includes(filtros.busqueda.toLowerCase())

    return cumpleFechaInicio && cumpleFechaFin && cumpleSala && cumpleTipo && cumpleTecnico && cumpleBusqueda
  })

  const verDetalle = (reporte) => {
    setReporteSeleccionado(reporte)
    setShowDetalleModal(true)
  }


  const getTipoBadge = (tipo) => {
    return tipo === "Correctivo" ? (
      <Badge bg="danger" className="px-3 py-2">
        <i className="bi bi-tools me-1"></i>
        Correctivo
      </Badge>
    ) : (
      <Badge bg="success" className="px-3 py-2">
        <i className="bi bi-calendar-check me-1"></i>
        Preventivo
      </Badge>
    )
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

  const getCalificacionStars = (calificacion) => {
    return (
      <div className="d-flex align-items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <i
            key={i}
            className={`bi bi-star${i < calificacion ? "-fill" : ""} me-1`}
            style={{ color: i < calificacion ? "#ffc107" : "#dee2e6", fontSize: "1.1rem" }}
          ></i>
        ))}
        <span className="ms-2 text-muted">({calificacion}/5)</span>
      </div>
    )
  }

  const getEstadoBadge = (estado) => {
    return (
      <Badge bg="success" className="px-3 py-2">
        <i className="bi bi-check-circle me-1"></i>
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
                      <i className="bi bi-clipboard-data me-3"></i>
                      Reportes de Mantenimiento
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      Historial completo de mantenimientos finalizados y estadísticas de rendimiento
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
                    <i className="bi bi-clock text-success fs-4"></i>
                  </div>
                  <h3 className="text-success fw-bold mb-1">{estadisticas.tiempoPromedioReparacion?.toFixed(1)}h</h3>
                  <p className="text-muted mb-0 fw-medium">Tiempo Promedio</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-star text-warning fs-4"></i>
                  </div>
                  <h3 className="text-warning fw-bold mb-1">{estadisticas.eficienciaPromedio?.toFixed(1)}/5</h3>
                  <p className="text-muted mb-0 fw-medium">Calificación Promedio</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-gear text-info fs-4"></i>
                  </div>
                  <h3 className="text-info fw-bold mb-1">{estadisticas.interactivosMantenidos}</h3>
                  <p className="text-muted mb-0 fw-medium">Interactivos Mantenidos</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>


          {/* Filtros */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0 py-3">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-funnel me-2 text-primary"></i>
                Filtros de Búsqueda
              </h5>
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
                      <i className="bi bi-building me-1"></i>
                      Sala
                    </Form.Label>
                    <Form.Select
                      name="sala"
                      value={filtros.sala}
                      onChange={handleFiltroChange}
                      className="form-control-custom"
                    >
                      <option value="">Todas las salas</option>
                      {salas.map((sala) => (
                        <option key={sala} value={sala}>
                          {sala}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={3} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-dark">
                      <i className="bi bi-tools me-1"></i>
                      Tipo
                    </Form.Label>
                    <Form.Select
                      name="tipoMantenimiento"
                      value={filtros.tipoMantenimiento}
                      onChange={handleFiltroChange}
                      className="form-control-custom"
                    >
                      <option value="">Todos los tipos</option>
                      <option value="Preventivo">Preventivo</option>
                      <option value="Correctivo">Correctivo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-dark">
                      <i className="bi bi-person-gear me-1"></i>
                      Técnico
                    </Form.Label>
                    <Form.Select
                      name="tecnico"
                      value={filtros.tecnico}
                      onChange={handleFiltroChange}
                      className="form-control-custom"
                    >
                      <option value="">Todos los técnicos</option>
                      {tecnicos.map((tecnico) => (
                        <option key={tecnico} value={tecnico}>
                          {tecnico}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={6} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-dark">
                      <i className="bi bi-search me-1"></i>
                      Búsqueda General
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="busqueda"
                        value={filtros.busqueda}
                        onChange={handleFiltroChange}
                        placeholder="Buscar por ID, orden de trabajo o interactivo..."
                        className="form-control-custom"
                      />
                      <Button variant="outline-primary" className="search-btn">
                        <i className="bi bi-search"></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col lg={2} md={12}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-dark">&nbsp;</Form.Label>
                    <Button variant="outline-secondary" className="w-100 clear-btn" onClick={limpiarFiltros}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Limpiar
                    </Button>
                  </Form.Group>
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
                  Reportes Finalizados
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
                      <th>ID Reporte</th>
                      <th>Orden</th>
                      <th>Interactivo</th>
                      <th>Sala</th>
                      <th>Tipo</th>
                      <th>Técnico</th>
                      <th>Departamento</th>
                      <th>Fecha</th>
                      <th>Tiempo</th>
                      <th>Estado</th>
                      <th>Calificación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportesFiltrados.map((reporte) => (
                      <tr key={reporte.id}>
                        <td>
                          <strong className="text-primary">{reporte.id}</strong>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{reporte.ordenTrabajo}</span>
                        </td>
                        <td>
                          <div className="fw-medium">{reporte.interactivo}</div>
                        </td>
                        <td>
                          <span className="text-muted fw-medium">{reporte.sala}</span>
                        </td>
                        <td>{getTipoBadge(reporte.tipoMantenimiento)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle me-2 text-muted"></i>
                            {reporte.tecnico}
                          </div>
                        </td>
                        <td>{getDepartamentoBadge(reporte.departamento)}</td>
                        <td>
                          <div className="fw-medium">{reporte.fechaFinalizacion}</div>
                        </td>
                        <td>
                          <span className="badge bg-info text-white px-3 py-2">
                            <i className="bi bi-clock me-1"></i>
                            {reporte.tiempoTotal}h
                          </span>
                        </td>
                        <td>{getEstadoBadge(reporte.estado)}</td>
                        <td>{getCalificacionStars(reporte.calificacion)}</td>
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
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="xl" className="detail-modal">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fw-bold">
            <i className="bi bi-file-text me-2"></i>
            Detalle del Reporte - {reporteSeleccionado?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {reporteSeleccionado && (
            <div>
              {/* Información General */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Información General
                      </h6>
                      <div className="mb-2">
                        <strong>Orden de Trabajo:</strong>
                        <span className="badge bg-primary ms-2">{reporteSeleccionado.ordenTrabajo}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Interactivo:</strong> {reporteSeleccionado.interactivo}
                      </div>
                      <div className="mb-2">
                        <strong>Sala:</strong> {reporteSeleccionado.sala}
                      </div>
                      <div className="mb-2">
                        <strong>Tipo:</strong> {getTipoBadge(reporteSeleccionado.tipoMantenimiento)}
                      </div>
                      <div className="mb-2">
                        <strong>Prioridad:</strong> {getPrioridadBadge(reporteSeleccionado.prioridad)}
                      </div>
                      <div className="mb-2">
                        <strong>Departamento:</strong> {getDepartamentoBadge(reporteSeleccionado.departamento)}
                      </div>
                      <div>
                        <strong>Estado:</strong> {getEstadoBadge(reporteSeleccionado.estado)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-clock me-2"></i>
                        Tiempos y Personal
                      </h6>
                      <div className="mb-2">
                        <strong>Fecha Inicio:</strong> {reporteSeleccionado.fechaInicio} -{" "}
                        {reporteSeleccionado.horaInicio}
                      </div>
                      <div className="mb-2">
                        <strong>Fecha Fin:</strong> {reporteSeleccionado.fechaFinalizacion} -{" "}
                        {reporteSeleccionado.horaFinalizacion}
                      </div>
                      <div className="mb-2">
                        <strong>Tiempo Total:</strong>
                        <span className="badge bg-info ms-2">{reporteSeleccionado.tiempoTotal} horas</span>
                      </div>
                      <div className="mb-2">
                        <strong>Técnico:</strong>
                        <span className="ms-2">
                          <i className="bi bi-person-circle me-1"></i>
                          {reporteSeleccionado.tecnico}
                        </span>
                      </div>
                      <div>
                        <strong>Próximo Mantenimiento:</strong>
                        <span className="badge bg-warning text-dark ms-2">
                          {reporteSeleccionado.proximoMantenimiento}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Detalles del Trabajo */}
              <Row className="mb-4">
                <Col>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-tools me-2"></i>
                        Detalles del Trabajo Realizado
                      </h6>

                      <div className="mb-3">
                        <h6 className="fw-bold text-dark">Descripción del Trabajo</h6>
                        <p className="text-muted">{reporteSeleccionado.descripcionTrabajo}</p>
                      </div>

                      <div className="mb-3">
                        <h6 className="fw-bold text-dark">Problemas Encontrados</h6>
                        <p className="text-muted">{reporteSeleccionado.problemasEncontrados}</p>
                      </div>

                      <div className="mb-3">
                        <h6 className="fw-bold text-dark">Solución Aplicada</h6>
                        <p className="text-muted">{reporteSeleccionado.solucionAplicada}</p>
                      </div>

                      <div className="mb-3">
                        <h6 className="fw-bold text-dark">Materiales Utilizados</h6>
                        <p className="text-muted">{reporteSeleccionado.materialesUsados}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Observaciones y Calificación */}
              <Row>
                <Col md={8}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-chat-text me-2"></i>
                        Observaciones
                      </h6>
                      <p className="text-muted mb-0">{reporteSeleccionado.observaciones}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-star me-2"></i>
                        Calificación del Trabajo
                      </h6>
                      <div className="mb-3">{getCalificacionStars(reporteSeleccionado.calificacion)}</div>
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
            Imprimir Reporte
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ReportesA
