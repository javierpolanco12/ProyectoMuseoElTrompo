"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Modal } from "react-bootstrap"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "../CSS/CalendarioAdmin.css"
import "../CSS/styles.css"
import "../CSS/ProgramarMantenimiento.css"

// Configurar moment en español
moment.locale("es")
const localizer = momentLocalizer(moment)

const CalendarioAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null)
  const [tareas, setTareas] = useState([])
  const [estadisticas, setEstadisticas] = useState({
    totalTareas: 0,
    pendientes: 0,
    enProceso: 0,
    finalizadas: 0,
  })
  const [eventosCalendario, setEventosCalendario] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState(Views.MONTH)

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Función para obtener las tareas de mantenimiento desde la API
  const fetchTareasMantenimiento = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://127.0.0.1:8000/api/tareas-mantenimiento/")

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Datos recibidos de la API:", data)
      setTareas(data)

      // Convertir tareas a eventos de calendario
      const eventos = data.map((tarea) => {
        const fechaInicio = moment(tarea.fecha_programada).toDate()
        const fechaFin = moment(tarea.fecha_programada).add(2, "hours").toDate()

        return {
          id: tarea.id,
          title: tarea.titulo,
          start: fechaInicio,
          end: fechaFin,
          resource: tarea,
          estado: tarea.estado,
        }
      })

      setEventosCalendario(eventos)

      // Calcular estadísticas basadas en los estados de la API
      const stats = {
        totalTareas: data.length,
        pendientes: data.filter((t) => t.estado === 1).length, // Estado 1 = Pendiente
        enProceso: data.filter((t) => t.estado === 2).length, // Estado 2 = En Proceso
        finalizadas: data.filter((t) => t.estado === 3).length, // Estado 3 = Finalizada
      }

      setEstadisticas(stats)
      showNotification("Tareas de mantenimiento cargadas correctamente", "success")
    } catch (error) {
      console.error("Error al cargar las tareas de mantenimiento:", error)
      showNotification("Error al cargar las tareas de mantenimiento", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTareasMantenimiento()
  }, [])

  const verDetalle = (tarea) => {
    setTareaSeleccionada(tarea)
    setShowDetalleModal(true)
  }

  const handleSelectEvent = (evento) => {
    console.log("Evento seleccionado:", evento)
    verDetalle(evento.resource)
  }

  const handleSelectSlot = (slotInfo) => {
    console.log("Slot seleccionado:", slotInfo)

    // Verificar si hay eventos en este día
    const eventosEnDia = eventosCalendario.filter((evento) => {
      const fechaEvento = moment(evento.start).format("YYYY-MM-DD")
      const fechaSlot = moment(slotInfo.start).format("YYYY-MM-DD")
      return fechaEvento === fechaSlot
    })

    if (eventosEnDia.length > 0) {
      // Si hay eventos, mostrar el primero
      verDetalle(eventosEnDia[0].resource)
    }
  }

  const handleNavigate = (newDate) => {
    console.log("Navegando a:", newDate)
    setCurrentDate(newDate)
  }

  const handleViewChange = (view) => {
    console.log("Cambiando vista a:", view)
    setCurrentView(view)
  }

  // Función para obtener el color según el estado
  const eventStyleGetter = (event) => {
    let backgroundColor = "#6c757d" // Gris por defecto

    switch (event.estado) {
      case 1: // Pendiente
        backgroundColor = "#dc3545" // Rojo
        break
      case 2: // En Proceso
        backgroundColor = "#ffc107" // Amarillo
        break
      case 3: // Finalizada
        backgroundColor = "#28a745" // Verde
        break
      default:
        backgroundColor = "#6c757d" // Gris
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    }
  }

  const getEstadoBadge = (estado) => {
    const estadoConfig = {
      1: { bg: "danger", icon: "clock", text: "Pendiente" },
      2: { bg: "warning", icon: "gear", text: "En Proceso" },
      3: { bg: "success", icon: "check-circle", text: "Finalizada" },
    }

    const config = estadoConfig[estado] || {
      bg: "secondary",
      icon: "circle",
      text: "Desconocido",
    }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {config.text}
      </Badge>
    )
  }

  const getTipoText = (tipoId) => {
    // Mapeo básico de tipos - puedes ajustar según tu API
    const tipos = {
      1: "Preventivo",
      2: "Correctivo",
      3: "Predictivo",
    }
    return tipos[tipoId] || `Tipo ${tipoId}`
  }

  const getAreaText = (areaId) => {
    // Mapeo básico de áreas - puedes ajustar según tu API
    const areas = {
      1: "Integra",
      2: "Experimenta",
      3: "Explica",
      4: "Educa",
    }
    return areas[areaId] || `Área ${areaId}`
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
              <p className="mt-3">Cargando tareas de mantenimiento...</p>
            </div>
          </Container>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Header />
      <Menu />

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

      <div
        className="main-content"
        style={{
          marginLeft: isMenuOpen ? "200px" : "0",
        }}
      >
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <div className="header-gradient p-4 rounded-3 text-white shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h1 className="h2 mb-2 fw-bold text-white">
                      <i className="bi bi-calendar3 me-3"></i>
                      Calendario de Mantenimiento
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      Gestión completa de mantenimientos con vista de calendario
                    </p>
                  </div>
                  <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                </div>
              </div>
            </Col>
          </Row>

          {/* Estadísticas */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6} sm={6}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="text-center p-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 status-icon-container">
                    <i className="bi bi-file-text text-primary fs-4"></i>
                  </div>
                  <h4 className="text-primary fw-bold mb-1">{estadisticas.totalTareas}</h4>
                  <p className="text-muted mb-0 fw-medium small">Total</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} sm={6}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="text-center p-3">
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 status-icon-container">
                    <i className="bi bi-clock text-danger fs-4"></i>
                  </div>
                  <h4 className="text-danger fw-bold mb-1">{estadisticas.pendientes}</h4>
                  <p className="text-muted mb-0 fw-medium small">Pendientes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} sm={6}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="text-center p-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 status-icon-container">
                    <i className="bi bi-gear text-warning fs-4"></i>
                  </div>
                  <h4 className="text-warning fw-bold mb-1">{estadisticas.enProceso}</h4>
                  <p className="text-muted mb-0 fw-medium small">En Proceso</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} sm={6}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="text-center p-3">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 status-icon-container">
                    <i className="bi bi-check-circle text-success fs-4"></i>
                  </div>
                  <h4 className="text-success fw-bold mb-1">{estadisticas.finalizadas}</h4>
                  <p className="text-muted mb-0 fw-medium small">Finalizadas</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Leyenda de Estados */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="py-3" style={{ background: "#f9fafb" }}>
                  <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">
                    <div className="d-flex align-items-center">
                      <div
                        className="status-indicator"
                        style={{
                          backgroundColor: "#dc3545",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span className="fw-medium">Pendiente</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div
                        className="status-indicator"
                        style={{
                          backgroundColor: "#ffc107",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span className="fw-medium">En Proceso</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div
                        className="status-indicator"
                        style={{
                          backgroundColor: "#28a745",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span className="fw-medium">Finalizada</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Vista de Calendario */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">
                  <i className="bi bi-calendar3 me-2 text-primary"></i>
                  Vista de Calendario
                </h5>
                <Button variant="outline-primary" onClick={fetchTareasMantenimiento}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Actualizar
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-4" style={{ background: "#f9fafb" }}>
              <div style={{ height: "650px" }}>
                <Calendar
                  localizer={localizer}
                  events={eventosCalendario}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  eventPropGetter={eventStyleGetter}
                  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                  defaultView={Views.MONTH}
                  view={currentView}
                  date={currentDate}
                  onNavigate={handleNavigate}
                  onView={handleViewChange}
                  messages={{
                    next: "Siguiente",
                    previous: "Anterior",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay mantenimientos en este rango",
                    showMore: (total) => `+ Ver más (${total})`,
                  }}
                  popup
                  selectable
                  className="calendar-container"
                />
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Modal de Detalle */}
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">
            <i className="bi bi-file-text me-2 text-primary"></i>
            Detalle del Mantenimiento - #{tareaSeleccionada?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {tareaSeleccionada && (
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
                        <strong>ID:</strong>
                        <span className="badge bg-primary ms-2">#{tareaSeleccionada.id}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Título:</strong> {tareaSeleccionada.titulo}
                      </div>
                      <div className="mb-2">
                        <strong>Interactivo:</strong>
                        <span className="badge bg-info ms-2">ID: {tareaSeleccionada.interactivo}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Área:</strong>
                        <span className="badge bg-secondary ms-2">{getAreaText(tareaSeleccionada.area)}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Tipo:</strong>
                        <span className="badge bg-dark ms-2">{getTipoText(tareaSeleccionada.tipo)}</span>
                      </div>
                      <div>
                        <strong>Estado:</strong> {getEstadoBadge(tareaSeleccionada.estado)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-clock me-2"></i>
                        Fechas y Referencias
                      </h6>
                      <div className="mb-2">
                        <strong>Fecha Programada:</strong>
                        <div className="mt-1">
                          <span className="badge bg-info">
                            {moment(tareaSeleccionada.fecha_programada).format("DD/MM/YYYY")}
                          </span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong>Fecha Realizada:</strong>
                        <div className="mt-1">
                          {tareaSeleccionada.fecha_realizada ? (
                            <span className="badge bg-success">
                              {moment(tareaSeleccionada.fecha_realizada).format("DD/MM/YYYY")}
                            </span>
                          ) : (
                            <span className="badge bg-secondary">No realizada</span>
                          )}
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong>Reporte ID:</strong>
                        <span className="badge bg-warning text-dark ms-2">{tareaSeleccionada.reporte}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Descripción */}
              <Row>
                <Col>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-file-text me-2"></i>
                        Descripción del Mantenimiento
                      </h6>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-muted mb-0">{tareaSeleccionada.descripcion}</p>
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

        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CalendarioAdmin
