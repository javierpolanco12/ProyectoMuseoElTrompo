"use client"

import React, { useState } from "react"
import { Home, Wrench, BarChart3, Plus, Users, ClipboardList, Calendar, User, LogOut } from "lucide-react"

const MenuAdmin = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  
  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    setShowLogoutModal(false)
    console.log("Cerrando sesión...")

    // Redireccionar al login 
    window.location.href = "/" // Cambia esta ruta según tu estructura
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  return (
    <React.Fragment>
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
              href="/Registro-de-Usuarios"
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
              href="/Lista-de-interactivos"
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
              Lista Interactivo
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

        {/* Botón de cerrar sesión en la parte inferior ----
        Los Metodos de implementacion son fundamentales para poder llevar acabo diferentes metodos
        Finalmente las personas tratan de llevar acabo las cosas de las demas personas pero como es que las  */}

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
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "300px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Cerrar Sesión</h3>
            <p>¿Seguro que quieres cerrar sesión?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={cancelLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                No
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default MenuAdmin
