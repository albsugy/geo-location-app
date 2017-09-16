import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map, Marker, Popup, TileLayer, ZoomControl, GeoJSON, Circle } from 'react-leaflet'
import { connect } from 'react-redux'
import uuid from 'uuid/v1'

import L from 'leaflet'
import MapCircle from '../components/MapCircle'

// Markers icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  iconUrl: require('../images/pin.png'),
  iconRetinaUrl: require('../images/pin-2x.png'),
  shadowUrl: require('../images/pin-shadow.png')
})

class AppMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      markers: [],
      currentID: 0
    }
    this.handleAddLocationByClick = this.handleAddLocationByClick.bind(this)
  }
  handleAddLocationByClick (e) {
    const { markers } = this.state
    const { clickToAdd, clickLocRadius } = this.props
    let id = uuid()
    if (clickToAdd) {
      markers.push(
        {
          id,
          position: e.latlng,
          radius: clickLocRadius,
          circle: e.latlng
        }
      )
      if (this.state.markers.length > 1) {
        let currentClickLocs = this.state.markers.filter(mrk => {
          return mrk.id === this.state.currentID
        })
        currentClickLocs[0].radius = clickLocRadius
      }
      this.setState({ markers, currentID: id })
    } else {
      return false
    }
    if (this.state.markers.length > 0) {
      this.props.handleisMouseMarkers()
    }
  }
  render () {
    const {
      geoJsonData,
      radiusValue,
      lat,
      lng,
      zoom,
      locations,
      handleOnMapMoveEnd,
      clickToAdd,
      isEditing
    } = this.props

    const currentClickLocs = this.state.markers.filter(mrk => {
      return mrk.id === this.state.currentID
    })
    let mapClass = clickToAdd ? 'ClickToAdd' : 'app-map'
    const map = (
      <Map center={[lat, lng]} zoom={zoom} zoomControl={false} onClick={this.handleAddLocationByClick} ref='map'
        onMoveEnd={() => { handleOnMapMoveEnd(this.refs.map) }} className={mapClass}>
        <ZoomControl position='topright' />

        { // Click Markers
          this.state.markers.slice(0, this.state.markers.length - 1).map((mrk, idx) =>
            <Marker key={`marker-${idx}`} position={mrk.position}>
              <Popup>
                <span>Custom Resturant location <br /> Created by clicking.</span>
              </Popup>
            </Marker>
          )
        }
        { // Click Circles
          this.state.markers.slice(0, this.state.markers.length - 1).map((mrk, idx) =>
            <Circle
              key={`circle-${idx}`}
              center={mrk.circle}
              radius={mrk.radius}
            />
          )
        }

        { // currentClickLocs Marker
          currentClickLocs.map((mrk, idx) =>
            <Marker key={`marker-${idx}`} position={mrk.position}>
              <Popup>
                <span>Custom Resturant location <br /> Created by clicking.</span>
              </Popup>
            </Marker>
          )
        }
        { // currentClickLocs Circle
          currentClickLocs.map((mrk, idx) =>
            <Circle
              key={`circle-${idx}`}
              center={mrk.circle}
              radius={this.props.clickLocRadius}
            />
          )
        }
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <GeoJSON data={geoJsonData} />
        {
          geoJsonData.features.map((marker, idx) =>
            <Marker key={`marker-${idx}`} position={marker.properties.latLng}>
              <Popup>
                <span>{marker.properties.address}</span>
              </Popup>
            </Marker>
          )
        }
        {
          geoJsonData.features.map((circle, idx) =>
            <MapCircle
              key={`circle-${idx}`}
              circle={circle}
              radius={radiusValue}
              isEditing={isEditing}
            />
          )
        }
        {
          locations.map((marker, idx) =>
            <Marker key={`marker-${idx}`} position={marker.properties.latLng}>
              <Popup>
                <div>
                  <span>{marker.properties.address}</span>
                  <br />
                  <span className='delivery-radius' style={{marginTop: '5px', display: 'inline-block'}} >
                    <i className='fa fa-truck' aria-hidden='true' /> {marker.properties.radius} Meters
                  </span>
                </div>
              </Popup>
            </Marker>
          )
        }
        {
          locations.map((circle, idx) =>
            <MapCircle
              key={`circle-${idx}`}
              circle={circle}
              radius={radiusValue}
            />
          )
        }
      </Map>
    )
    return map
  }
}

AppMap.propTypes = {
  geoJsonData: PropTypes.object,
  radiusValue: PropTypes.number,
  locations: PropTypes.array,
  lat: PropTypes.number,
  lng: PropTypes.number,
  clickLocRadius: PropTypes.number,
  isEditing: PropTypes.bool,
  clickToAdd: PropTypes.bool,
  handleOnMapMoveEnd: PropTypes.func,
  handleisMouseMarkers: PropTypes.func,
  zoom: PropTypes.number
}

const mapStateToProps = state => ({ locations: state.locations })

export default connect(mapStateToProps)(AppMap)
