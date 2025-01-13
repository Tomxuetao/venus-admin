<script setup>
import Map from 'ol/Map'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { GeoJSON } from 'ol/format'
import TileLayer from 'ol/layer/Tile'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer } from 'ol/layer'

import { commonApi } from '@/api/common-api'

const route = useRoute()
const getDataList = async (mapInstance) => {
  const dataList = await commonApi(`/geo/data/${route.params.id}`, {
    dilution: 0.0005
  })

  const geojsonObject = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:4326'
      }
    },
    features: dataList.map((item) => {
      return {
        type: 'Feature',
        geometry: JSON.parse(item.geom),
        properties: JSON.parse(item.props)
      }
    })
  }

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject)
    })
  })

  mapInstance.addLayer(vectorLayer)
}

const initMap = async () => {
  return new Map({
    target: 'map',

    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        })
      })
    ],
    view: new View({
      center: [119.666563446, 30.893709739],
      zoom: 12,
      projection: 'EPSG:4326'
    })
  })
}

onMounted(async () => {
  const mapInstance = await initMap()
  await getDataList(mapInstance)
})
</script>

<template>
  <div class="view-map" id="map"></div>
</template>

<style scoped lang="scss">
.view-map {
  height: 100%;
}
</style>
