// Locations Reducer
export const locationsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_LOCATION':
      return [
        ...state,
        action.location
      ]
    case 'REMOVE_LOCATION': {
      return state.filter((location) => location.properties.id !== action.id)
    }
    case 'EDIT_LOCATION': {
      return [
        ...state.slice(0, action.id),
        action.userInfo,
        ...state.slice(action.id + 1)
      ]
    }
    case 'ADD_LOCATIONS_SET': {
      return [...action.resturants]
    }
    default:
      return state
  }
}

const GeoJsonData = {}

// GeoJSON Reducer
export const GeoJSONReducer = (state = GeoJsonData, action) => {
  switch (action.type) {
    case 'ADD_LOCATIONS_TO_GEOJSON':
      return {
        ...state,
        locations: [...action.locations]
      }
    default:
      return state
  }
}
