import { Notify } from 'quasar'

export function useNotify() {
  const notify_error = async (msj) => {
    Notify.create({
      color: 'negative',
      icon: 'error',
      message: msj,
      position: 'bottom',
      timeout: 3000,
    })
  }

  const notify_success = async (msj) => {
    Notify.create({
      color: 'positive', // color verde para éxito
      icon: 'check_circle',
      message: msj,
      position: 'top',
      timeout: 3000,
    })
  }

  const notify_warning = async (msj) => {
    Notify.create({
      color: 'warning', // color verde para éxito
      icon: 'error',
      message: msj,
      position: 'top',
      timeout: 3000,
    })
  }

  return { notify_error, notify_success, notify_warning }
}
