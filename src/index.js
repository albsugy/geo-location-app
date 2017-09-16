import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { configure } from './store/configureStore'

import { setResturantsRequest, getResturantsRequest } from './api/LocationsAPI'
import { defaultResturants } from './api/data'
import { addLocationsSet } from './actions'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

// Store
var store = configure()

// Initialize
let initailResturants = getResturantsRequest()
store.dispatch(addLocationsSet(initailResturants))

// Set Default Values
if (window.localStorage.getItem('resturants') === null) {
  store.dispatch(addLocationsSet(defaultResturants))
}

// const unsubscribe =
store.subscribe(() => {
  const state = store.getState()
  // console.log(state)
  setResturantsRequest(state.locations)
})
// unsubscribe(); 

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'))
registerServiceWorker()
