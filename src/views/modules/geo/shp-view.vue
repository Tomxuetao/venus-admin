<script setup>
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'
import { getMapInstance } from '@/utils/create-map'
import {
  createGeoJsonLayer,
  createWkbLayer,
  removeLayerByName
} from '@/utils/layer-utils'

let controller
const route = useRoute()

const mapInstance = getMapInstance()

const id = route.params.id
const dataTypeMap = new Map([
  ['WKB', { url: `/geo/data/wkb/${id}`, createLayer: createWkbLayer }],
  ['GeoJson', { url: `/geo/data/${id}`, createLayer: createGeoJsonLayer }],
  [
    'Dilution GeoJson',
    { url: `/geo/data/dilution/${id}`, createLayer: createGeoJsonLayer }
  ],
  [
    'GeoTools Dilution GeoJson',
    { url: `/geo/data/dilution2/${id}`, createLayer: createGeoJsonLayer }
  ]
])

const activeType = ref('WKB')

const getDataList = async (type = 'WKB') => {
  activeType.value = type
  controller = new AbortController()
  removeLayerByName(id)
  const { url, createLayer } = dataTypeMap.get(type)
  const dataList = await commonApi(
    url,
    {
      accuracy: 0.0002
    },
    { signal: controller.signal }
  )
  if (dataList.length === 0) {
    ElMessage({
      message: '数据为空',
      type: 'error',
      duration: 1500
    })
  } else {
    const vectorLayer = createLayer(dataList, { layerName: id })
    mapInstance.getView().fit(vectorLayer.getSource().getExtent(), {
      size: mapInstance.getSize(),
      padding: [50, 50, 50, 50]
    })
    mapInstance.addLayer(vectorLayer)
  }
}

onMounted(() => {
  getDataList()
})

onUnmounted(() => {
  controller?.abort()
})
</script>

<template>
  <div class="map-mod">
    <div class="chang-type">
      <el-select v-model="activeType" @change="(value) => getDataList(value)">
        <el-option
          v-for="item in dataTypeMap.keys()"
          :key="item"
          :label="item"
          :value="item"
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
