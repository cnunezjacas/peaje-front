//Función para realizar el Capitalize del nombre del organismo
function capitalizeWords(str) {
  return str
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word // Por si hay cadenas vacías
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

export default { capitalizeWords }
