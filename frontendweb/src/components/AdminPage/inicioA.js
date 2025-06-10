"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Button, Badge, Alert, ProgressBar, Table } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "../CSS/InicioA.css"

const InicioA = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [datosMantenimiento, setDatosMantenimiento] = useState({})
  const [alertasUrgentes, setAlertasUrgentes] = useState([])
  const [mantenimientosPendientes, setMantenimientosPendientes] = useState([])
  const [interactivosEstado, setInteractivosEstado] = useState([])
  const [equipoTecnicos, setEquipoTecnicos] = useState({})

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
    // Datos del sistema de mantenimiento (sin costos)
    const datosMantenimiento = {
      totalInteractivos: 6,
      operativos: 4,
      enMantenimiento: 1,
      fueraDeServicio: 1,
      mantenimientosPendientes: 3,
      mantenimientosHoy: 2,
      mantenimientosVencidos: 1,
      eficienciaEquipo: 87,
      tiempoPromedioReparacion: 2.5, // horas
      disponibilidadGeneral: 83, // porcentaje
      mantenimientosCompletadosMes: 12,
      mantenimientosPreventivos: 8,
      mantenimientosCorrectivos: 4,
    }

    setDatosMantenimiento(datosMantenimiento)

    
    // Alertas urgentes del sistema
    setAlertasUrgentes([
      {
        id: 1,
        tipo: "danger",
        interactivo: "Generador de Van de Graaff",
        sala: "Experimenta",
        problema: "Falla eléctrica - Fuera de servicio",
        prioridad: "URGENTE",
        tiempo: "Hace 3 horas",
        departamento: "Sistema",
        tecnicoAsignado: "María García",
      },
      {
        id: 2,
        tipo: "warning",
        interactivo: "Ciclo del Agua",
        sala: "Explica",
        problema: "Mantenimiento preventivo vencido",
        prioridad: "ALTA",
        tiempo: "Hace 1 día",
        departamento: "Mantenimiento",
        tecnicoAsignado: "Pendiente",
      },
      {
        id: 3,
        tipo: "info",
        interactivo: "Panel Solar",
        sala: "Educa",
        problema: "Calibración programada",
        prioridad: "MEDIA",
        tiempo: "Mañana",
        departamento: "Sistema",
        tecnicoAsignado: "Juan Pérez",
      },
    ])

    // Mantenimientos pendientes con departamentos
    setMantenimientosPendientes([
      {
        id: "MT001",
        interactivo: "Puente de Colores",
        sala: "Integra",
        tipo: "Preventivo",
        fechaProgramada: "2024-01-15",
        departamento: "Sistema",
        tecnicoAsignado: "Juan Pérez",
        estado: "Programado",
        prioridad: "Media",
      },
      {
        id: "MT002",
        interactivo: "Generador de Van de Graaff",
        sala: "Experimenta",
        tipo: "Correctivo",
        fechaProgramada: "2024-01-12",
        departamento: "Sistema",
        tecnicoAsignado: "María García",
        estado: "En Progreso",
        prioridad: "Urgente",
      },
      {
        id: "MT003",
        interactivo: "Simulador de Gravedad",
        sala: "Zona Espacial",
        tipo: "Preventivo",
        fechaProgramada: "2024-01-16",
        departamento: "Mantenimiento",
        tecnicoAsignado: "Carlos López",
        estado: "En Progreso",
        prioridad: "Baja",
      },
    ])

    // Estado de interactivos por sala
    setInteractivosEstado([
      {
        sala: "Integra",
        interactivos: [
          {
            nombre: "Puente de Colores",
            estado: "Operativo",
            ultimoMantenimiento: "2023-12-15",
            proximoMantenimiento: "2024-01-15",
            departamento: "Sistema",
          },
          {
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
            nombre: "Simulador de Gravedad",
            estado: "Operativo",
            ultimoMantenimiento: "2023-12-10",
            proximoMantenimiento: "2024-01-16",
            departamento: "Mantenimiento",
          },
        ],
      },
    ])

    const userRole = "Administrador de Mantenimiento"
    showNotification(`Bienvenido, ${userRole}!`, "success")
  }, [])

  const getEstadoBadge = (estado) => {
    const badgeConfig = {
      Operativo: { bg: "success", icon: "check-circle" },
      "En Mantenimiento": { bg: "warning", icon: "tools" },
      "Fuera de Servicio": { bg: "danger", icon: "x-circle" },
      "Mantenimiento Vencido": { bg: "danger", icon: "exclamation-triangle" },
    }

    const config = badgeConfig[estado] || { bg: "secondary", icon: "circle" }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {estado}
      </Badge>
    )
  }

  const getPrioridadBadge = (prioridad) => {
    const badgeConfig = {
      URGENTE: { bg: "danger", icon: "exclamation-triangle-fill" },
      Urgente: { bg: "danger", icon: "exclamation-triangle-fill" },
      ALTA: { bg: "warning", icon: "exclamation-triangle" },
      Alta: { bg: "warning", icon: "exclamation-triangle" },
      MEDIA: { bg: "info", icon: "info-circle" },
      Media: { bg: "info", icon: "info-circle" },
      BAJA: { bg: "secondary", icon: "circle" },
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

  const getTecnicoEstadoBadge = (estado) => {
    return estado === "Disponible" ? (
      <Badge bg="success" className="px-2 py-1">
        <i className="bi bi-check-circle me-1"></i>
        Disponible
      </Badge>
    ) : (
      <Badge bg="warning" className="px-2 py-1">
        <i className="bi bi-clock me-1"></i>
        En Trabajo
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
          {/* Header del Dashboard mejorado */}
          <Row className="mb-4">
            <Col>
              <div className="header-gradient p-4 rounded-3 text-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h1 className="h2 mb-2 fw-bold text-white">
                      <i className="bi bi-speedometer2 me-3"></i>
                      Dashboard de Mantenimiento
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      Gestión integral de mantenimientos preventivos y correctivos
                    </p>
                  </div>
                  <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                </div>
              </div>
            </Col>
          </Row>

          {/* Métricas Principales mejoradas */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  </div>
                  <h3 className="text-success fw-bold mb-1">{datosMantenimiento.operativos}</h3>
                  <p className="text-muted mb-0 fw-medium">Interactivos Operativos</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-tools text-warning fs-4"></i>
                  </div>
                  <h3 className="text-warning fw-bold mb-1">{datosMantenimiento.enMantenimiento}</h3>
                  <p className="text-muted mb-0 fw-medium">En Mantenimiento</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
                  </div>
                  <h3 className="text-danger fw-bold mb-1">{datosMantenimiento.fueraDeServicio}</h3>
                  <p className="text-muted mb-0 fw-medium">Fuera de Servicio</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm card-animate">
                <Card.Body className="text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 metric-icon-container">
                    <i className="bi bi-calendar-check text-info fs-4"></i>
                  </div>
                  <h3 className="text-info fw-bold mb-1">{datosMantenimiento.mantenimientosPendientes}</h3>
                  <p className="text-muted mb-0 fw-medium">Mantenimientos Pendientes</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Alertas Urgentes mejoradas */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-danger text-white py-3">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Alertas Urgentes de Mantenimiento
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  {alertasUrgentes.map((alerta) => (
                    <Alert
                      key={alerta.id}
                      variant={alerta.tipo === "danger" ? "danger" : alerta.tipo === "warning" ? "warning" : "info"}
                      className="mb-3 alert-custom"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <strong className="me-2">{alerta.interactivo}</strong>
                            <span className="badge bg-light text-dark me-2">{alerta.sala}</span>
                            {getDepartamentoBadge(alerta.departamento)}
                          </div>
                          <p className="mb-2">{alerta.problema}</p>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-person-gear me-1"></i>
                            <small className="text-muted">Técnico: {alerta.tecnicoAsignado}</small>
                          </div>
                        </div>
                        <div className="text-end ms-3">
                          {getPrioridadBadge(alerta.prioridad)}
                          <br />
                          <small className="text-muted">{alerta.tiempo}</small>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Métricas de Rendimiento y Mantenimientos Programados */}
          <Row className="mb-4">
            <Col lg={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-graph-up me-2 text-primary"></i>
                    Métricas de Rendimiento
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-medium">Disponibilidad General</span>
                      <span className="fw-bold text-success">{datosMantenimiento.disponibilidadGeneral}%</span>
                    </div>
                    <ProgressBar
                      variant={datosMantenimiento.disponibilidadGeneral > 80 ? "success" : "warning"}
                      now={datosMantenimiento.disponibilidadGeneral}
                      className="progress-thick"
                    />
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-medium">Eficiencia del Equipo</span>
                      <span className="fw-bold text-info">{datosMantenimiento.eficienciaEquipo}%</span>
                    </div>
                    <ProgressBar variant="info" now={datosMantenimiento.eficienciaEquipo} className="progress-thick" />
                  </div>
                  <Row className="text-center g-3">
                    <Col>
                      <Card className="border-0 bg-light">
                        <Card.Body className="py-3">
                          <h5 className="text-primary fw-bold mb-1">{datosMantenimiento.tiempoPromedioReparacion}h</h5>
                          <small className="text-muted">Tiempo Promedio</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card className="border-0 bg-light">
                        <Card.Body className="py-3">
                          <h5 className="text-success fw-bold mb-1">
                            {datosMantenimiento.mantenimientosCompletadosMes}
                          </h5>
                          <small className="text-muted">Completados/Mes</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-calendar-event me-2 text-primary"></i>
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
                          <th>Departamento</th>
                          <th>Técnico</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mantenimientosPendientes.map((mant) => (
                          <tr key={mant.id}>
                            <td>
                              <strong className="text-primary">{mant.id}</strong>
                            </td>
                            <td>
                              <div>
                                <div className="fw-medium">{mant.interactivo}</div>
                                <small className="text-muted">{mant.sala}</small>
                              </div>
                            </td>
                            <td>{getDepartamentoBadge(mant.departamento)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-person-circle me-2 text-muted"></i>
                                <small>{mant.tecnicoAsignado}</small>
                              </div>
                            </td>
                            <td>{getPrioridadBadge(mant.prioridad)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Estado de Interactivos por Sala mejorado */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-building me-2 text-primary"></i>
                    Estado de Interactivos por Sala
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  {interactivosEstado.map((sala, index) => (
                    <div key={index} className="spacing-lg">
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-geo-alt me-2"></i>
                        {sala.sala}
                      </h6>
                      <Row className="g-3">
                        {sala.interactivos.map((interactivo, idx) => (
                          <Col lg={4} md={6} key={idx}>
                            <Card className="interactive-card">
                              <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <strong className="text-dark">{interactivo.nombre}</strong>
                                  {getEstadoBadge(interactivo.estado)}
                                </div>
                                <div className="mb-2">{getDepartamentoBadge(interactivo.departamento)}</div>
                                <div className="text-muted small">
                                  <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-clock-history me-1"></i>
                                    Último: {interactivo.ultimoMantenimiento}
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-calendar-plus me-1"></i>
                                    Próximo: {interactivo.proximoMantenimiento}
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Acciones Rápidas mejoradas */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-lightning me-2 text-primary"></i>
                    Acciones Rápidas
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-3">
                    <Col lg={3} md={6}>
                      <Button variant="danger" className="quick-action-btn">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Reportar Falla
                      </Button>
                    </Col>
                    <Col lg={3} md={6}>
                      <Button variant="warning" className="quick-action-btn">
                        <i className="bi bi-calendar-plus me-2"></i>
                        Programar Mantenimiento
                      </Button>
                    </Col>
                    <Col lg={3} md={6}>
                      <Button variant="success" className="quick-action-btn">
                        <i className="bi bi-check-circle me-2"></i>
                        Completar Trabajo
                      </Button>
                    </Col>
                    <Col lg={3} md={6}>
                      <Button variant="info" className="quick-action-btn">
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Generar Reporte
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default InicioA
