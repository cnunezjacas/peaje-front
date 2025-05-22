import { Notify } from 'quasar'

const notify_success = (msj) => {
  Notify.create({
    color: 'positive', // color verde para éxito
    icon: 'check_circle',
    message: msj,
    position: 'top',
    timeout: 3000,
  })
}

export default notify_success
