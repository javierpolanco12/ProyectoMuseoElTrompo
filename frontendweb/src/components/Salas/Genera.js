"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Spinner, Alert, Dropdown, Nav } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

// Agregar las importaciones que faltaban al inicio del archivo:
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "../CSS/RegistroInteractivo.css"

const Genera= () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("todos") // "todos", "proyectores", "interactivos"
  const [filtroTipo, setFiltroTipo] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null)
  const [equipoEditando, setEquipoEditando] = useState(null)
  const [proyectores, setProyectores] = useState([])
  const [interactivos, setInteractivos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState(null)

  // Mapeo de marcas de proyectores
  const marcasProyectores = [
    { value: "BENQ", icon: "bi-projector", color: "primary" },
    { value: "EPSON", icon: "bi-projector", color: "info" },
    { value: "SONY", icon: "bi-projector", color: "success" },
    { value: "PANASONIC", icon: "bi-projector", color: "warning" },
    { value: "OPTOMA", icon: "bi-projector", color: "danger" },
    { value: "VIEWSONIC", icon: "bi-projector", color: "secondary" },
  ]

  // Mapeo de tipos de interactivos
  const tiposInteractivos = [
    { id: 1, value: "Mecanico", icon: "bi-tablet", color: "primary" },
    { id: 2, value: "Digital", icon: "bi-projector", color: "info" },
  ]

  // Mapeo de estados
  const estadosMap = {
    1: "Activo",
    2: "En Mantenimiento",
    3: "Fuera de Servicio",
    4: "Baja",
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  // Función para obtener proyectores de la API
  const fetchProyectores = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/proyectores/")
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      // Filtrar solo los proyectores de la Sala 4 Genera
      const proyectoresSala1 = data.filter((item) => item.sala === 4)
      return proyectoresSala1
    } catch (err) {
      console.error("Error fetching proyectores:", err)
      throw err
    }
  }

  // Función para obtener interactivos de la API
  const fetchInteractivos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/interactivos/")
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      // Filtrar solo los interactivos de la Sala 4 Genera
      const interactivosSala1 = data.filter((item) => item.sala === 4)
      return interactivosSala1
    } catch (err) {
      console.error("Error fetching interactivos:", err)
      throw err
    }
  }

  // Función para obtener todos los datos
  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [proyectoresData, interactivosData] = await Promise.all([fetchProyectores(), fetchInteractivos()])

      setProyectores(proyectoresData)
      setInteractivos(interactivosData)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar un proyector
  const actualizarProyector = async (id, datosActualizados) => {
    try {
      setSaving(true)
      const response = await fetch(`http://127.0.0.1:8000/api/proyectores/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const proyectorActualizado = await response.json()
      setProyectores((prev) => prev.map((item) => (item.id === id ? proyectorActualizado : item)))
      showNotification("Proyector actualizado correctamente", "success")
      setShowEditModal(false)
      setEquipoEditando(null)
      return proyectorActualizado
    } catch (err) {
      console.error("Error updating proyector:", err)
      showNotification(`Error al actualizar: ${err.message}`, "danger")
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Función para actualizar un interactivo
  const actualizarInteractivo = async (id, datosActualizados) => {
    try {
      setSaving(true)
      const response = await fetch(`http://127.0.0.1:8000/api/interactivos/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const interactivoActualizado = await response.json()
      setInteractivos((prev) => prev.map((item) => (item.id === id ? interactivoActualizado : item)))
      showNotification("Interactivo actualizado correctamente", "success")
      setShowEditModal(false)
      setEquipoEditando(null)
      return interactivoActualizado
    } catch (err) {
      console.error("Error updating interactivo:", err)
      showNotification(`Error al actualizar: ${err.message}`, "danger")
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Función para dar de baja un equipo
  const darDeBaja = async (equipo) => {
    try {
      setSaving(true)
      const datosActualizados = {
        ...equipo,
        status: 4, // Estado "Baja"
      }

      if (equipo.tipo_equipo === "proyector") {
        await actualizarProyector(equipo.id, datosActualizados)
      } else {
        await actualizarInteractivo(equipo.id, datosActualizados)
      }

      showNotification(`${equipo.nombre} ha sido dado de baja correctamente`, "warning")
      setShowConfirmModal(false)
      setEquipoSeleccionado(null)
      await fetchAllData() // Re-fetch all data to ensure UI is updated
    } catch (err) {
      console.error("Error al dar de baja:", err)
      showNotification(`Error al dar de baja: ${err.message}`, "danger")
    } finally {
      setSaving(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAllData()
  }, [])

  const getEstadoBadge = (statusId) => {
    const estado = estadosMap[statusId] || "Desconocido"
    const badgeConfig = {
      Activo: { bg: "success", icon: "check-circle" },
      "En Mantenimiento": { bg: "warning", icon: "tools" },
      "Fuera de Servicio": { bg: "danger", icon: "x-circle" },
      Baja: { bg: "secondary", icon: "archive" },
    }

    const config = badgeConfig[estado] || { bg: "secondary", icon: "circle" }

    return (
      <Badge bg={config.bg} className="px-3 py-2">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {estado}
      </Badge>
    )
  }

  const getMarcaIcon = (marca) => {
    const marcaConfig = marcasProyectores.find((m) => m.value === marca)
    return marcaConfig
      ? { icon: marcaConfig.icon, color: marcaConfig.color, name: marcaConfig.value }
      : { icon: "bi-projector", color: "secondary", name: marca || "Otra" }
  }

  const getTipoIcon = (tipoId) => {
    const tipoConfig = tiposInteractivos.find((t) => t.id === tipoId)
    return tipoConfig
      ? { icon: tipoConfig.icon, color: tipoConfig.color, name: tipoConfig.value }
      : { icon: "bi-gear", color: "secondary", name: "Otro" }
  }

  // Combinar y filtrar equipos
  const equiposCombinados = [
    ...proyectores.map((p) => ({ ...p, tipo_equipo: "proyector" })),
    ...interactivos.map((i) => ({ ...i, tipo_equipo: "interactivo" })),
  ]

  const equiposFiltrados = equiposCombinados.filter((equipo) => {
    const estado = estadosMap[equipo.status]

    // Filtro por tab activo
    if (activeTab === "proyectores" && equipo.tipo_equipo !== "proyector") return false
    if (activeTab === "interactivos" && equipo.tipo_equipo !== "interactivo") return false

    // Filtro por tipo/marca
    if (filtroTipo !== "") {
      if (equipo.tipo_equipo === "proyector" && equipo.marca !== filtroTipo) return false
      if (equipo.tipo_equipo === "interactivo") {
        const tipoConfig = getTipoIcon(equipo.tipo)
        if (tipoConfig.name !== filtroTipo) return false
      }
    }

    // Filtro por estado
    if (filtroEstado !== "" && estado !== filtroEstado) return false

    return true
  })

  const verDetalles = (equipo) => {
    setEquipoSeleccionado(equipo)
    setShowModal(true)
  }

  const editarEquipo = (equipo) => {
    setEquipoEditando({ ...equipo })
    setShowEditModal(true)
  }

  const confirmarBaja = (equipo) => {
    setEquipoSeleccionado(equipo)
    setShowConfirmModal(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (equipoEditando) {
      if (equipoEditando.tipo_equipo === "proyector") {
        actualizarProyector(equipoEditando.id, equipoEditando)
      } else {
        actualizarInteractivo(equipoEditando.id, equipoEditando)
      }
    }
  }

  const handleEditChange = (field, value) => {
    setEquipoEditando((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificada"
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatearFechaInput = (fecha) => {
    if (!fecha) return ""
    return new Date(fecha).toISOString().split("T")[0]
  }

  // Agregar la función handleMenuToggle que faltaba:
  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  // Reemplazar el componente de loading para incluir Menu y Header:
  if (loading) {
    return (
      <div className="container">
        <Menu onToggle={handleMenuToggle} />
        <Header isMenuOpen={isMenuOpen} />
        <div
          className="main-content d-flex justify-content-center align-items-center"
          style={{
            marginLeft: isMenuOpen ? "200px" : "0",
            height: "80vh",
          }}
        >
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
            <h4 className="mt-3 text-muted">Cargando equipos de la Sala Genera...</h4>
          </div>
        </div>
      </div>
    )
  }

  // Reemplazar el return principal para incluir Menu y Header:
  return (
    <div className="container">
      <Menu onToggle={handleMenuToggle} />
      <Header isMenuOpen={isMenuOpen} />

      {/* Notificación */}
      {notification && (
        <Alert
          variant={notification.type}
          className="position-fixed"
          style={{ top: "20px", right: "20px", zIndex: 9999 }}
          dismissible
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

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
              {/* Cambiar la clase del header de "bg-primary" a "header-gradient": */}
              <div className="header-gradient p-4 rounded-3 text-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h1 className="h2 mb-2 fw-bold text-white">
                      <i className="bi bi-collection-play me-3"></i>
                      Equipos - Sala Genera
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      Visualiza y administra todos los equipos de la Sala Genera
                    </p>
                  </div>
                  {/* Agregar el logo en la sección de estadísticas: */}
                  <div className="d-flex align-items-center gap-3">
                    <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                    <div className="stats-container text-white text-center">
                      <div className="h4 mb-0">{equiposCombinados.length}</div>
                      <small>Equipos Total</small>
                    </div>
                    <div className="stats-container text-white text-center">
                      <div className="h4 mb-0">{proyectores.length}</div>
                      <small>Proyectores</small>
                    </div>
                    <div className="stats-container text-white text-center">
                      <div className="h4 mb-0">{interactivos.length}</div>
                      <small>Interactivos</small>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Mostrar error si existe */}
          {error && (
            <Row className="mb-4">
              <Col>
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <div>
                    <strong>Error al cargar los datos:</strong> {error}
                    <Button variant="outline-danger" size="sm" className="ms-3" onClick={fetchAllData}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Reintentar
                    </Button>
                  </div>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Tabs de navegación */}
          <Row className="mb-4">
            <Col>
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="todos">
                    <i className="bi bi-grid me-1"></i>
                    Todos ({equiposCombinados.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="proyectores">
                    <i className="bi bi-projector me-1"></i>
                    Proyectores ({proyectores.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="interactivos">
                    <i className="bi bi-tablet me-1"></i>
                    Interactivos ({interactivos.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          {/* Filtros */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-3">
                  <h6 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-funnel me-2 text-primary"></i>
                    Filtros de Búsqueda
                  </h6>
                </Card.Header>
                <Card.Body className="py-3">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          <i className="bi bi-tag me-1"></i>
                          {activeTab === "proyectores"
                            ? "Filtrar por Marca"
                            : activeTab === "interactivos"
                              ? "Filtrar por Tipo"
                              : "Filtrar por Marca/Tipo"}
                        </Form.Label>
                        <Form.Select
                          value={filtroTipo}
                          onChange={(e) => setFiltroTipo(e.target.value)}
                          className="form-control-custom"
                        >
                          <option value="">
                            {activeTab === "proyectores"
                              ? "Todas las marcas"
                              : activeTab === "interactivos"
                                ? "Todos los tipos"
                                : "Todas las opciones"}
                          </option>
                          {activeTab === "proyectores" &&
                            marcasProyectores.map((marca) => (
                              <option key={marca.value} value={marca.value}>
                                {marca.value}
                              </option>
                            ))}
                          {activeTab === "interactivos" &&
                            tiposInteractivos.map((tipo) => (
                              <option key={tipo.id} value={tipo.value}>
                                {tipo.value}
                              </option>
                            ))}
                          {activeTab === "todos" &&
                            [...marcasProyectores.map((m) => m.value), ...tiposInteractivos.map((t) => t.value)].map(
                              (option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ),
                            )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          <i className="bi bi-activity me-1"></i>
                          Filtrar por Estado
                        </Form.Label>
                        <Form.Select
                          value={filtroEstado}
                          onChange={(e) => setFiltroEstado(e.target.value)}
                          className="form-control-custom"
                        >
                          <option value="">Todos los estados</option>
                          {Object.values(estadosMap).map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Grid de Equipos */}
          <Row className="g-4">
            {equiposFiltrados.map((equipo) => {
              const isProyector = equipo.tipo_equipo === "proyector"
              const config = isProyector ? getMarcaIcon(equipo.marca) : getTipoIcon(equipo.tipo)

              return (
                <Col key={`${equipo.tipo_equipo}-${equipo.id}`} lg={4} md={6}>
                  {/* Cambiar las clases de las cards para usar "registration-card": */}
                  <Card className="h-100 border-0 shadow-sm registration-card">
                    <div className="position-relative">
                      <Card.Img />
                      <div className="position-absolute top-0 end-0 m-2">{getEstadoBadge(equipo.status)}</div>
                      <div className="position-absolute top-0 start-0 m-2">
                        <Badge bg={isProyector ? "info" : "success"}>
                          <i className={`bi bi-${isProyector ? "projector" : "tablet"} me-1`}></i>
                          {isProyector ? "Proyector" : "Interactivo"}
                        </Badge>
                      </div>
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center mb-2">
                        <i className={`${config.icon} text-${config.color} me-2`} style={{ fontSize: "1.2rem" }}></i>
                        <h6 className="text-muted mb-0">{config.name}</h6>
                      </div>

                      <h5 className="card-title fw-bold mb-2">{equipo.nombre}</h5>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-hash text-muted me-2"></i>
                          <small className="text-muted">Serie: {equipo.numero_serie}</small>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-cpu text-muted me-2"></i>
                          <small className="text-muted">
                            {isProyector
                              ? `${equipo.marca} ${equipo.modelo}`
                              : `${equipo.marca_computadora} ${equipo.modelo_computadora}`}
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar text-muted me-2"></i>
                          <small className="text-muted">Instalado: {formatearFecha(equipo.fecha_instalado)}</small>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="flex-grow-1"
                            onClick={() => verDetalles(equipo)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver Detalles
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                              id={`dropdown-${equipo.tipo_equipo}-${equipo.id}`}
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => editarEquipo(equipo)}>
                                <i className="bi bi-pencil me-2"></i>
                                Editar
                              </Dropdown.Item>
                              {equipo.status !== 4 && (
                                <Dropdown.Item onClick={() => confirmarBaja(equipo)} className="text-warning">
                                  <i className="bi bi-archive me-2"></i>
                                  Dar de Baja
                                </Dropdown.Item>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>

          {/* Mensaje cuando no hay resultados */}
          {!loading && equiposFiltrados.length === 0 && !error && (
            <Row className="mt-5">
              <Col className="text-center">
                <div className="py-5">
                  <i className="bi bi-search text-muted" style={{ fontSize: "4rem" }}></i>
                  <h4 className="text-muted mt-3">
                    {equiposCombinados.length === 0 ? "No hay equipos en la Sala Genera" : "No se encontraron equipos"}
                  </h4>
                  <p className="text-muted">
                    {equiposCombinados.length === 0
                      ? "No se encontraron equipos registrados para la Sala Genera"
                      : "Intenta ajustar los filtros de búsqueda"}
                  </p>
                  {equiposCombinados.length === 0 && (
                    <Button variant="primary" onClick={fetchAllData}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Actualizar
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      {/* Modal de Detalles */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-info-circle me-2"></i>
            Detalles del {equipoSeleccionado?.tipo_equipo === "proyector" ? "Proyector" : "Interactivo"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {equipoSeleccionado && (
            <Row>
              <Col md={4}>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt={equipoSeleccionado.nombre}
                  className="img-fluid rounded"
                />
              </Col>
              <Col md={8}>
                <h5 className="fw-bold mb-3">{equipoSeleccionado.nombre}</h5>

                <Row className="g-3">
                  <Col sm={6}>
                    <strong>Tipo de Equipo:</strong>
                    <br />
                    <Badge bg={equipoSeleccionado.tipo_equipo === "proyector" ? "info" : "success"}>
                      {equipoSeleccionado.tipo_equipo === "proyector" ? "Proyector" : "Interactivo"}
                    </Badge>
                  </Col>
                  <Col sm={6}>
                    <strong>Estado:</strong>
                    <br />
                    {getEstadoBadge(equipoSeleccionado.status)}
                  </Col>
                  <Col sm={6}>
                    <strong>Número de Serie:</strong>
                    <br />
                    <span className="text-muted">{equipoSeleccionado.numero_serie}</span>
                  </Col>
                  <Col sm={6}>
                    <strong>Sala:</strong>
                    <br />
                    <span className="text-muted">Sala Genera(ID: {equipoSeleccionado.sala})</span>
                  </Col>
                  {equipoSeleccionado.tipo_equipo === "proyector" ? (
                    <>
                      <Col sm={6}>
                        <strong>Marca:</strong>
                        <br />
                        <span className="text-muted">{equipoSeleccionado.marca}</span>
                      </Col>
                      <Col sm={6}>
                        <strong>Modelo:</strong>
                        <br />
                        <span className="text-muted">{equipoSeleccionado.modelo}</span>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col sm={6}>
                        <strong>Tipo:</strong>
                        <br />
                        <span className="text-muted">{getTipoIcon(equipoSeleccionado.tipo).name}</span>
                      </Col>
                      <Col sm={6}>
                        <strong>Marca Computadora:</strong>
                        <br />
                        <span className="text-muted">{equipoSeleccionado.marca_computadora}</span>
                      </Col>
                      <Col sm={6}>
                        <strong>Modelo Computadora:</strong>
                        <br />
                        <span className="text-muted">{equipoSeleccionado.modelo_computadora}</span>
                      </Col>
                    </>
                  )}
                  <Col sm={6}>
                    <strong>Fecha de Instalación:</strong>
                    <br />
                    <span className="text-muted">{formatearFecha(equipoSeleccionado.fecha_instalado)}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => editarEquipo(equipoSeleccionado)}>
            <i className="bi bi-pencil me-1"></i>
            Editar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil me-2"></i>
            Editar {equipoEditando?.tipo_equipo === "proyector" ? "Proyector" : "Interactivo"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {equipoEditando && (
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-tag me-1"></i>
                      Nombre del {equipoEditando.tipo_equipo === "proyector" ? "Proyector" : "Interactivo"}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={equipoEditando.nombre || ""}
                      onChange={(e) => handleEditChange("nombre", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-hash me-1"></i>
                      Número de Serie
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={equipoEditando.numero_serie || ""}
                      onChange={(e) => handleEditChange("numero_serie", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                {equipoEditando.tipo_equipo === "proyector" ? (
                  <>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          <i className="bi bi-tag me-1"></i>
                          Marca
                        </Form.Label>
                        <Form.Select
                          value={equipoEditando.marca || ""}
                          onChange={(e) => handleEditChange("marca", e.target.value)}
                          required
                        >
                          <option value="">Seleccionar marca</option>
                          {marcasProyectores.map((marca) => (
                            <option key={marca.value} value={marca.value}>
                              {marca.value}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          <i className="bi bi-cpu me-1"></i>
                          Modelo
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={equipoEditando.modelo || ""}
                          onChange={(e) => handleEditChange("modelo", e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          <i className="bi bi-grid me-1"></i>
                          Tipo
                        </Form.Label>
                        <Form.Select
                          value={equipoEditando.tipo || ""}
                          onChange={(e) => handleEditChange("tipo", Number.parseInt(e.target.value))}
                          required
                        >
                          <option value="">Seleccionar tipo</option>
                          {tiposInteractivos.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.value}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          <i className="bi bi-laptop me-1"></i>
                          Marca Computadora
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={equipoEditando.marca_computadora || ""}
                          onChange={(e) => handleEditChange("marca_computadora", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          <i className="bi bi-cpu me-1"></i>
                          Modelo Computadora
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={equipoEditando.modelo_computadora || ""}
                          onChange={(e) => handleEditChange("modelo_computadora", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-activity me-1"></i>
                      Estado
                    </Form.Label>
                    <Form.Select
                      value={equipoEditando.status || ""}
                      onChange={(e) => handleEditChange("status", Number.parseInt(e.target.value))}
                      required
                    >
                      <option value="">Seleccionar estado</option>
                      {Object.entries(estadosMap).map(([id, nombre]) => (
                        <option key={id} value={id}>
                          {nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-calendar me-1"></i>
                      Fecha de Instalación
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={formatearFechaInput(equipoEditando.fecha_instalado)}
                      onChange={(e) => handleEditChange("fecha_instalado", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-building me-1"></i>
                      Sala
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={equipoEditando.sala || ""}
                      onChange={(e) => handleEditChange("sala", Number.parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-1"></i>
                  Guardar Cambios
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de Confirmación de Baja */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Confirmar Baja
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {equipoSeleccionado && (
            <div>
              <p className="mb-3">¿Estás seguro de que deseas dar de baja el siguiente equipo?</p>
              <div className="bg-light p-3 rounded">
                <h6 className="fw-bold">{equipoSeleccionado.nombre}</h6>
                <small className="text-muted">
                  Serie: {equipoSeleccionado.numero_serie} | Tipo:{" "}
                  {equipoSeleccionado.tipo_equipo === "proyector" ? "Proyector" : "Interactivo"}
                </small>
              </div>
              <Alert variant="warning" className="mt-3 mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Esta acción cambiará el estado del equipo a "Baja". Podrás reactivarlo más tarde si es necesario.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={() => darDeBaja(equipoSeleccionado)} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : (
              <>
                <i className="bi bi-archive me-1"></i>
                Dar de Baja
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Genera
