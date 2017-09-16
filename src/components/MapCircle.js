import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Circle } from 'react-leaflet'

export default class MapCircle extends Component {
  constructor (props) {
    super(props)
    var { isEditing } = this.props
    this.state = {
      isEditing: isEditing
    }
  }
  render () {
    const { circle, radius } = this.props
    const { isEditing } = this.state
    return (
      <Circle
        center={circle.properties.latLng}
        radius={isEditing ? radius : circle.properties.radius}
      />
    )
  }
}
MapCircle.propTypes = {
  circle: PropTypes.object,
  isEditing: PropTypes.bool,
  radius: PropTypes.number
}
