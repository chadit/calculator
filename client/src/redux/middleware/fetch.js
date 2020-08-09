const rootUrl = process.env.REACT_APP_API_URL

export default fetchImplementation => store => next => action => {
  if (action.type === 'FETCH') {
    let { params, url } = action, fetchOptions
    const fullUrl = `${rootUrl}${url}`
    // const token = store.getState().auth.session.token || ''

    // if post body is passed in make sure it is json
    if (typeof params.body !== 'string') {
      params.body = JSON.stringify(params.body)
    }

    // if we don't need cors disable mode
    if (params.method !== 'GET') {
      fetchOptions = Object.assign(params, {
        mode: 'cors',
        // headers: {'x-access-token': token, 'Access-Control-Allow-Origin':'', 'Content-Type':'application/json'}
      })
    } else {
      fetchOptions = Object.assign(params, {
        mode: 'cors',
        // headers: {'x-access-token': token, 'Access-Control-Allow-Origin':''}
      })
    }

    return fetchImplementation(fullUrl, fetchOptions)
  } else {
    return next(action)
  }
}