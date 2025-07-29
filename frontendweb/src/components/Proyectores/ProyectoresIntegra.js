"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Spinner, Alert, Dropdown } from "react-bootstrap"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuAdmin"
import Header from "../headers/header"
import "bootstrap/dist/css/bootstrap.min.css"
import "../CSS/RegistroInteractivo.css"

const SalaUsosMultiples = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [filtroMarca, setFiltroMarca] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [proyectorSeleccionado, setProyectorSeleccionado] = useState(null)
  const [proyectorEditando, setProyectorEditando] = useState(null)
  const [proyectores, setProyectores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState(null)

  // Mapeo de marcas de proyectores más comunes
  const marcasProyectores = [
    { value: "BENQ", icon: "bi-projector", color: "primary" },
    { value: "EPSON", icon: "bi-projector", color: "info" },
    { value: "SONY", icon: "bi-projector", color: "success" },
    { value: "PANASONIC", icon: "bi-projector", color: "warning" },
    { value: "OPTOMA", icon: "bi-projector", color: "danger" },
    { value: "VIEWSONIC", icon: "bi-projector", color: "secondary" },
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

  // Función para obtener datos de la API
  const fetchProyectores = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://127.0.0.1:8000/api/proyectores/")

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Filtrar solo los proyectores de la Sala De Usos Multiples
      const proyectoresSala7 = data.filter((item) => item.sala === 8 )

      setProyectores(proyectoresSala7)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching proyectores:", err)
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

      // Actualizar la lista local
      setProyectores((prev) => prev.map((item) => (item.id === id ? proyectorActualizado : item)))

      showNotification("Proyector actualizado correctamente", "success")
      setShowEditModal(false)
      setProyectorEditando(null)

      return proyectorActualizado
    } catch (err) {
      console.error("Error updating proyector:", err)
      showNotification(`Error al actualizar: ${err.message}`, "danger")
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Función para dar de baja un proyector
  const darDeBaja = async (proyector) => {
    try {
      setSaving(true)

      const datosActualizados = {
        ...proyector,
        status: 4, // Estado "Baja"
      }

      await actualizarProyector(proyector.id, datosActualizados)
      showNotification(`${proyector.nombre} ha sido dado de baja correctamente`, "warning")
      setShowConfirmModal(false)
      setProyectorSeleccionado(null)
    } catch (err) {
      console.error("Error al dar de baja:", err)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchProyectores()
  }, [])

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

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

  const proyectoresFiltrados = proyectores.filter((proyector) => {
    const estado = estadosMap[proyector.status]

    return (filtroMarca === "" || proyector.marca === filtroMarca) && (filtroEstado === "" || estado === filtroEstado)
  })

  const verDetalles = (proyector) => {
    setProyectorSeleccionado(proyector)
    setShowModal(true)
  }

  const editarProyector = (proyector) => {
    setProyectorEditando({ ...proyector })
    setShowEditModal(true)
  }

  const confirmarBaja = (proyector) => {
    setProyectorSeleccionado(proyector)
    setShowConfirmModal(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (proyectorEditando) {
      actualizarProyector(proyectorEditando.id, proyectorEditando)
    }
  }

  const handleEditChange = (field, value) => {
    setProyectorEditando((prev) => ({
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

  // Componente de loading
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
            <h4 className="mt-3 text-muted">Cargando proyectores de Sala De Usos Multiples...</h4>
          </div>
        </div>
      </div>
    )
  }

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
              <div className="header-gradient p-4 rounded-3 text-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h1 className="h2 mb-2 fw-bold text-white">
                      <i className="bi bi-projector me-3"></i>
                      Sala De Usos Multiples
                    </h1>
                    <p className="mb-0 opacity-90 text-white">
                      Visualiza y administra todos los interactivos de la Sala De Usos Multiples
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <img src={logo || "/placeholder.svg"} alt="Logo del Museo" className="logo" />
                    <div className="stats-container text-white text-center">
                      <div className="h4 mb-0">{proyectores.length}</div>
                      <small>interactivos Sala De Usos Multiples</small>
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
                    <Button variant="outline-danger" size="sm" className="ms-3" onClick={fetchProyectores}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Reintentar
                    </Button>
                  </div>
                </Alert>
              </Col>
            </Row>
          )}

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
                          Filtrar por Marca
                        </Form.Label>
                        <Form.Select
                          value={filtroMarca}
                          onChange={(e) => setFiltroMarca(e.target.value)}
                          className="form-control-custom"
                        >
                          <option value="">Todas las marcas</option>
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

          {/* Grid de Proyectores */}
          <Row className="g-4">
            {proyectoresFiltrados.map((proyector) => {
              const marcaConfig = getMarcaIcon(proyector.marca)

              return (
                <Col key={proyector.id} lg={4} md={6}>
                  <Card className="h-100 border-0 shadow-sm registration-card">
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src="/placeholder.svg?height=200&width=300"
                        alt={proyector.nombre}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">{getEstadoBadge(proyector.status)}</div>
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center mb-2">
                        <i
                          className={`${marcaConfig.icon} text-${marcaConfig.color} me-2`}
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                        <h6 className="text-muted mb-0">{marcaConfig.name}</h6>
                      </div>

                      <h5 className="card-title fw-bold mb-2">{proyector.nombre}</h5>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-hash text-muted me-2"></i>
                          <small className="text-muted">Serie: {proyector.numero_serie}</small>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-cpu text-muted me-2"></i>
                          <small className="text-muted">
                            {proyector.marca} {proyector.modelo}
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar text-muted me-2"></i>
                          <small className="text-muted">Instalado: {formatearFecha(proyector.fecha_instalado)}</small>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="flex-grow-1"
                            onClick={() => verDetalles(proyector)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver Detalles
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm" id={`dropdown-${proyector.id}`}>
                              <i className="bi bi-three-dots-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => editarProyector(proyector)}>
                                <i className="bi bi-pencil me-2"></i>
                                Editar
                              </Dropdown.Item>
                              {proyector.status !== 4 && (
                                <Dropdown.Item onClick={() => confirmarBaja(proyector)} className="text-warning">
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
          {!loading && proyectoresFiltrados.length === 0 && !error && (
            <Row className="mt-5">
              <Col className="text-center">
                <div className="py-5">
                  <i className="bi bi-search text-muted" style={{ fontSize: "4rem" }}></i>
                  <h4 className="text-muted mt-3">
                    {proyectores.length === 0 ? "No hay proyectores en la Sala De Usos Multiples" : "No se encontraron proyectores"}
                  </h4>
                  <p className="text-muted">
                    {proyectores.length === 0
                      ? "No se encontraron proyectores registrados para la Sala De Usos Multiples"
                      : "Intenta ajustar los filtros de búsqueda"}
                  </p>
                  {proyectores.length === 0 && (
                    <Button variant="primary" onClick={fetchProyectores}>
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
            Detalles del Proyector
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {proyectorSeleccionado && (
            <Row>
              <Col md={4}>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt={proyectorSeleccionado.nombre}
                  className="img-fluid rounded"
                />
              </Col>
              <Col md={8}>
                <h5 className="fw-bold mb-3">{proyectorSeleccionado.nombre}</h5>

                <Row className="g-3">
                  <Col sm={6}>
                    <strong>Marca:</strong>
                    <br />
                    <span className="text-muted">{proyectorSeleccionado.marca}</span>
                  </Col>
                  <Col sm={6}>
                    <strong>Estado:</strong>
                    <br />
                    {getEstadoBadge(proyectorSeleccionado.status)}
                  </Col>
                  <Col sm={6}>
                    <strong>Número de Serie:</strong>
                    <br />
                    <span className="text-muted">{proyectorSeleccionado.numero_serie}</span>
                  </Col>
                  <Col sm={6}>
                    <strong>Modelo:</strong>
                    <br />
                    <span className="text-muted">{proyectorSeleccionado.modelo}</span>
                  </Col>
                  <Col sm={6}>
                    <strong>Sala:</strong>
                    <br />
                    <span className="text-muted">Sala De Usos Multiples (ID: {proyectorSeleccionado.sala})</span>
                  </Col>
                  <Col sm={6}>
                    <strong>Fecha de Instalación:</strong>
                    <br />
                    <span className="text-muted">{formatearFecha(proyectorSeleccionado.fecha_instalado)}</span>
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
          <Button variant="primary" onClick={() => editarProyector(proyectorSeleccionado)}>
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
            Editar Proyector
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {proyectorEditando && (
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-tag me-1"></i>
                      Nombre del Proyector
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={proyectorEditando.nombre || ""}
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
                      value={proyectorEditando.numero_serie || ""}
                      onChange={(e) => handleEditChange("numero_serie", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-tag me-1"></i>
                      Marca
                    </Form.Label>
                    <Form.Select
                      value={proyectorEditando.marca || ""}
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
                      value={proyectorEditando.modelo || ""}
                      onChange={(e) => handleEditChange("modelo", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-activity me-1"></i>
                      Estado
                    </Form.Label>
                    <Form.Select
                      value={proyectorEditando.status || ""}
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
                      value={formatearFechaInput(proyectorEditando.fecha_instalado)}
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
                      value={proyectorEditando.sala || ""}
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
          {proyectorSeleccionado && (
            <div>
              <p className="mb-3">¿Estás seguro de que deseas dar de baja el siguiente proyector?</p>
              <div className="bg-light p-3 rounded">
                <h6 className="fw-bold">{proyectorSeleccionado.nombre}</h6>
                <small className="text-muted">Serie: {proyectorSeleccionado.numero_serie}</small>
              </div>
              <Alert variant="warning" className="mt-3 mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Esta acción cambiará el estado del proyector a "Baja". Podrás reactivarlo más tarde si es necesario.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={() => darDeBaja(proyectorSeleccionado)} disabled={saving}>
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

export default SalaUsosMultiples
