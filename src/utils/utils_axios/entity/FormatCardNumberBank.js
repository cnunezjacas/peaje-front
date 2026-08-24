/**
 * Formatea un número de tarjeta bancaria al formato estándar con guiones
 * Convierte "9876123221232131" o "9876-1232-2123-2131" a "9876-1232-2123-2131"
 *
 * @param {string} cardNumber - Número de tarjeta (con o sin guiones)
 * @returns {string} Número formateado con guiones cada 4 dígitos
 *
 * @example
 * formatCardNumber("9876123221232131")  // → "9876-1232-2123-2131"
 * formatCardNumber("9876-1232-2123-2131")  // → "9876-1232-2123-2131" (sin cambios)
 * formatCardNumber("9876 1232 2123 2131")  // → "9876-1232-2123-2131" (también limpia espacios)
 */
const FormatCardNumberBank = async (cardNumber) => {
  // 1. Limpiar el input: eliminar guiones, espacios y cualquier caracter no numérico
  const cleanNumber = cardNumber.replace(/[^\d]/g, '')

  // 2. Dividir en grupos de 4 dígitos y unir con guiones
  //    match(/.{1,4}/g) crea un array: ["9876", "1232", "2123", "2131"]
  //    join('-') los une con guiones: "9876-1232-2123-2131"

  const result = cleanNumber.match(/.{1,4}/g)?.join('-') || ''

  return result
}

export default FormatCardNumberBank
