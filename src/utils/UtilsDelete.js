import { STRINGS } from './string'

const UtilsDelete = (category, row) => {
  switch (category) {
    /* ======================== // NOMENCLADORES // ======================== */

    case STRINGS.provinciaLowercase:
      return row.nombre

    case STRINGS.municipioLowercase:
      return row.nombre

    case STRINGS.organismoLowercase:
      return row.siglas

    case STRINGS.tipoCuentaLowercaseURL:
      return row.codigo

    case STRINGS.bancoLowercase:
      return row.codigo

    case STRINGS.monedasLowercase:
      return row.siglas

    case STRINGS.vehiculosLowercase:
      return row.nombre

    case STRINGS.exentoLowercase:
      return row.nombre

    case STRINGS.comprobanteLowercase:
      return row.nombre

    case STRINGS.formaDePagoLowercaseURL:
      return row.descripcion

    /* ======================== // ENTIDADES // ======================== */

    case STRINGS.cuentaLowercase:
      return row.numero

    default:
      return ''
  }
}

export { UtilsDelete }
