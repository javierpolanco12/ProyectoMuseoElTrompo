import logo from "../IMG/logo3.png"; 

const Header = () => {
  return (
    <header
      style={{
        ...styles.topbar,
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 900,
      }}
    >
      <div style={styles.headerContent}>
        <img
          src={logo}
          alt="Logo El Trompo"
          style={styles.logo}
        />
        <h2 style={styles.title}>El Trompo Museo Interactivo</h2>
      </div>
    </header>
  );
};

const styles = {
  topbar: {
    backgroundColor: "#6f42c1", // morado
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.75rem", // espacio entre el logo y el texto
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logo: {
    width: "30px",
    height: "auto",
  },
  title: {
    margin: 0,
    color: "#fff",
    fontSize: "1.5rem",
  },
};

export default Header;
