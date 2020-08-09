// catch exceptions that occured when dispatching in redux
export default store => next => action => {
  try {
    return next(action)
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Exception Caught: ', err)
      throw err
    } else if (process.env.NODE_ENV === 'production') {
      // Todo: - hookup analytics here
    }
  }
}