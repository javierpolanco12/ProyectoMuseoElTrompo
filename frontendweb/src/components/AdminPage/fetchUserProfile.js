// src/components/AdminPage/fetchUserProfile.js

// Función para obtener el ID del usuario logueado
const getLoggedInUserId = () => {
  try {
    const userSession =
      JSON.parse(localStorage.getItem("userSession")) || JSON.parse(sessionStorage.getItem("userSession"))
    return userSession?.id
  } catch (e) {
    console.error("Error al parsear la sesión del usuario:", e)
    return null
  }
}

// Función para obtener los datos combinados de usuario y perfil
export const fetchUserProfile = async () => {
  const userId = getLoggedInUserId()

  if (!userId) {
    throw new Error("No hay usuario logueado.")
  }

  try {
    // 1. Obtener datos del usuario
    const userResponse = await fetch(`http://127.0.0.1:8000/api/usuarios/${userId}/`)
    if (!userResponse.ok) {
      throw new Error(`Error al cargar datos del usuario: ${userResponse.statusText}`)
    }
    const userData = await userResponse.json()

    // 2. Obtener datos del perfil asociados a este usuario
    const profileResponse = await fetch(`http://127.0.0.1:8000/api/perfiles/?usuario=${userId}`)
    if (!profileResponse.ok) {
      throw new Error(`Error al cargar datos del perfil: ${profileResponse.statusText}`)
    }
    const profiles = await profileResponse.json()
    const userProfile = profiles.find((p) => p.usuario === userId) // Asegurarse de que es el perfil correcto

    // 3. Combinar los datos
    const combinedData = {
      ...userData,
      nombre_completo: userProfile?.nombre_completo || "",
      telefono: userProfile?.telefono || "",
      foto_url: userProfile?.foto_url || "",
      direccion: userProfile?.direccion || "",
      fecha_nacimiento: userProfile?.fecha_nacimiento || "",
      genero: userProfile?.genero || "",
      perfilId: userProfile?.id || null, // Guardar el ID del perfil para futuras actualizaciones
    }

    return combinedData
  } catch (error) {
    console.error("Error en fetchUserProfile:", error)
    throw error // Re-lanzar el error para que el componente lo maneje
  }
}
