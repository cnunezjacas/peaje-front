const getPath = (route) => {
  const current_route = route.fullPath
  if (typeof current_route !== 'string') {
    console.warn('route.fullPath no es un string:', current_route)
    return []
  }
  return current_route.split('/')
}

export { getPath }
