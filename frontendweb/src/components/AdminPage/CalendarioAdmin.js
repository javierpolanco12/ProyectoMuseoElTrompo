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

// Configurar moment en español
moment.locale("es")
const localizer = momentLocalizer(moment)

const CalendarioAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [showNuevoEventoModal, setShowNuevoEventoModal] = useState(false)
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)
  const [reportes, setReportes] = useState([])
  const [estadisticas, setEstadisticas] = useState({})
  const [eventosCalendario, setEventosCalendario] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)
  const [nuevoEvento, setNuevoEvento] = useState({

    id: "",
    ordenTrabajo: "",
    interactivo: "",
    sala: "",
    tipoMantenimiento: "Preventivo",
    tecnico: "",
    fechaInicio: "",
    fechaFinalizacion: "",
    horaInicio: "09:00",
    horaFinalizacion: "11:00",
    tiempoTotal: "2.0",
    estado: "Pendiente",
    prioridad: "Media",
    descripcionTrabajo: "",
    problemasEncontrados: "",
    solucionAplicada: "",
    materialesUsados: "",
    observaciones: "",
    calificacion: 0,
    proximoMantenimiento: "",
  })

 // Estados para controlar la navegación del calendario

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
  useEffect(() => {

    // Datos de reportes de mantenimientos con diferentes estados

    const reportesData = [
      {
        id: "RPT001",
        ordenTrabajo: "MT001",
        interactivo: "Puente de Colores",
        sala: "Integra",
        tipoMantenimiento: "Preventivo",
        tecnico: "Juan Pérez",
        fechaInicio: "2025-01-10",
        fechaFinalizacion: "2025-01-10",
        horaInicio: "09:00",
        horaFinalizacion: "11:30",
        tiempoTotal: "2.5",
        estado: "Finalizado",
        prioridad: "Media",
        descripcionTrabajo:
        "Limpieza general de sensores, calibración de luces LED y verificación de conexiones eléctricas.",
        problemasEncontrados: "Sensor de movimiento con sensibilidad reducida",
        solucionAplicada: "Limpieza profunda del sensor y ajuste de calibración",
        materialesUsados: "Alcohol isopropílico, paños de microfibra, herramientas de calibración",
        observaciones: "Interactivo funcionando correctamente. Se recomienda limpieza cada 3 meses.",
        calificacion: 5,
        proximoMantenimiento: "2025-04-10",
      },

      {
        id: "RPT002",
        ordenTrabajo: "MT002",
        interactivo: "Generador de Van de Graaff",
        sala: "Experimenta",
        tipoMantenimiento: "Correctivo",
        tecnico: "María García",
        fechaInicio: "2025-01-15",
        fechaFinalizacion: "2025-01-16",
        horaInicio: "08:00",
        horaFinalizacion: "16:00",
        tiempoTotal: "8.0",
        estado: "En Proceso",
        prioridad: "Urgente",
        descripcionTrabajo: "Reparación de falla eléctrica en el sistema de generación de carga estática.",
        problemasEncontrados: "Cortocircuito en el sistema de alimentación principal",
        solucionAplicada: "Reemplazo de componentes dañados y rewiring del sistema eléctrico",
        materialesUsados: "Cables eléctricos, fusibles, conectores, soldadura",
        observaciones: "Falla causada por sobrecarga. Se instaló protección adicional.",
        calificacion: 4,
        proximoMantenimiento: "2025-03-15",
      },

      {
        id: "RPT003",
        ordenTrabajo: "MT003",
        interactivo: "Ciclo del Agua",
        sala: "Explica",
        tipoMantenimiento: "Preventivo",
        tecnico: "Carlos López",
        fechaInicio: "2025-01-20",
        fechaFinalizacion: "2025-01-20",
        horaInicio: "14:00",
        horaFinalizacion: "17:00",
        tiempoTotal: "3.0",
        estado: "Pendiente",
        prioridad: "Alta",
        descripcionTrabajo: "Mantenimiento preventivo del sistema de bombeo y filtración de agua.",
        problemasEncontrados: "Filtros con acumulación de sedimentos",
        solucionAplicada: "Reemplazo de filtros y limpieza del sistema de tuberías",
        materialesUsados: "Filtros nuevos, productos de limpieza, sellos de goma",
        observaciones: "Sistema funcionando óptimamente. Filtros cambiados según cronograma.",
        calificacion: 5,
        proximoMantenimiento: "2025-04-20",
      },

      {
        id: "RPT004",
        ordenTrabajo: "MT004",
        interactivo: "Panel Solar",
        sala: "Educa",
        tipoMantenimiento: "Preventivo",
        tecnico: "Ana Martínez",
        fechaInicio: "2025-01-25",
        fechaFinalizacion: "2025-01-25",
        horaInicio: "10:00",
        horaFinalizacion: "12:00",
        tiempoTotal: "2.0",
        estado: "Finalizado",
        prioridad: "Baja",
        descripcionTrabajo: "Limpieza de paneles solares y verificación de conexiones del sistema.",
        problemasEncontrados: "Acumulación de polvo en paneles",
        solucionAplicada: "Limpieza profunda de paneles y verificación de eficiencia",
        materialesUsados: "Agua destilada, paños especiales, medidor de eficiencia",
        observaciones: "Eficiencia restaurada al 98%. Excelente estado general.",
        calificacion: 5,
        proximoMantenimiento: "2025-04-25",
      },
      {
        id: "RPT005",
        ordenTrabajo: "MT005",
        interactivo: "Simulador de Gravedad",
        sala: "Zona Espacial",
        tipoMantenimiento: "Correctivo",
        tecnico: "Roberto Silva",
        fechaInicio: "2025-01-30",
        fechaFinalizacion: "2025-01-31",
        horaInicio: "13:00",
        horaFinalizacion: "11:00",
        tiempoTotal: "6.0",
        estado: "En Proceso",
        prioridad: "Media",
        descripcionTrabajo: "Reparación de sistema de control de movimiento y recalibración de sensores.",
        problemasEncontrados: "Desalineación en sistema de movimiento",
        solucionAplicada: "Realineación mecánica y recalibración completa del sistema",
        materialesUsados: "Lubricantes especiales, herramientas de precisión, sensores de repuesto",
        observaciones: "Sistema funcionando perfectamente. Se mejoró la precisión del movimiento.",
        calificacion: 4,
        proximoMantenimiento: "2025-03-30",
      },
      {
        id: "RPT006",
        ordenTrabajo: "MT006",
        interactivo: "Mesa de Luz",
        sala: "Integra",
        tipoMantenimiento: "Preventivo",
        tecnico: "Juan Pérez",
        fechaInicio: "2025-02-05",
        fechaFinalizacion: "2025-02-05",
        horaInicio: "09:00",
        horaFinalizacion: "11:00",
        tiempoTotal: "2.0",
        estado: "Pendiente",
        prioridad: "Media",
        descripcionTrabajo: "Mantenimiento preventivo de sistema de iluminación LED.",
        problemasEncontrados: "",
        solucionAplicada: "",
        materialesUsados: "",
        observaciones: "Mantenimiento programado pendiente de ejecución.",
        calificacion: 0,
        proximoMantenimiento: "2025-05-05",
      },
      // Eventos para el mes actual 
      {
        id: "RPT007",
        ordenTrabajo: "MT007",
        interactivo: "Pantalla Interactiva",
        sala: "Digital",
        tipoMantenimiento: "Preventivo",
        tecnico: "Laura Sánchez",
        fechaInicio: "2025-06-23",
        fechaFinalizacion: "2025-06-23",
        horaInicio: "10:00",
        horaFinalizacion: "12:00",
        tiempoTotal: "2.0",
        estado: "Pendiente",
        prioridad: "Media",
        descripcionTrabajo: "Calibración de pantalla táctil y actualización de software.",
        problemasEncontrados: "",
        solucionAplicada: "",
        materialesUsados: "",
        observaciones: "Mantenimiento programado.",
        calificacion: 0,
        proximoMantenimiento: "2025-08-15",
      },
      {
        id: "RPT008",
        ordenTrabajo: "MT008",
        interactivo: "Simulador de Terremotos",
        sala: "Geología",
        tipoMantenimiento: "Correctivo",
        tecnico: "Pedro Ramírez",
        fechaInicio: "2025-06-18",
        fechaFinalizacion: "2025-06-18",
        horaInicio: "09:00",
        horaFinalizacion: "14:00",
        tiempoTotal: "5.0",
        estado: "Finalizado",
        prioridad: "Alta",
        descripcionTrabajo: "Reparación del sistema hidráulico y calibración de sensores.",
        problemasEncontrados: "",
        solucionAplicada: "",
        materialesUsados: "",
        observaciones: "Urgente: Exhibición principal del mes.",
        calificacion: 0,
        proximoMantenimiento: "2025-08-20",
      },

      {
        id: "RPT007",
        ordenTrabajo: "MT007",
        interactivo: "Pantalla Interactiva",
        sala: "Digital",
        tipoMantenimiento: "Preventivo",
        tecnico: "Laura Sánchez",
        fechaInicio: "2025-06-20",
        fechaFinalizacion: "2025-06-20",
        horaInicio: "10:00",
        horaFinalizacion: "12:00",
        tiempoTotal: "2.0",
        estado: "En Proceso",
        prioridad: "Media",
        descripcionTrabajo: "Calibración de pantalla táctil y actualización de software.",
        problemasEncontrados: "",
        solucionAplicada: "",
        materialesUsados: "",
        observaciones: "Mantenimiento programado.",
        calificacion: 0,
        proximoMantenimiento: "2025-08-15",
      },

      {
        id: "RPT009",
        ordenTrabajo: "MT009",
        interactivo: "Muro de Escalada",
        sala: "Deportes",
        tipoMantenimiento: "Preventivo",
        tecnico: "Ana Martínez",
        fechaInicio: "2025-06-26",
        fechaFinalizacion: "2025-06-26",
        horaInicio: "15:00",
        horaFinalizacion: "17:00",
        tiempoTotal: "2.0",
        estado: "Pendiente",
        prioridad: "Media",
        descripcionTrabajo: "Revisión de anclajes y elementos de seguridad.",
        problemasEncontrados: "",
        solucionAplicada: "",
        materialesUsados: "",
        observaciones: "Mantenimiento de seguridad obligatorio mensual.",
        calificacion: 0,
        proximoMantenimiento: "2025-06-25",
      },
    ]

    // Convertir reportes a eventos de calendario

    const eventos = reportesData.map((reporte) => {
      const fechaInicio = moment(`${reporte.fechaInicio} ${reporte.horaInicio}`, "YYYY-MM-DD HH:mm").toDate()
      const fechaFin = reporte.fechaFinalizacion
        ? moment(`${reporte.fechaFinalizacion} ${reporte.horaFinalizacion}`, "YYYY-MM-DD HH:mm").toDate()
        : moment(fechaInicio).add(2, "hours").toDate()
      return {
        id: reporte.id,
        title: `${reporte.interactivo} - ${reporte.sala}`,
        start: fechaInicio,
        end: fechaFin,
        resource: reporte,
        estado: reporte.estado,
      }
    })

    // Estadísticas (sin tiempo promedio y calificación)
    const estadisticasData = {
      totalReportes: reportesData.length,
      pendientes: reportesData.filter((r) => r.estado === "Pendiente").length,
      enProceso: reportesData.filter((r) => r.estado === "En Proceso").length,
      finalizados: reportesData.filter((r) => r.estado === "Finalizado").length,
      mantenimientosPreventivos: reportesData.filter((r) => r.tipoMantenimiento === "Preventivo").length,
      mantenimientosCorrectivos: reportesData.filter((r) => r.tipoMantenimiento === "Correctivo").length,
      interactivosMantenidos: new Set(reportesData.map((r) => r.interactivo)).size,
    }

    setReportes(reportesData)
    setEventosCalendario(eventos)
    setEstadisticas(estadisticasData)
  }, [])

  const verDetalle = (reporte) => {
    setReporteSeleccionado(reporte)
    setShowDetalleModal(true)
  }

  const handleSelectEvent = (evento) => {
    console.log("Evento seleccionado:", evento)
    verDetalle(evento.resource)
  }

  // Handler para cuando se selecciona un slot (día) en el calendario
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
    } else {
      // Si no hay eventos, abrir modal para crear uno nuevo
      setFechaSeleccionada(slotInfo.start)

      // Inicializar el nuevo evento con la fecha seleccionada
      const fechaFormateada = moment(slotInfo.start).format("YYYY-MM-DD")
      setNuevoEvento({
        ...nuevoEvento,
        id: `RPT${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        ordenTrabajo: `MT${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        fechaInicio: fechaFormateada,
        fechaFinalizacion: fechaFormateada,
        proximoMantenimiento: moment(slotInfo.start).add(3, "months").format("YYYY-MM-DD"),
      })

      setShowNuevoEventoModal(true)
    }
  }

  // Handlers para la navegación del calendario
  const handleNavigate = (newDate) => {
    console.log("Navegando a:", newDate)
    setCurrentDate(newDate)
  }

  const handleViewChange = (view) => {
    console.log("Cambiando vista a:", view)
    setCurrentView(view)
  }

  const exportarReportes = () => {
    showNotification("Exportando reportes a Excel...", "success")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoEvento({
      ...nuevoEvento,
      [name]: value,
    })
  }

  const handleGuardarEvento = () => {
    // Calcular tiempo total
    const horaInicio = moment(nuevoEvento.horaInicio, "HH:mm")
    const horaFin = moment(nuevoEvento.horaFinalizacion, "HH:mm")
    const tiempoTotal = (horaFin.diff(horaInicio, "minutes") / 60).toFixed(1)


    const nuevoReporte = {
      ...nuevoEvento,
      tiempoTotal,
    }

    // Crear nuevo evento para el calendario
    const fechaInicio = moment(`${nuevoReporte.fechaInicio} ${nuevoReporte.horaInicio}`, "YYYY-MM-DD HH:mm").toDate()
    const fechaFin = moment(
      `${nuevoReporte.fechaFinalizacion} ${nuevoReporte.horaFinalizacion}`,
      "YYYY-MM-DD HH:mm",
    ).toDate()

    const nuevoEventoCalendario = {
      id: nuevoReporte.id,
      title: `${nuevoReporte.interactivo} - ${nuevoReporte.sala}`,
      start: fechaInicio,
      end: fechaFin,
      resource: nuevoReporte,
      estado: nuevoReporte.estado,
    }

    // Actualizar estados
    setReportes([...reportes, nuevoReporte])
    setEventosCalendario([...eventosCalendario, nuevoEventoCalendario])

    // Actualizar estadísticas
    setEstadisticas({
      ...estadisticas,
      totalReportes: estadisticas.totalReportes + 1,
      pendientes: nuevoReporte.estado === "Pendiente" ? estadisticas.pendientes + 1 : estadisticas.pendientes,
      enProceso: nuevoReporte.estado === "En Proceso" ? estadisticas.enProceso + 1 : estadisticas.enProceso,
      finalizados: nuevoReporte.estado === "Finalizado" ? estadisticas.finalizados + 1 : estadisticas.finalizados,
      mantenimientosPreventivos:
        nuevoReporte.tipoMantenimiento === "Preventivo"
          ? estadisticas.mantenimientosPreventivos + 1
          : estadisticas.mantenimientosPreventivos,
      mantenimientosCorrectivos:
        nuevoReporte.tipoMantenimiento === "Correctivo"
          ? estadisticas.mantenimientosCorrectivos + 1
          : estadisticas.mantenimientosCorrectivos,
    })

    // Cerrar modal y mostrar notificación
    setShowNuevoEventoModal(false)
    showNotification("Mantenimiento programado correctamente", "success")
  }

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"

    switch (event.estado) {
      case "Pendiente":
        backgroundColor = "#dc3545" // Rojo
        break
      case "En Proceso":
        backgroundColor = "#ffc107" // Amarillo
        break
      case "Finalizado":
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

  const getEstadoBadge = (estado) => {
    const badgeConfig = {
      Pendiente: { bg: "danger", icon: "clock" },
      "En Proceso": { bg: "warning", icon: "gear" },
      Finalizado: { bg: "success", icon: "check-circle" },
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
    if (calificacion === 0) {
      return <span className="text-muted">Sin calificar</span>
    }

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
          
          {/* Estadísticas mejoradas (sin tiempo promedio y calificación) */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6} sm={6}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="text-center p-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 status-icon-container">
                    <i className="bi bi-file-text text-primary fs-4"></i>
                  </div>
                  <h4 className="text-primary fw-bold mb-1">{estadisticas.totalReportes}</h4>
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
                  <h4 className="text-success fw-bold mb-1">{estadisticas.finalizados}</h4>
                  <p className="text-muted mb-0 fw-medium small">Finalizados</p>
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
                      <div className="status-indicator status-pending"></div>
                      <span className="fw-medium">Pendiente</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="status-indicator status-in-progress"></div>
                      <span className="fw-medium">En Proceso</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="status-indicator status-completed"></div>
                      <span className="fw-medium">Finalizado</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Vista de Calendario */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-0 py-3">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-calendar3 me-2 text-primary"></i>
                Vista de Calendario
              </h5>
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
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="xl">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">
            <i className="bi bi-file-text me-2 text-primary"></i>
            Detalle del Mantenimiento - {reporteSeleccionado?.id}
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
                        Detalles del Trabajo
                      </h6>

                      <div className="mb-3">
                        <h6 className="fw-bold text-dark">Descripción del Trabajo</h6>
                        <p className="text-muted">{reporteSeleccionado.descripcionTrabajo}</p>
                      </div>

                      {reporteSeleccionado.problemasEncontrados && (
                        <div className="mb-3">
                          <h6 className="fw-bold text-dark">Problemas Encontrados</h6>
                          <p className="text-muted">{reporteSeleccionado.problemasEncontrados}</p>
                        </div>
                      )}

                      {reporteSeleccionado.solucionAplicada && (
                        <div className="mb-3">
                          <h6 className="fw-bold text-dark">Solución Aplicada</h6>
                          <p className="text-muted">{reporteSeleccionado.solucionAplicada}</p>
                        </div>
                      )}

                      {reporteSeleccionado.materialesUsados && (
                        <div className="mb-3">
                          <h6 className="fw-bold text-dark">Materiales Utilizados</h6>
                          <p className="text-muted">{reporteSeleccionado.materialesUsados}</p>
                        </div>
                      )}
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
                        Calificación
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
            Imprimir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}




export default CalendarioAdmin
