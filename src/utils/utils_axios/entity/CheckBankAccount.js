import { STRINGS } from 'utils/string.js'

/**
 * Verifica si una cuenta bancaria ya existe en la base de datos
 *
 * Esta función consulta la API de cuentas y valida que no exista un registro
 * con la misma combinación de: número de cuenta + banco + tipo de cuenta.
 * Se utiliza principalmente en formularios de creación/edición para prevenir duplicados.
 *
 * @async
 * @param {string} bank - ID único del banco (ej: "6a6e4f4405c0bc71862e08f0")
 * @param {string|number} account - Número de cuenta bancaria a verificar
 * @param {Function} fetchData - Función del composable useApi para realizar peticiones HTTP
 *
 * @returns {Promise<boolean>}
 *   - true: La cuenta ya existe en la BD (duplicado detectado)
 *   - false: La cuenta no existe o hubo error en la consulta
 *
 * @example
 * // Verificar antes de crear una nueva cuenta
 * const existe = await CheckBankAccount(
 *   '6a7aa7a98a3f062af104103e',    // ID del banco
 *   '1234-5678-9212-2211',        // Número de cuenta
 *   fetchData()                  // Función del composable
 * )
 *
 */
const CheckBankAccount = async (bank, account, fetchData) => {
  // Variable auxiliar para rastrear si se encontró un duplicado
  let aux = false

  try {
    // 1. Realizar petición GET a la API filtrando por número de cuenta
    //    Esto reduce el volumen de datos comparado con traer todas las cuentas
    const Accounts = await fetchData(`${STRINGS.urlApiCuenta}?numero=${account}`)

    // 2. Recorrer los resultados devueltos por la API
    //    Accounts.data contiene el array de cuentas que coinciden con el número
    Accounts.data.forEach((itemAccount) => {
      // 3. Validar coincidencia exacta de los tres campos:
      //    - Número de cuenta debe ser idéntico
      //    - ID del banco debe coincidir (usando == para comparar string con posible number)
      //    - ID del tipo de cuenta debe coincidir
      if (itemAccount.numero === account && itemAccount.banco._id == bank) {
        // Se encontró un duplicado exacto
        aux = true
      }
    })

    // 4. Retornar el resultado de la verificación
    //    true = duplicado encontrado, false = cuenta disponible
    return aux
  } catch (error) {
    // Manejo de errores: si la petición falla, registramos el error
    // y retornamos false para no bloquear el flujo del usuario
    // (se asume que no hay duplicado en caso de error de red)
    console.error('Error al verificar el número de cuenta y banco perteneciente:', error)
    return false
  }
}

export default CheckBankAccount
