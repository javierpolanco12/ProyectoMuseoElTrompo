"use client"

import React, { useState } from "react"

const MenuUsuario = () => {
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
          top: "10px",
          left: isOpen ? "210px" : "10px",
          zIndex: 1030,
          transition: "left 0.3s ease",
        }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Menú lateral */}
      <aside
        style={{
          width: "200px",
          backgroundColor: "#333",
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
              href="#inicio"
              style={{
                display: "block",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
              }}
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#mantenimientos"
              style={{
                display: "block",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
              }}
              onClick={() => setIsOpen(false)}
            >
              Mantenimientos
            </a>
          </li>
          <li>
            <a
              href="#reportes"
              style={{
                display: "block",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
              }}
              onClick={() => setIsOpen(false)}
            >
              Reportes
            </a>
          </li>
          <li>
            <a
              href="#perfil"
              style={{
                display: "block",
                color: "white",
                textDecoration: "none",
                padding: "1rem",
                fontSize: "1rem",
              }}
              onClick={() => setIsOpen(false)}
            >
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
              backgroundColor: "#d9534f",
              border: "none",
              color: "white",
              padding: "1rem",
              fontSize: "1rem",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
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
            backgroundColor: "rgba(0,0,0,0.4)",
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
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
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

export default MenuUsuario