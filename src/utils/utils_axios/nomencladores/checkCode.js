// utils/verificarCodigo.js
import api from 'src/axios.js'

/**
 * Función genérica para verificar si un valor ya existe en una API.
 * @param {string} url - La URL de la API a consultar.
 * @param {string} campo - El campo del objeto en response.data a verificar.
 * @param {any} valor - El valor a buscar en ese campo.
 * @returns {boolean} - true si existe, false si no.
 */
const verificarExistente = async (url, campo, valor) => {
  try {
    const response = await api.get(url)
    return response.data.some((element) => element[campo] === valor)
  } catch (error) {
    console.error(error)
    return false
  }
}

export default verificarExistente
