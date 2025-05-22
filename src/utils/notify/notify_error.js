import { Notify } from 'quasar'

const notify_error = (msj) => {
  Notify.create({
    color: 'negative',
    icon: 'error',
    message: msj,
    position: 'bottom',
    timeout: 3000,
  })
}

export default notify_error
