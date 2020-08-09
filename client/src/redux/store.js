import {createStore, applyMiddleware, compose} from 'redux'
import createHistory from 'history/createBrowserHistory'
import {routerMiddleware} from 'react-router-redux'
import rootReducer from './rootReducer'
import thunk from 'redux-thunk'

// middleware
import fetchMiddleware from './middleware/fetch'
import logMiddleware from './middleware/logger'
import crashMiddleware from './middleware/crash'

const history = createHistory()
const enhancers = []
let middleware = [
  thunk,
  crashMiddleware,
  fetchMiddleware(window.fetch),
  routerMiddleware(history),
]

// if in dev env setup redux development tools and logging middleware
if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }

  middleware = [
    thunk,
    crashMiddleware,
    logMiddleware,
    fetchMiddleware(window.fetch),
    routerMiddleware(history),
  ]
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(rootReducer, composedEnhancers)

export {history}
export default store
