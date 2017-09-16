import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Sidebar, Tab } from 'react-leaflet-sidebarv2'
import PlacesAutocomplete from 'react-places-autocomplete'
import Slider from 'react-rangeslider'
import circleToPolygon from 'circle-to-polygon'
import JSONPretty from 'react-json-pretty'
import CopyToClipboard from 'react-copy-to-clipboard'
import { connect } from 'react-redux'

import { addLocation, removeLocation } from './../actions/index'

import deliveryHeroLogo from '../images/delivery-hero.png'
import 'react-rangeslider/lib/index.css'
import 'react-json-pretty/src/JSONPretty.monikai.css'

class SideBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
      selected: 'home',
      copyValue: '',
      copied: false
    }
    this.handleOpenSideBar = this.handleOpenSideBar.bind(this)
    this.handleCloseSideBar = this.handleCloseSideBar.bind(this)
    this.handleSaveLocation = this.handleSaveLocation.bind(this)
    this.handleRemoveLocation = this.handleRemoveLocation.bind(this)
  }
  handleCloseSideBar () {
    this.setState({ collapsed: true })
  }
  handleOpenSideBar (id) {
    this.setState({
      collapsed: false,
      selected: id
    })
  }
  handleSaveLocation (currentLocation) {
    const { radiusValue } = this.props
    if (currentLocation !== undefined && currentLocation.properties !== undefined) {
      let coordinates = [currentLocation.properties.latLng[1], currentLocation.properties.latLng[0]]
      let radius = radiusValue
      let numberOfEdges = 32
      let polygon = circleToPolygon(coordinates, radius, numberOfEdges)

      var locData = {
        'type': 'Feature',
        'properties': {
          'id': currentLocation.properties.id,
          'stroke': '#2C7DFF',
          'stroke-width': 2,
          'stroke-opacity': 1,
          'fill': '#2C7DFF',
          'fill-opacity': 0.2,
          'address': currentLocation.properties.address,
          'latLng': currentLocation.properties.latLng,
          'radius': radius
        },
        'geometry': {
          'type': 'Polygon',
          'coordinates': polygon.coordinates
        }
      }
      this.props.addLocation(locData)
      this.props.handleCircleEdit()
      this.props.handleClearCurrentLocation()
      this.props.handleErrorMsg('done')
    } else if (this.props.address !== '') {
      this.props.handleErrorMsg('search-btn-err')
    } else {
      this.props.handleErrorMsg('type-and-hit')
    }
  }
  handleRemoveLocation (id) {
    this.props.removeLocation(id)
  }
  render () {
    const {
      geoJsonData,
      locations,
      currentLocation,
      handleFormSubmit,
      inputProps,
      radiusValue,
      handleChangeRadius,
      handleclickLocRadius,
      handleOnPressEnter,
      clickLocRadius,
      handleViewResurantLocation,
      isMouseMarkers,
      errorMsg
    } = this.props

    const GeoJSON = {
      ...geoJsonData,
      'features': [
        ...locations
      ]
    }

    const autocompleteCssClasses = {
      root: this.props.address === '' ? this.props.searchBoxClasses : 'form-group',
      input: 'form-control',
      autocompleteContainer: 'autocomplete-container'
    }
    const copyJSON = window.JSON.stringify(GeoJSON)
    return (
      <Sidebar id='sidebar' collapsed={this.state.collapsed} closeIcon='fa fa-caret-left' selected={this.state.selected}
        onOpen={this.handleOpenSideBar} onClose={this.handleCloseSideBar}>
        <Tab id='home' header='Add Location' icon='fa fa-plus'>
          <div className='tab-body'>
            {
              errorMsg === 'done'
                ? <div className='alert alert-dismissible alert-success' style={{fontSize: '14px'}}>
                  {'Resturant has been added successfully.'}
                </div>
                : ''
            }
            <div className='panel panel-primary'>
              <div className='panel-heading'>
                <h3 className='panel-title'>Location</h3>
              </div>
              <div className='panel-body'>
                <form onSubmit={handleFormSubmit} onKeyDown={handleOnPressEnter} id='search-form'>
                  <PlacesAutocomplete
                    inputProps={inputProps}
                    classNames={autocompleteCssClasses}
                    googleLogo={false}
                  />
                  <button type='submit' className='btn btn-info btn-sm search-btn'>
                    <i className='fa fa-search' aria-hidden='true' />Search
                  </button>
                </form>
                {
                  errorMsg === 'search-btn-err'
                    ? <div className='alert alert-dismissible alert-danger' style={{ fontSize: '14px' }}>
                      {'Click search.'}
                    </div>
                    : errorMsg === 'type-and-hit'
                      ? <div className='alert alert-dismissible alert-danger search-err' style={{ fontSize: '14px' }}>
                        {'Type and select a location, then hit Enter or click search.'}
                      </div>
                      : ''
                }
              </div>
            </div>
            {
              currentLocation !== undefined && currentLocation.properties !== undefined
                ? <div className='panel panel-primary'>
                  <div className='panel-heading'>
                    <h3 className='panel-title'>Radius: {radiusValue} meters</h3>
                  </div>
                  <div className='panel-body'>
                    <div className='slider'>
                      <Slider
                        min={100}
                        max={6000}
                        step={30}
                        value={radiusValue}
                        onChange={handleChangeRadius}
                      />
                    </div>
                  </div>
                </div>
                : ''
            }
            {
              currentLocation !== undefined && currentLocation.properties !== undefined
                ? <button className='btn btn-info btn-sm' onClick={() => { this.handleSaveLocation(currentLocation) }}>Save & Export</button>
                : ''
            }
          </div>
        </Tab>
        <Tab id='Resturants' header='List of Locations' icon='fa fa-map-marker'>
          <div className='tab-body'>
            {
              locations.map((loc, id) => (
                <div key={`cus-marker-${id}`} className='well well-sm location'>
                  <div className='icon'>
                    <img src={deliveryHeroLogo} alt='resturant img' />
                  </div>
                  <div className='name'>
                    {loc.properties.address}
                    <br />
                    <span className='delivery-radius'><i className='fa fa-truck' aria-hidden='true' /> {loc.properties.radius} Meters</span>
                  </div>
                  <div className='loc-target'>
                    <i className='fa fa-map-marker' aria-hidden='true' onClick={() => { handleViewResurantLocation(loc.properties.latLng[0], loc.properties.latLng[1]) }} />
                    <i className='fa fa-trash' aria-hidden='true' onClick={() => { this.handleRemoveLocation(loc.properties.id) }} />
                  </div>
                </div>
              ))
            }
          </div>
        </Tab>
        <Tab id='profile' header='JSON Output' icon='fa fa-code'>
          <div className='tab-body'>
            <CopyToClipboard text={copyJSON}
              onCopy={() => {
                this.setState({ copied: true })
                setTimeout(() => {
                  this.setState({ copied: false })
                }, 2000)
              }}>
              <button className='btn btn-success btn-xs cpy-clipboard'>
                <i className='fa fa-clipboard' aria-hidden='true' />Copy to clipboard
              </button>
            </CopyToClipboard>
            {this.state.copied ? <span className='copied-lbl'>Copied.</span> : null}
            <JSONPretty id='json-pretty' json={GeoJSON} />
          </div>
        </Tab>
        <Tab id='settings' header='Settings' icon='fa fa-cog'>
          <div className='tab-body'>
            <div className='panel panel-primary'>
              <div className='panel-heading'>
                <h3 className='panel-title'>Additional Feature</h3>
              </div>
              <div className='panel-body'>
                <div className='form-group'>
                  <div className='checkbox'>
                    <label>
                      <input
                        type='checkbox'
                        checked={this.props.clickToAdd}
                        onClick={this.props.handleclickToAdd}
                      /> enable click to add
                    </label>
                  </div>
                </div>
                {
                  this.props.clickToAdd
                    ? <div className='alert alert-info' style={{fontSize: '12px'}}>
                      click on the map to add locaions.
                    </div>
                    : ''
                }
                {
                  this.props.clickToAdd && isMouseMarkers
                    ? <div className='slider'>
                      <Slider
                        min={100}
                        max={6000}
                        step={30}
                        value={clickLocRadius}
                        onChange={handleclickLocRadius}
                      />
                      <p style={{textAlign: 'center'}} >{clickLocRadius} Meters</p>
                    </div>
                    : ''
                }

                <div className='well well-sm' style={{ fontSize: '12px', marginBottom: '0' }}>
                  <strong>Note:</strong> locations that added by this feature do not get exported to GeoJSON Output.
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Sidebar>
    )
  }
}

SideBar.propTypes = {
  handleFormSubmit: PropTypes.func,
  inputProps: PropTypes.object,
  geoJsonData: PropTypes.object,
  currentLocation: PropTypes.object,
  radiusValue: PropTypes.number,
  clickLocRadius: PropTypes.number,
  addLocation: PropTypes.func,
  handleChangeRadius: PropTypes.func,
  handleCircleEdit: PropTypes.func,
  handleOnPressEnter: PropTypes.func,
  handleErrorMsg: PropTypes.func,
  handleclickToAdd: PropTypes.func,
  handleclickLocRadius: PropTypes.func,
  removeLocation: PropTypes.func,
  handleClearCurrentLocation: PropTypes.func,
  handleViewResurantLocation: PropTypes.func,
  errorMsg: PropTypes.string,
  searchBoxClasses: PropTypes.string,
  address: PropTypes.string,
  clickToAdd: PropTypes.bool,
  isMouseMarkers: PropTypes.bool,
  locations: PropTypes.array
}

const mapStateToProps = state => ({ locations: state.locations })

const mapDispatchToProps = dispatch => {
  return {
    addLocation: (location) => dispatch(addLocation(location)),
    removeLocation: (id) => dispatch(removeLocation(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
