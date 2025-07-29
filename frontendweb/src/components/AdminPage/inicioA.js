"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Button, Badge, Alert, ProgressBar, Table } from "react-bootstrap"
import logo from "../IMG/logo.jpg" // Asegúrate de que esta ruta sea correcta
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "../CSS/InicioA.css" // Asegúrate de que esta ruta sea correcta

const InicioA = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [datosMantenimiento, setDatosMantenimiento] = useState({
    totalInteractivos: 0,
    operativos: 0,
    enMantenimiento: 0,
    fueraDeServicio: 0,
    mantenimientosPendientes: 0,
    mantenimientosHoy: 0,
    mantenimientosVencidos: 0,
    eficienciaEquipo: 87, // Mantener como estático por ahora, requiere más datos para calcular
    tiempoPromedioReparacion: 2.5, // Mantener como estático por ahora
    disponibilidadGeneral: 83, // Mantener como estático por ahora
    mantenimientosCompletadosMes: 0,
    mantenimientosPreventivos: 0,
    mantenimientosCorrectivos: 0,
  })
  const [alertasUrgentes, setAlertasUrgentes] = useState([])
  const [mantenimientosPendientes, setMantenimientosPendientes] = useState([])
  const [interactivosEstado, setInteractivosEstado] = useState([]) // Combinará interactivos y proyectores por sala

  // Datos de las APIs
  const [salas, setSalas] = useState([])
  const [interactivos, setInteractivos] = useState([])
  const [proyectores, setProyectores] = useState([])
  const [tareas, setTareas] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Funciones para obtener datos de las APIs
  const fetchData = async () => {
    setLoadingData(true)
    try {
      const [salasRes, interactivosRes, proyectoresRes, tareasRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/salas/"),
        fetch("http://127.0.0.1:8000/api/interactivos/"),
        fetch("http://127.0.0.1:8000/api/proyectores/"),
        fetch("http://127.0.0.1:8000/api/tareas-mantenimiento/"),
      ])

      const [salasData, interactivosData, proyectoresData, tareasData] = await Promise.all([
        salasRes.json(),
        interactivosRes.json(),
        proyectoresRes.json(),
        tareasRes.json(),
      ])

      setSalas(salasData)
      setInteractivos(interactivosData)
      setProyectores(proyectoresData)
      setTareas(tareasData)

      // Calcular métricas del dashboard
      const allItems = [...interactivosData, ...proyectoresData]
      const totalItems = allItems.length
      const operativos = allItems.filter((item) => item.status === 1).length // Asumiendo status 1 = operativo

      const enMantenimiento = tareasData.filter((tarea) => tarea.estado === 3).length // Estado 3 = En Progreso
      const fueraDeServicio = allItems.filter((item) => item.status !== 1).length // Asumiendo no 1 = fuera de servicio/mantenimiento

      const pendientes = tareasData.filter((tarea) => tarea.estado === 1 || tarea.estado === 2).length // 1=Pendiente, 2=Programado
      const mantenimientosPreventivos = tareasData.filter((tarea) => tarea.tipo === 1).length
      const mantenimientosCorrectivos = tareasData.filter((tarea) => tarea.tipo === 2).length // Asumiendo 2 = Correctivo

      // Mantenimientos completados en el mes actual
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      const mantenimientosCompletadosMes = tareasData.filter((tarea) => {
        if (tarea.estado === 4 && tarea.fecha_realizada) {
          const fechaRealizada = new Date(tarea.fecha_realizada)
          return fechaRealizada.getMonth() === currentMonth && fechaRealizada.getFullYear() === currentYear
        }
        return false
      }).length

      // Mantenimientos hoy y vencidos
      const mantenimientosHoy = tareasData.filter((tarea) => {
        const fechaProgramada = new Date(tarea.fecha_programada)
        return (
          fechaProgramada.getDate() === today.getDate() &&
          fechaProgramada.getMonth() === currentMonth &&
          fechaProgramada.getFullYear() === currentYear &&
          (tarea.estado === 1 || tarea.estado === 2 || tarea.estado === 3)
        )
      }).length

      const mantenimientosVencidos = tareasData.filter((tarea) => {
        const fechaProgramada = new Date(tarea.fecha_programada)
        return (
          fechaProgramada < today &&
          tarea.estado !== 4 && // No completado
          tarea.estado !== 5 // No cancelado
        )
      }).length

      setDatosMantenimiento((prev) => ({
        ...prev,
        totalInteractivos: totalItems,
        operativos: operativos,
        enMantenimiento: enMantenimiento,
        fueraDeServicio: fueraDeServicio,
        mantenimientosPendientes: pendientes,
        mantenimientosPreventivos: mantenimientosPreventivos,
        mantenimientosCorrectivos: mantenimientosCorrectivos,
        mantenimientosCompletadosMes: mantenimientosCompletadosMes,
        mantenimientosHoy: mantenimientosHoy,
        mantenimientosVencidos: mantenimientosVencidos,
      }))

      // Generar alertas urgentes (tipo 3 = Emergencia)
      const urgentAlerts = tareasData
        .filter((tarea) => tarea.tipo === 3 || (tarea.estado === 1 && new Date(tarea.fecha_programada) < today)) // Emergencia o Pendiente y Vencido
        .map((tarea) => ({
          id: tarea.id,
          tipo: tarea.tipo === 3 ? "danger" : "warning", // Emergencia = danger, Vencido = warning
          interactivo: getNombreItem(tarea.interactivo, allItems),
          sala: getNombreSala(tarea.area, salas),
          problema:
            tarea.tipo === 3
              ? `Emergencia: ${tarea.descripcion}`
              : `Mantenimiento vencido: ${tarea.descripcion || tarea.titulo}`,
          prioridad: tarea.tipo === 3 ? "URGENTE" : "ALTA",
          tiempo: new Date(tarea.fecha_programada) < today ? "Vencido" : "Próximo", // Simplificado
        }))
      setAlertasUrgentes(urgentAlerts)

      // Generar mantenimientos pendientes para la tabla
      const pendingMantenimientos = tareasData
        .filter((tarea) => tarea.estado === 1 || tarea.estado === 2 || tarea.estado === 3) // Pendiente, Programado, En Progreso
        .map((tarea) => ({
          id: tarea.id,
          interactivo: getNombreItem(tarea.interactivo, allItems),
          sala: getNombreSala(tarea.area, salas),
          tipo: getTipoLabel(tarea.tipo),
          fechaProgramada: tarea.fecha_programada,
          departamento: "Sistema", // Asumiendo
          tecnicoAsignado: "Pendiente", // Asumiendo
          estado: getEstadoLabel(tarea.estado),
          prioridad: getPrioridadLabel(tarea.tipo), // Usar tipo para prioridad en este contexto
        }))
      setMantenimientosPendientes(pendingMantenimientos)

      // Generar estado de interactivos por sala
      const interactivosBySala = salasData.map((sala) => {
        const itemsInSala = allItems.filter((item) => item.sala === sala.id)
        return {
          sala: sala.nombre,
          interactivos: itemsInSala.map((item) => ({
            nombre: item.nombre,
            estado: item.status === 1 ? "Operativo" : "Fuera de Servicio", // Simplificado
          })),
        }
      })
      setInteractivosEstado(interactivosBySala)

      const userRole = "Administrador "
      showNotification(`Bienvenido, ${userRole}!`, "success")
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error)
      showNotification("Error al cargar los datos del dashboard", "error")
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Helper functions (adaptadas para recibir los datos como parámetro)
  const getNombreSala = (salaId, allSalas) => {
    const sala = allSalas.find((s) => s.id === salaId)
    return sala ? sala.nombre : `Sala #${salaId}`
  }

  const getNombreItem = (itemId, allItems) => {
    const item = allItems.find((i) => i.id === itemId)
    return item ? item.nombre : `Item #${itemId}`
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

  const getPrioridadLabel = (tipo) => {
    // Mapeo simple de tipo a prioridad para el dashboard
    const prioridades = {
      1: "Media", // Preventivo
      2: "Alta", // Correctivo
      3: "Urgente", // Emergencia
    }
    return prioridades[tipo] || "Baja"
  }

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

  // Se mantiene por si se usa en otra parte, pero no en las secciones simplificadas
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

  // Esta función ya no es necesaria en el dashboard simplificado
  // const getTecnicoEstadoBadge = (estado) => {
  //   return estado === "Disponible" ? (
  //     <Badge bg="success" className="px-2 py-1">
  //       <i className="bi bi-check-circle me-1"></i>
  //       Disponible
  //     </Badge>
  //   ) : (
  //     <Badge bg="warning" className="px-2 py-1">
  //       <i className="bi bi-clock me-1"></i>
  //       En Trabajo
  //     </Badge>
  //   )
  // }

  if (loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando dashboard...</span>
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
                          <th>Interactivo/Proyector</th>
                          <th>Departamento</th>
                          <th>Técnico</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mantenimientosPendientes.length > 0 ? (
                          mantenimientosPendientes.map((mant) => (
                            <tr key={mant.id}>
                              <td>
                                <strong className="text-primary">#{mant.id}</strong>
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
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted py-4">
                              No hay mantenimientos programados o pendientes.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
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
