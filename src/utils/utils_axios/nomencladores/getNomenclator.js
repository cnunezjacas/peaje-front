/**
 * @module getNomenclator
 * @description Módulo de utilidades para cargar datos de nomencladores desde la API
 * Proporciona funciones que consultan endpoints y retornan datos formateados
 * en estructura { label, value } para uso en selects y componentes Quasar
 */

import { useApi } from 'src/composables/useApi'
import { STRINGS } from 'src/utils/string'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { /*notify_success,*/ notify_warning /*, notify_error*/ } = useNotify()
const { fetchData } = useApi()

/**
 * Carga todas las provincias disponibles en el sistema
 * @async
 * @returns {Promise<Array<{label: string, value: string}>>} Array de provincias formateadas para select
 * @example
 * const provincias = await loadProvincias()
 * // Retorna: [{ label: 'Provincia A', value: 'id_1' }, ...]
 */
const loadProvincias = async () => {
  const { data, error } = await fetchData(STRINGS.urlApiProvincia)

  // Validar que la petición fue exitosa
  if (!data || error) {
    console.error('Error al cargar provincias:', error)
    return []
  }

  const result = data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))
  return result
}

/**
 * Carga todos los municipios disponibles en el sistema
 * @async
 * @returns {Promise<Array<{label: string, value: string}>>} Array de municipios formateados para select
 */
const loadMunicipios = async () => {
  const { data, error } = await fetchData(STRINGS.urlApiMunicipio)

  // Validar que la petición fue exitosa
  if (!data || error) {
    console.error('Error al cargar municipios:', error)
    return []
  }

  const result = data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))

  return result
}

/**
 * Carga todos los organismos disponibles en el sistema
 * @async
 * @returns {Promise<Array<{label: string, value: string}>>} Array de organismos formateados (usa siglas como label)
 */
const loadOrganismo = async () => {
  const { data, error } = await fetchData(STRINGS.urlApiOrganismo)

  // Validar que la petición fue exitosa
  if (!data || error) {
    console.error('Error al cargar organismos:', error)
    return []
  }

  const result = data.map((element) => ({
    label: element['siglas'],
    value: element['_id'],
  }))

  return result
}

/**
 * Carga todas las monedas disponibles en el sistema
 * @async
 * @returns {Promise<Array<{label: string, value: string}>>} Array de monedas formateadas (usa siglas como label)
 */
const loadCoins = async () => {
  const { data, error } = await fetchData(STRINGS.urlApiMoneda)

  // Validar que la petición fue exitosa
  if (!data || error) {
    console.error('Error al cargar monedas:', error)
    return []
  }

  const result = data.map((element) => ({
    label: element['siglas'],
    value: element['_id'],
  }))

  return result
}

/**
 * Carga todos los bancos disponibles en el sistema
 * @async
 * @returns {Promise<Array<{label: string, value: string}>>} Array de bancos formateados (usa código como label)
 */
const LoadBank = async () => {
  const { data, error } = await fetchData(STRINGS.urlApiBanco)

  // Validar que la petición fue exitosa
  if (!data || error) {
    console.error('Error al cargar bancos:', error)
    return []
  }

  const result = data.map((element) => ({
    label: element['codigo'],
    value: element['_id'],
  }))

  return result
}

/**
 * Carga todos los tipos de cuenta disponibles en el sistema
 * @async
 * @returns {Promise<Array<{label: string, value: string}>>} Array de tipos de cuenta formateados (usa código como label)
 */
const LoadTypeAccount = async () => {
  const { data, error } = await fetchData(STRINGS.urlApiTipoCuenta)

  // Validar que la petición fue exitosa
  if (!data || error) {
    console.error('Error al cargar los tipos de cuenta:', error)
    return []
  }

  const result = data.map((element) => ({
    label: element['codigo'],
    value: element['_id'],
  }))

  return result
}

/**
 * Carga municipios filtrados por provincia específica
 * @async
 * @param {Object} provinciaObjet - Objeto con la provincia seleccionada
 * @param {string} provinciaObjet.label - Nombre de la provincia (para mensajes)
 * @param {string} provinciaObjet.value - ID de la provincia para filtrar
 * @param {boolean} [returnObjectMunicipio=true] - Flag para controlar el tipo de retorno
 * @returns {Promise<boolean|Array<{label: string, value: string}>>}
 *   - Si returnObjectMunicipio=true: retorna array de municipios o false si no hay
 *   - Si returnObjectMunicipio=false: retorna true si hay municipios, false si no hay
 * @example
 * // Modo listado (retorna array)
 * const municipios = await loadMunicipiosByProvincia({ label: 'Granma', value: 'id_prov' }, true)
 *
 * // Modo validación (retorna boolean)
 * const tieneMunicipios = await loadMunicipiosByProvincia({ label: 'Granma', value: 'id_prov' }, false)
 */
const loadMunicipiosByProvincia = async (provinciaObjet, returnObjectMunicipio = true) => {
  const { data, error } = await fetchData(STRINGS.urlApiMunicipio)

  // Validar que la petición fue exitosa
  if (!data || error) {
    console.error('Error al cargar municipios:', error)
    return returnObjectMunicipio ? false : []
  }

  // Filtrar municipios que pertenecen a la provincia especificada
  const result = data
    .filter((item) => item.provincia._id === provinciaObjet.value)
    .map((element) => ({
      label: element['nombre'],
      value: element['_id'],
    }))

  // Comportamiento según el flag returnObjectMunicipio
  if (returnObjectMunicipio) {
    // Modo listado: retornar array de municipios
    // Si no hay municipios, mostrar advertencia y retornar false
    if (result.length === 0) {
      notify_warning(STRINGS.NoLoadMunicipality + ' ' + provinciaObjet.label)
      return false
    }
    return result
  } else {
    // Modo validación: retornar boolean indicando si existen municipios
    return result.length !== 0 ? true : false
  }
}

export default {
  loadOrganismo,
  loadProvincias,
  loadMunicipios,
  loadMunicipiosByProvincia,
  loadCoins,
  LoadBank,
  LoadTypeAccount,
}
