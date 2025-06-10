"use client"

import { useState } from "react"
import logo from "./IMG/logo.jpg"
import Menu from "../menus/menu"
import Header from "../headers/header"

const Inicio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen)
  }

  return (
    <div style={styles.container}>

      <Menu onToggle={handleMenuToggle} />

      <Header isMenuOpen={isMenuOpen} />

      <div
        style={{
          ...styles.mainContent,
          marginLeft: isMenuOpen ? "200px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div style={styles.content}>
          <h1>Bienvenido</h1>
          <p>Esta es la pantalla de inicio de la aplicación.</p>
          <img src={logo || "/placeholder.svg"} alt="Logo de TrompoMaint" style={styles.image} />
        </div>
      </div>
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

export default Inicio
