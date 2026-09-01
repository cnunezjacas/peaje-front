/**
 * Función genérica para verificar si un valor ya existe en una API
 *
 * @async
 * @param {string} url - La URL de la API a consultar (ej: '/api/v1/manage/provincia')
 * @param {string} campo - El campo del objeto a verificar (ej: 'codigo', 'nombre')
 * @param {string|number} valor - El valor a buscar en ese campo
 * @param {Function} fetchData - Función del composable useApi para realizar peticiones GET
 *
 * @returns {Promise<boolean>} true si el valor existe, false si no existe o hay error
 *
 * @example
 * // Verificar si un código de provincia ya existe
 * const { fetchData } = useApi()
 * const result = await CheckField(
 *   '/api/v1/manage/provincia',
 *   'codigo',
 *   '33',
 *   fetchData
 * )
 *
 * if (result) {
 *   notify_error('El código ya existe')
 * }
 */
const CheckField = async (url, campo, valor, fetchData) => {
  // Validar parámetros requeridos
  if (!url || !campo || valor === undefined || !fetchData) {
    console.error('CheckField: Parámetros incompletos', { url, campo, valor, fetchData })
    return false
  }

  try {
    const { data, error } = await fetchData(url)

    if (!data && error) {
      console.error('Error en fetchData', error)
      return false
    }

    return data.some((element) => element[campo] == valor)
  } catch (error) {
    console.error('Error en CheckField:', error)
    return false
  }
}

export default CheckField
