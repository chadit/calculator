// log redux state before and after state transitions
export default store => next => action => {
  if (process.env.NODE_ENV === 'development') {
    console.log('dispatching', action)
  }

  const result = next(action)

  if (process.env.NODE_ENV === 'development') {
    console.log('next state', store.getState())
  }

  return result
}
