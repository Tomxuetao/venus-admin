<script setup>
import { commonApi } from '@/api/common-api'

import CommonMap from '@/components/common-map.vue'
import { getMapInstance } from '@/utils/create-map'
import { removeLayerByName } from '@/utils/layer-utils'
import {
  createWfsLayer,
  createWmsLayer,
  createWmtsLayer
} from '@/utils/ogc-utils'

const activeType = ref('WMS')

const route = useRoute()
const id = route.params.id

const layerTypeMap = new Map([
  ['WMS', createWmsLayer],
  ['WFS', createWfsLayer],
  ['WMTS', createWmtsLayer]
])

const mapInstance = getMapInstance()

let layerName

const getLayerDetail = async () => {
  const detailData = await commonApi(`/geo/layer/${id}`)
  layerName = `${detailData.workspace}:${detailData.name}`
  mapInstance.addLayer(createWmsLayer(layerName))
}

getLayerDetail()

const changeLayer = async (type) => {
  removeLayerByName(layerName)
  const createLayer = layerTypeMap.get(type)
  mapInstance.addLayer(await createLayer(layerName))
}
</script>

<template>
  <div class="map-mod">
    <div class="chang-type">
      <el-select v-model="activeType" @change="(value) => changeLayer(value)">
        <el-option
          v-for="([key], index) in layerTypeMap"
          :key="index"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </div>
    <common-map></common-map>
  </div>
</template>

<style scoped lang="scss">
.map-mod {
  height: 100%;
  position: relative;

  .chang-type {
    width: 240px;
    position: absolute;
    right: 24px;
    top: 24px;
    z-index: 20;
  }
}
</style>
