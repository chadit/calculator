import {LOADING, LOADING_SUCCESS, LOADING_ERROR} from './constants'

/*
  Tip
  ====
  Keep reducers dumb.
  If you need to do any computation or run side effects (ajax request etc) do it in an action creator.

  A reducer maps some kind of data to state
*/

const defaultState = {err: false, isFetching: false, events: []}
const Home = (state = defaultState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        isFetching: action.isFetching,
      }
    case LOADING_SUCCESS:
      return {
        ...state,
        isFetching: action.isFetching,
        events: action.events,
      }
    case LOADING_ERROR:
      return {
        ...state,
        isFetching: action.isFetching,
        err: action.err,
        events: [],
      }
    default:
      return state
  }
}

export default Home