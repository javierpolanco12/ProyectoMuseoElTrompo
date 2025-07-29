"use client"

import { useState, useEffect } from "react"
import logo from "../IMG/logo.jpg"
import Menu from "../menus/MenuUsuario"
import Header from "../headers/header"

const InicioU = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(null)

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  // Función para mostrar notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    
    // Auto-ocultar la notificación después de 5 segundos
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Mostrar notificación de bienvenida al cargar la página
  useEffect(() => {
    // Obtener el rol del usuario (en un caso real, esto vendría de tu sistema de autenticación)
    const userRole = "Usuario" // Esto debería venir de tu sistema de autenticación
    
    // Mostrar notificación de bienvenida
    showNotification(`Bienvenido, ${userRole}!`, "success")
  }, []) // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  return (
    <div style={styles.container}>
      {/* Notificación en la esquina superior derecha */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: notification.type === "success" ? "#28a745" : "#dc3545",
            color: "white",
            padding: "15px 20px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            animation: "slideIn 0.3s ease-out",
            minWidth: "250px",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "500"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
                marginLeft: "10px",
                padding: "0",
                lineHeight: "1"
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Pasamos la función de callback al menú */}

      <Menu onToggle={handleMenuToggle} />

      {/* Header que ocupa todo el ancho  */}

      <Header isMenuOpen={isMenuOpen} />

      <div
        style={{
          ...styles.mainContent,
          marginLeft: isMenuOpen ? "200px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div style={styles.content}>
          <h1>Bienvenido Usuario</h1>
          <p>Esta es la pantalla de inicio de la aplicación.</p>
          <img src={logo || "/placeholder.svg"} alt="Logo de TrompoMaint" style={styles.image} />
        </div>
      </div>

      {/* Estilos CSS para la animación */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  mainContent: {
    width: "100%",
    marginTop: "60px", 
  },
  content: {
    padding: "2rem",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  image: {
    marginTop: "2rem",
    width: "200px",
    height: "auto",
  },
}

export default InicioU