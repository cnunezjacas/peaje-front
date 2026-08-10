// utils/validators/searchIdAccount.js
import { STRINGS } from 'utils/string.js'
import { useApi } from 'src/composables/useApi'

/**
 * Verifica si un número de cuenta existe y si está asociado a un tipo específico
 * @param {string} accountNumber - Número de cuenta a validar
 * @param {string} accountTypeCode - Código del tipo de cuenta (ej: 'CORRIENTE')
 * @returns {Promise<{id: string|null, isValidType: boolean, message: string}>}
 */
export const searchIdAccount = async (accountNumber, accountTypeCode) => {
  // Validación temprana
  if (!accountNumber || !accountTypeCode) {
    return {
      id: null,
      isValidType: false,
      message: 'Parámetros incompletos para validar la cuenta.',
    }
  }

  try {
    // 🔥 1. Construir URL con query params CORRECTAMENTE (sin barra extra)
    const urlCuentas = `${STRINGS.urlApiCuenta}?numero=${encodeURIComponent(accountNumber)}`

    const { fetchData } = useApi()
    const { data: cuentas, error: errorCuentas } = await fetchData(urlCuentas)

    // Si hay error o no hay resultados
    if (errorCuentas || !cuentas?.length) {
      return {
        id: null,
        isValidType: false,
        message: 'La cuenta no está registrada en el sistema.',
      }
    }

    // 🔥 2. Buscar EXACTAMENTE la cuenta con ese número (no asumir [0])
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

    const { _id: cuentaId, tipo: tipoCuentaId } = cuentaEncontrada

    // 🔥 3. Consultar el tipo de cuenta específico
    const { data: tipoCuenta, error: errorTipo } = await fetchData(
      `${STRINGS.urlApiTipoCuenta}/${tipoCuentaId}`,
    )

    if (errorTipo || !tipoCuenta) {
      return {
        id: cuentaId,
        isValidType: false,
        message: 'No se pudo validar el tipo de cuenta.',
      }
    }

    // 🔥 4. Validar coincidencia exacta de código
    const isValidType = String(tipoCuenta.codigo).trim() === String(accountTypeCode).trim()

    return {
      id: cuentaId,
      isValidType,
      message: isValidType ? '' : `El número de cuenta no está registrado como ${accountTypeCode}.`,
    }
  } catch (error) {
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
