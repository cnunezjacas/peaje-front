import api from 'src/axios'
import { STRINGS } from 'src/utils/string'
import notify_warning from 'src/utils/notify/notify_warning'

const loadOrganismo = async () => {
  const response = await api.get(STRINGS.urlApiOrganismo)
  const options = response.data.map((element) => ({
    label: element['siglas'],
    value: element['_id'],
  }))
  return options
}

const loadProvincias = async () => {
  const response = await api.get(STRINGS.urlApiProvincia)
  const options = response.data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))
  return options
}

const loadCoins = async () => {
  const response = await api.get(STRINGS.urlApiMoneda)
  const options = response.data.map((element) => ({
    label: element['siglas'],
    value: element['_id'],
  }))
  return options
}

const loadMunicipios = async () => {
  const response = await api.get(STRINGS.urlApiMunicipio)
  const options = response.data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))
  return options
}

const loadMunicipiosByProvincia = async (newVal, opcional = true) => {
  const response = await api.get(STRINGS.urlApiMunicipio)

  const options = response.data
    .filter((item) => item['provincia'] === newVal.value)
    .map((element) => ({
      label: element['nombre'],
      value: element['_id'],
    }))

  if (opcional)
    if (options.length === 0) notify_warning(STRINGS.NoLoadMunicipality + ' ' + newVal.label)

  return options
}

export default {
  loadOrganismo,
  loadProvincias,
  loadMunicipios,
  loadMunicipiosByProvincia,
  loadCoins,
}
