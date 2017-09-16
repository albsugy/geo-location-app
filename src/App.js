import React, { Component } from 'react'
import { geocodeByAddress } from 'react-places-autocomplete'
import circleToPolygon from 'circle-to-polygon'
import uuid from 'uuid/v1'

import AppMap from './containers/Map'
import SideBar from './components/SideBar'

import './styles/main.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      geoJsonData: {
        'type': 'FeatureCollection',
        'features': []
      },
      currentLocation: {},
      address: '',
      radiusValue: 100,
      lat: 52.5247258,
      lng: 13.39303289999998,
      zoom: 13,
      isEditing: true,
      searchBoxClasses: 'form-group',
      clickToAdd: false,
      errorMsg: '',
      isMouseMarkers: false,
      clickLocRadius: 100
    }
    this.handleOnPressEnter = this.handleOnPressEnter.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.onChange = (address) => this.setState({ address })
    this.handleChangeRadius = this.handleChangeRadius.bind(this)
    this.handleCircleEdit = this.handleCircleEdit.bind(this)
    this.handleErrorMsg = this.handleErrorMsg.bind(this)
    this.handleClearCurrentLocation = this.handleClearCurrentLocation.bind(this)
    this.handleclickToAdd = this.handleclickToAdd.bind(this)
    this.handleclickLocRadius = this.handleclickLocRadius.bind(this)
    this.handleViewResurantLocation = this.handleViewResurantLocation.bind(this)
    this.handleOnMapMoveEnd = this.handleOnMapMoveEnd.bind(this)
    this.handleisMouseMarkers = this.handleisMouseMarkers.bind(this)
  }
  handleOnPressEnter (event) {
    var keyCode = event.which || event.keyCode
    if (keyCode === 13) {
      this.handleFormSubmit(event)
    }
  }
  handleFormSubmit (event) {
    event.preventDefault()
    if (this.state.address !== '') {
      geocodeByAddress(this.state.address)
        .then(results => {
          return new Promise((resolve, reject) => {
            try {
              const datas = {
                latLng: {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                },
                address: results[0].formatted_address
              }
              resolve(datas)
            } catch (e) {
              reject(e)
            }
          })
        })
        .then(
          (datasResults) => {
            let id = uuid()
            let coordinates = [datasResults.latLng.lng, datasResults.latLng.lat] // [lng, lat]
            let radius = this.state.radiusValue // in meters
            const numberOfEdges = 32
            let polygon = circleToPolygon(coordinates, radius, numberOfEdges)
            this.setState({
              lat: datasResults.latLng.lat,
              lng: datasResults.latLng.lng,
              zoom: 14,
              geoJsonData: {
                ...this.state.geoJsonData,
                'features': [
                  {
                    'type': 'Feature',
                    'properties': {
                      'id': id,
                      'stroke': '#555555',
                      'stroke-width': 2,
                      'stroke-opacity': 1,
                      'fill': '#555555',
                      'fill-opacity': 0.5,
                      'address': datasResults.address,
                      'latLng': [
                        datasResults.latLng.lat,
                        datasResults.latLng.lng
                      ],
                      'pos': [coordinates[1], coordinates[0]],
                      'radius': radius
                    },
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': polygon.coordinates
                    }
                  }
                ]
              },
              currentLocation: {
                'type': 'Feature',
                'properties': {
                  'id': id,
                  'stroke': '#2C7DFF',
                  'stroke-width': 2,
                  'stroke-opacity': 1,
                  'fill': '#2C7DFF',
                  'fill-opacity': 0.2,
                  'address': datasResults.address,
                  'latLng': [
                    datasResults.latLng.lat,
                    datasResults.latLng.lng
                  ],
                  'pos': [coordinates[1], coordinates[0]],
                  'radius': radius
                },
                'geometry': {
                  'type': 'Polygon',
                  'coordinates': polygon.coordinates
                }
              }
            })
            this.handleErrorMsg('')
          }
        )
        .catch(error => console.error('Error', error))
    } else {
      this.setState({
        searchBoxClasses: 'form-group has-error'
      })
      this.handleErrorMsg('type-and-hit')
      return false
    }
  }
  handleChangeRadius (value) {
    let loc = this.state.currentLocation
    let {address} = this.state
    this.setState({
      radiusValue: value,
      geoJsonData: {
        ...this.state.geoJsonData,
        'features': [
          {
            ...this.state.geoJsonData.features[0],
            'properties': {
              ...this.state.geoJsonData.features[0].properties,
              'radius': this.state.radiusValue
            }
          }
        ]
      }
    })
    if (Object.keys(loc).length > 0 && loc.constructor === Object) {
      this.setState({
        radiusValue: value
      })
    } else if (Object.keys(loc).length === 0 && loc.constructor === Object && address !== '') {
      this.handleErrorMsg('search-btn-err')
    } else {
      this.handleErrorMsg('type-and-hit')
      this.setState({
        searchBoxClasses: 'form-group has-error'
      })
    }
  }
  handleclickLocRadius (value) {
    if (this.state.clickToAdd) {
      this.setState({
        clickLocRadius: value
      })
    }
  }
  handleCircleEdit () {
    this.setState({
      isEditing: false,
      address: '',
      radiusValue: 100,
      geoJsonData: {
        'type': 'FeatureCollection',
        'features': []
      }

    })
  }
  handleErrorMsg (msg) {
    this.setState({
      errorMsg: msg
    })
    if (msg === 'done') {
      setTimeout(() => {
        this.setState({ errorMsg: '' })
      }, 4000)
    }
  }
  handleClearCurrentLocation () {
    this.setState({
      currentLocation: {},
      searchBoxClasses: 'form-group'
    })
  }
  handleclickToAdd () {
    this.setState({
      clickToAdd: !this.state.clickToAdd
    })
  }
  handleViewResurantLocation (lat, lng) {
    this.setState({
      lat,
      lng
    })
  }
  handleOnMapMoveEnd (map) {
    let lat = map.viewport.center[0]
    let lng = map.viewport.center[1]
    let zoom = map.viewport.zoom
    this.setState({
      lat,
      lng,
      zoom
    })
  }
  handleisMouseMarkers () {
    this.setState({
      isMouseMarkers: true
    })
  }
  render () {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange
    }
    const { lat, lng, zoom, address } = this.state

    return (
      <div className='App'>

        <AppMap
          lat={lat}
          lng={lng}
          zoom={zoom}
          geoJsonData={this.state.geoJsonData}
          addMarker={this.addMarker}
          radiusValue={this.state.radiusValue}
          isEditing={this.state.isEditing}
          clickToAdd={this.state.clickToAdd}
          clickLocRadius={this.state.clickLocRadius}
          mouseMarkers={this.state.mouseMarkers}
          handleOnMapMoveEnd={this.handleOnMapMoveEnd}
          handleisMouseMarkers={this.handleisMouseMarkers}
        />

        <SideBar
          geoJsonData={this.state.geoJsonData}
          currentLocation={this.state.currentLocation}
          handleFormSubmit={this.handleFormSubmit}
          inputProps={inputProps}
          address={address}
          radiusValue={this.state.radiusValue}
          handleChangeRadius={this.handleChangeRadius}
          handleCircleEdit={this.handleCircleEdit}
          handleErrorMsg={this.handleErrorMsg}
          errorMsg={this.state.errorMsg}
          searchBoxClasses={this.state.searchBoxClasses}
          handleClearCurrentLocation={this.handleClearCurrentLocation}
          handleOnPressEnter={this.handleOnPressEnter}
          clickLocRadius={this.state.clickLocRadius}
          mouseMarkers={this.state.mouseMarkers}
          handleclickLocRadius={this.handleclickLocRadius}
          clickToAdd={this.state.clickToAdd}
          handleclickToAdd={this.handleclickToAdd}
          handleViewResurantLocation={this.handleViewResurantLocation}
          isMouseMarkers={this.state.isMouseMarkers}
        />
      </div>
    )
  }
}

export default App
