import * as types from './constants'
import fetch from '../shared/fetch'

/*
  Any actions dispatched are sent to all reducers. Think of it as "broadcasting" events...

  Actions return the "type" of action it is as well as any other data you want to pass to a reducer.
*/

export const loading = () => {
  return {
    type: types.LOADING,
    isFetching: true,
  }
}

export const loadingSuccess = events => {
  return {
    type: types.LOADING_SUCCESS,
    isFetching: false,
    events,
  }
}

export const loadingFailure = err => {
  return {
    type: types.LOADING_ERROR,
    isFetching: false,
    err,
  }
}

export const loadEvents = () => async dispatch => {
  dispatch(loading())

  const onError = err => {
    dispatch(loadingFailure(err))
    return []
  }

  try {
    // fetch request is handled by custom redux middleware
    const req = await dispatch(fetch('/events', {method: 'GET'}))

    if (req.ok) {
      const resp = await req.json()
      const events = resp.results

      dispatch(loadingSuccess(events))

      return events
    }

    return onError(req.statusText)
  } catch (e) {
    return onError(e)
  }
}