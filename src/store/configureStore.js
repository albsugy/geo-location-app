import { createStore, compose, combineReducers } from 'redux'

import { locationsReducer, GeoJSONReducer } from './../reducers/index'

export var configure = () => {
  var reducer = combineReducers(
    {
      locations: locationsReducer,
      GeoJSON: GeoJSONReducer
    }
  )

  var store = createStore(reducer, compose(window.devToolsExtension
    ? window.devToolsExtension()
    : f => f))

  return store
}
