"use client"

import React, { useState } from "react"
import { Home, Wrench, BarChart3, Plus, Users, ClipboardList, Calendar, User, LogOut } from "lucide-react"
import { Modal, Button, Spinner, Alert } from "react-bootstrap" // Import Bootstrap components
import "bootstrap/dist/css/bootstrap.min.css" // Ensure Bootstrap CSS is imported
import "bootstrap-icons/font/bootstrap-icons.css" // Import Bootstrap Icons

const MenuAdmin = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [notification, setNotification] = useState(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const confirmLogout = async () => {
    setIsLoggingOut(true)
    setNotification(null)
    try {
      // Simulate API call for logout
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // In a real application, you would clear user session/token here
      showNotification("Sesión cerrada exitosamente.", "success")
      // Redirect to login page or home after logout
      window.location.href = "/" // Cambia esta ruta según tu estructura
    } catch (error) {
      showNotification("Error al cerrar sesión. Inténtalo de nuevo.", "danger")
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  return (
    <React.Fragment>
      {/* Notification */}
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

      {/* Botón para mostrar/ocultar el menú */}
      <button
        className="btn btn-dark"
        onClick={toggleMenu}
        style={{
          position: "fixed",
          backgroundColor: "#28a745", // color del boton del menu
          top: "10px",
          left: isOpen ? "210px" : "10px",
          zIndex: 1030,
          transition: "left 0.3s ease",
          border: "none",
          color: "white",
          padding: "10px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Menú lateral */}
      <aside
        style={{
          width: "200px",
          backgroundColor: "#28a745",
          paddingTop: "2rem",
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Menú principal */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <li>
            <a
              href="/InicioAdmin"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#229954"
                e.target.style.paddingLeft = "1.5rem"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.paddingLeft = "1rem"
              }}
              onClick={() => setIsOpen(false)}
            >
              <Home size={20} color="white" style={{ marginRight: "0.5rem" }} />
              Inicio
            </a>
          </li>

          <li>
            <a
              href="/Programar-Mantenimiento"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#229954"
                e.target.style.paddingLeft = "1.5rem"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.paddingLeft = "1rem"
              }}
              onClick={() => setIsOpen(false)}
            >
              <Wrench size={20} color="white" style={{ marginRight: "0.5rem" }} />
              Mantenimiento
            </a>
          </li>
          <li>
            <a
              href="/Reportes-Administrador"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = " #229954"
                e.target.style.paddingLeft = "1.5rem"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.paddingLeft = "1rem"
              }}
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 size={20} color="white" style={{ marginRight: "0.5rem" }} />
              Reportes
            </a>
          </li>

          <li>
            <a
              href="/Registro-de-Interactivo"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#229954"
                e.target.style.paddingLeft = "1.5rem"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.paddingLeft = "1rem"
              }}
              onClick={() => setIsOpen(false)}
            >
              <Plus size={20} color="white" style={{ marginRight: "0.5rem" }} />
              Registrar Interactivo
            </a>
          </li>

          <li>
            <a
              href="/Usuarios"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#229954"
                e.target.style.paddingLeft = "1.5rem"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.paddingLeft = "1rem"
              }}
              onClick={() => setIsOpen(false)}
            >
              <Users size={20} color="white" style={{ marginRight: "0.5rem" }} />
              Usuarios
            </a>
          </li>
          <li>
            <a
              href="/Salas-del-Museo"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#229954"
                e.target.style.paddingLeft = "1.5rem"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.paddingLeft = "1rem"
              }}
              onClick={() => setIsOpen(false)}
            >
              <ClipboardList size={20} color="white" style={{ marginRight: "0.5rem" }} />
              Interactivos
            </a>
          </li>
          <li>
            <a
              href="/Calendario-Admin"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#229954"
                e.target.style.paddingLeft = "1.5rem"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.paddingLeft = "1rem"
              }}
              onClick={() => setIsOpen(false)}
            >
              <Calendar size={20} color="white" style={{ marginRight: "0.5rem" }} />
              Calendario
            </a>
          </li>

          <li>
            <a
              href="/Perfil-Administrador"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#229954"
                e.target.style.paddingLeft = "1.5rem"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.paddingLeft = "1rem"
              }}
              onClick={() => setIsOpen(false)}
            >
              <User size={20} color="white" style={{ marginRight: "0.5rem" }} />
              Perfil
            </a>
          </li>
        </ul>

        {/* Botón de cerrar sesión en la parte inferior */}
        <div style={{ marginTop: "auto", marginBottom: "20px" }}>
          <button
            onClick={handleLogoutClick}
            style={{
              width: "100%",
              backgroundColor: "#ff0000",
              border: "none",
              color: "white",
              padding: "1rem",
              fontSize: "1rem",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#cc0000"
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#ff0000"
            }}
          >
            <LogOut size={20} color="white" style={{ marginRight: "0.5rem" }} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 900,
          }}
        />
      )}

      {/* Modal de confirmación de cierre de sesión */}
      <Modal show={showLogoutModal} onHide={cancelLogout} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-exclamation-circle me-2"></i>
            Confirmar Cierre de Sesión
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <p className="lead text-center mb-4">¿Estás seguro de que quieres cerrar tu sesión actual?</p>
          <div className="d-flex justify-content-center">
            <i className="bi bi-person-circle text-muted" style={{ fontSize: "4rem" }}></i>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={cancelLogout} disabled={isLoggingOut}>
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmLogout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Cerrando...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
}

export default MenuAdmin
