import { Notify } from 'quasar'

const notify_success = (msj) => {
  Notify.create({
    color: 'warning', // color verde para éxito
    icon: 'error',
    message: msj,
    position: 'top',
    timeout: 3000,
  })
}

export default notify_success
