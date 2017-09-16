// ADD_LOCATION Action
export const addLocation = location => {
  return {
    type: 'ADD_LOCATION',
    location
  }
}
// REMOVE_LOCATION Action
export function removeLocation (id) {
  return { type: 'REMOVE_LOCATION', id }
};
// ADD_LOCATIONS_SET Action
export const addLocationsSet = (resturants) => ({
  type: 'ADD_LOCATIONS_SET',
  resturants
})
