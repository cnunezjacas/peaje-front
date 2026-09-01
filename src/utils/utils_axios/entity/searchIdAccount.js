/**
 * @module searchIdAccount
 * @description Utilidad para validar la existencia y tipo de cuentas bancarias
 * Realiza una búsqueda en cascada: primero la cuenta por número, luego valida su tipo
 * Retorna un objeto estructurado con el ID encontrado y estado de validación
 */

import { STRINGS } from 'utils/string.js'

/**
 * Verifica si un número de cuenta existe y si está asociado a un tipo específico
 *
 * Flujo de validación:
 * 1. Busca la cuenta por número en la API
 * 2. Obtiene el ID del tipo de cuenta asociado (puede venir populado o como string)
 * 3. Consulta el tipo de cuenta para obtener su código
 * 4. Compara el código obtenido con el esperado
 *
 * @async
 * @param {string} accountNumber - Número de cuenta a validar (ej: '9876-1234-5678-9012')
 * @param {string} accountTypeCode - Código del tipo de cuenta esperado (ej: 'CUP', 'CUC')
 * @param {Function} fetchData - Función del composable useApi para realizar peticiones GET
 *
 * @returns {Promise<{id: string|null, isValidType: boolean, message: string}>}
 *   - id: ID de la cuenta si existe, null si no
 *   - isValidType: true si el tipo coincide con el esperado
 *   - message: Mensaje descriptivo del resultado (vacío si todo es válido)
 *
 * @example
 * const { fetchData } = useApi()
 * const result = await searchIdAccount('9876-1234-5678-9012', 'CUP', fetchData)
 *
 * if (result.isValidType) {
 *   // Usar result.id para asociar la cuenta
 *   console.log('Cuenta válida con ID:', result.id)
 * } else {
 *   notify_error(result.message)
 * }
 */
export const searchIdAccount = async (accountNumber, accountTypeCode, fetchData) => {
  // Validación temprana de parámetros requeridos
  if (!accountNumber || !accountTypeCode || !fetchData) {
    return {
      id: null,
      isValidType: false,
      message: 'Parámetros incompletos para validar la cuenta.',
    }
  }

  try {
    // 1. Construir URL con query params codificados para evitar inyección
    const urlCuentas = `${STRINGS.urlApiCuenta}?numero=${encodeURIComponent(accountNumber)}`

    const { data: cuentas, error: errorCuentas } = await fetchData(urlCuentas)

    // Validar respuesta de la API
    if (errorCuentas || !cuentas?.length) {
      return {
        id: null,
        isValidType: false,
        message: 'La cuenta no está registrada en el sistema.',
      }
    }

    // 2. Buscar coincidencia exacta del número (comparación normalizada con trim)
    //    No asumir cuentas[0] porque podrían existir múltiples resultados parciales
    const cuentaEncontrada = cuentas.find(
      (c) => String(c.numero).trim() === String(accountNumber).trim(),
    )

    if (!cuentaEncontrada) {
      return {
        id: null,
        isValidType: false,
        message: 'La cuenta no está registrada en el sistema.',
      }
    }

    const { _id: cuentaId, tipo: tipoCuenta } = cuentaEncontrada

    // 3. Extraer ID del tipo de cuenta (maneja ambos casos: populado y sin populado)
    //    - Si viene populado: tipoCuenta es objeto { _id, codigo, ... }
    //    - Si no viene populado: tipoCuenta es string con el ObjectId
    const tipoCuentaId = typeof tipoCuenta === 'object' ? tipoCuenta._id : tipoCuenta

    // 4. Consultar el tipo de cuenta específico para obtener su código
    const { data: tipoCuentaData, error: errorTipo } = await fetchData(
      `${STRINGS.urlApiTipoCuenta}/${tipoCuentaId}`,
    )

    if (errorTipo || !tipoCuentaData) {
      return {
        id: cuentaId,
        isValidType: false,
        message: 'No se pudo validar el tipo de cuenta.',
      }
    }

    // 5. Validar coincidencia exacta del código (comparación normalizada)
    const isValidType = String(tipoCuentaData.codigo).trim() === String(accountTypeCode).trim()

    return {
      id: cuentaId,
      isValidType,
      message: isValidType ? '' : `El número de cuenta no está registrado como ${accountTypeCode}.`,
    }
  } catch (error) {
    // Manejo centralizado de errores inesperados
    console.error('❌ Error en searchIdAccount:', {
      accountNumber,
      accountTypeCode,
      error: error.message,
      status: error.response?.status,
    })

    return {
      id: null,
      isValidType: false,
      message: 'Error al validar la cuenta. Intente nuevamente.',
    }
  }
}

export default searchIdAccount
