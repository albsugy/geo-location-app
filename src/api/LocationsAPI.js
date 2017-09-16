export const setResturantsRequest = (resturants) => {
  if (Array.isArray(resturants)) {
    window.localStorage.setItem('resturants', JSON.stringify(resturants))
    return resturants
  }
}

export const getResturantsRequest = () => {
  let stringResturants = window.localStorage.getItem('resturants')
  let resturants = []

  try {
    resturants = window.JSON.parse(stringResturants)
  } catch (e) { }

  return Array.isArray(resturants)
    ? resturants
    : []
}
