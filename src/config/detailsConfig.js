import { STRINGS } from 'utils/string.js'

export const DETAILS_CONFIG = {
  /* ============================================ */
  // ==== NOMENCLADORES ====
  /* ============================================ */
  provincia: {
    key: STRINGS.provinciaLowercase,
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.provinciaLowercase.toUpperCase()}`,
    icon: 'bi-geo-alt-fill',
    minWidth: '300px',
    fields: [
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
      { key: 'codigo', label: STRINGS.code.toUpperCase() },
    ],
  },
  municipio: {
    key: STRINGS.municipality.toLowerCase(),
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.municipality.toUpperCase()}`,
    icon: 'bi-geo-alt',
    minWidth: '300px',
    fields: [
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
      { key: 'codigo', label: STRINGS.code.toUpperCase() },
      { key: 'label_provincia', label: STRINGS.province.toUpperCase() },
    ],
  },
  organismo: {
    key: STRINGS.organismoLowercase,
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.body.toUpperCase()}`,
    icon: 'bi-building',
    minWidth: '600px',
    fields: [
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
      { key: 'siglas', label: STRINGS.acronym.toUpperCase() },
    ],
  },
  banco: {
    key: STRINGS.bancoLowercase,
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.bank.toUpperCase()}`,
    icon: 'bi-bank',
    minWidth: '600px',
    fields: [
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
      { key: 'codigo', label: STRINGS.acronym.toUpperCase() },
      { key: 'detalles', label: STRINGS.details.toUpperCase() },
    ],
  },
  tipoCuenta: {
    key: STRINGS.tipoCuentaLowercaseURL.toLowerCase(),
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.type_of_account.toUpperCase()}`,
    icon: 'bi-credit-card',
    minWidth: '600px',
    fields: [
      { key: 'codigo', label: STRINGS.code.toUpperCase() },
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
    ],
  },
  moneda: {
    key: STRINGS.currency.toLowerCase(),
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.currency.toUpperCase()}`,
    icon: 'bi-coin',
    minWidth: '600px',
    fields: [
      { key: 'siglas', label: STRINGS.acronym.toUpperCase() },
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
      {
        key: 'tasa',
        label: STRINGS.tasa_de_Cambio.toUpperCase(),
        format: (val) => formatCurrency(val),
      },
      { key: 'nomenclador', label: STRINGS.nomenclator.toUpperCase() },
      { key: 'moneda', label: STRINGS.moneda_base.toUpperCase() },
      { key: 'condor', label: STRINGS.id_condor.toUpperCase() },
    ],
  },
  vehiculo: {
    key: STRINGS.vehiculosLowercase,
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.vehiculosLowercase.toUpperCase()}`,
    icon: 'bi-car-front',
    minWidth: '500px',
    fields: [
      { key: 'codigo', label: STRINGS.code.toUpperCase() },
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
      {
        key: 'tasa',
        label: STRINGS.tasa_de_peajes.toUpperCase(),
        format: (val) => formatCurrency(val),
      },
      { key: 'nomenclador', label: STRINGS.nomenclator.toUpperCase() },
    ],
  },
  exento: {
    key: STRINGS.exentoLowercase,
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.exempt.toUpperCase()}`,
    icon: 'bi-collection',
    minWidth: '500px',
    fields: [
      { key: 'codigo', label: STRINGS.code.toUpperCase() },
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
      { key: 'nomenclador', label: STRINGS.nomenclator.toUpperCase() },
      { key: 'detalles', label: STRINGS.details.toUpperCase() },
    ],
  },
  comprobante: {
    key: STRINGS.voucher.toLowerCase(),
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.voucher.toUpperCase()}`,
    icon: 'bi-receipt-cutoff',
    minWidth: '500px',
    fields: [
      { key: 'codigo', label: STRINGS.code.toUpperCase() },
      { key: 'nombre', label: STRINGS.name.toUpperCase() },
      { key: 'valor', label: STRINGS.valor.toUpperCase(), format: (val) => formatCurrency(val) },
      { key: 'moneda', label: STRINGS.currency.toUpperCase() },
    ],
  },
  formaDePago: {
    key: STRINGS.formaDePagoLowercaseURL.toLowerCase(),
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.formaDePagoLowercase.toUpperCase()}`,
    icon: 'bi-cash-coin',
    minWidth: '500px',
    fields: [
      { key: 'descripcion', label: STRINGS.descripcion.toUpperCase() },
      { key: 'nomenclador', label: STRINGS.nomenclator.toUpperCase() },
      { key: 'detalles', label: STRINGS.details.toUpperCase() },
    ],
  },

  /* ============================================ */
  // ==== ENTIDADES ====
  /* ============================================ */
  estaciones: {
    key: STRINGS.estacionesLowercase,
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.name_estaciones.toUpperCase()}`,
    icon: 'location_city',
    minWidth: '600px',
    fields: [
      { key: 'nombre', label: STRINGS.name },
      { key: 'codigo', label: STRINGS.code },
      { key: 'direccion', label: STRINGS.adress },
      { key: 'provincia', label: STRINGS.province },
      { key: 'municipio', label: STRINGS.municipality },
      { key: 'nit', label: STRINGS.nit, format: (val) => val?.toLocaleString() },
      { key: 'cuentaCuc', label: STRINGS.cuentaCUC },
      { key: 'cuentaCup', label: STRINGS.cuentaCUP },
      {
        key: 'telefonos',
        label: STRINGS.phone,
        format: (val) => (Array.isArray(val) ? val.join(', ') : val),
      },
    ],
  },

  cuenta: {
    key: STRINGS.account.toLowerCase(),
    title: `${STRINGS.details.toUpperCase()} - ${STRINGS.account.toUpperCase()}`,
    icon: 'bi-person-lines-fill',
    minWidth: '600px',
    fields: [
      { key: 'titular', label: STRINGS.titular_de_la_cuenta },
      { key: 'numero', label: STRINGS.cuenta },
      { key: 'banco', label: STRINGS.bancoCuenta },
      { key: 'tipo', label: STRINGS.type_of_account },
    ],
  },
  // ... agregar más entidades aquí
}

// Helpers de formato
/* const formatBankCard = (val) => {
  if (!val) return '-'
  const str = String(val).replace(/[^0-9]/g, '')
  return str.match(/.{1,4}/g)?.join('-') || val
} */

const formatCurrency = (val) => {
  if (!val) return '-'
  const result = String(val + ' $')
  return result
}

// Función para obtener config por ruta
export const getDetailsConfig = (routePath) => {
  const path = routePath.toLowerCase()
  //alert(path)
  return Object.values(DETAILS_CONFIG).find((cfg) => path.includes(cfg.key)) || null
}
