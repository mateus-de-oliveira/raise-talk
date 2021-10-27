import './styles/mapbox-gl.css'
import './styles/mapbox-gl-geocoder.css'
import React, { useRef, useCallback } from 'react'
import MapGL from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import { usePropertieContext } from '../Propertie/Context'

const MAPBOX_TOKEN =
  'pk.eyJ1IjoicmFpc2UtdGFsayIsImEiOiJja3Y4OWFicWoxd3B4MnVwNjFpbTY1MTZ4In0.hZx5kRFrF0NjWk3AMwljdw'

export default function LocationMap() {
  const { viewport, setViewport } = usePropertieContext()

  const mapRef = useRef()
  const geocoderContainerRef = useRef()

  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport)
  }, [])

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 }

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      })
    },
    [handleViewportChange]
  )

  return (
    <div>
      <div
        ref={geocoderContainerRef}
        style={{
          marginBottom: '10px',
          marginTop: '10px',
          padding: '0 !important',
        }}
      />

      <MapGL
        ref={mapRef}
        {...viewport}
        width='100%'
        height='200px'
        mapStyle='mapbox://styles/mapbox/streets-v11'
        onViewportChange={(value) => {
          handleViewportChange(value)
        }}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <Geocoder
          mapRef={mapRef}
          containerRef={geocoderContainerRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          placeholder='Pesquisar'
        />
      </MapGL>
    </div>
  )
}
