import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'
import { GeoJSON, WKB } from 'ol/format'
import VectorSource from 'ol/source/Vector'
import { instance } from '@/utils/create-map'
import { Vector as VectorLayer } from 'ol/layer'

export const createBaseLayers = (tk) => {
  return {
    // 影像图层
    baseImgLayer: new TileLayer({
      className: 'img-layer',
      source: new XYZ({
        crossOrigin: 'anonymous',
        tileSize: 256,
        url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${tk}`
      }),
      zIndex: -1
    }),

    // 影像注记
    baseCiaLayer: new TileLayer({
      className: 'img-layer',
      source: new XYZ({
        crossOrigin: 'anonymous',
        tileSize: 256,
        url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${tk}`
      }),
      zIndex: -1
    }),

    // 矢量图层
    baseVecLayer: new TileLayer({
      className: 'vec-layer',
      source: new XYZ({
        crossOrigin: 'anonymous',
        tileSize: 256,
        url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${tk}`
      }),
      zIndex: -1
    }),

    // 矢量注记
    baseCvaLayer: new TileLayer({
      className: 'vec-layer',
      source: new XYZ({
        crossOrigin: 'anonymous',
        tileSize: 256,
        url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${tk}`
      }),
      zIndex: -1
    })
  }
}

/**
 * 切换底图
 * @param map
 */
export const changeBaseLayer = (map = instance) => {
  const allLayers = map.getAllLayers()
  const { baseImgLayer, baseCiaLayer, baseVecLayer, baseCvaLayer } =
    createBaseLayers('c77eddc667c5bed016fded560baf93e7')
  const { activeBaseLayer } = map
  const tempLayers = allLayers.filter(
    (item) => item.getClassName() === activeBaseLayer
  )
  tempLayers.forEach((layer) => {
    map.removeLayer(layer)
  })
  if (activeBaseLayer === 'img-layer') {
    map.addLayer(baseVecLayer)
    map.addLayer(baseCvaLayer)
    map.activeBaseLayer = 'vec-layer'
  } else {
    map.addLayer(baseImgLayer)
    map.addLayer(baseCiaLayer)
    map.activeBaseLayer = 'img-layer'
  }
}

/**
 * 根据图层名称获取图层
 * @param name
 * @returns {any}
 */
export const getLayerByName = (name) => {
  return instance.getAllLayers().find((item) => item.getClassName() === name)
}

/**
 * 根据图层名称删除图层
 * @param name
 */
export const removeLayerByName = (name) => {
  const tempLayer = instance
    .getAllLayers()
    .find((item) => item.getClassName() === name)
  if (tempLayer) {
    instance.removeLayer(tempLayer)
  }
}

/**
 * 切换图层的显示、隐藏
 * @param activeNames
 * @param allLayerNames
 */
export const changeLayersByNames = (activeNames, allLayerNames) => {
  const changeLayers = instance
    .getAllLayers()
    .filter((item) => allLayerNames?.includes(item.getClassName()))

  changeLayers.forEach((layer) => {
    layer.setVisible(activeNames?.includes(layer.getClassName()))
  })
}

/**
 * 创建WKB图层
 * @param {GeoData[]} dataList - 数据列表
 * @param config - 配置项
 */
export const createWkbLayer = (dataList, config = {}) => {
  const format = new WKB()
  const featureList = []
  try {
    dataList.forEach((item) => {
      const feature = format.readFeature(item.geom.replaceAll('\\x', ''))
      feature.set('data', JSON.parse(item.props))
      featureList.push(feature)
    })
  } catch (error) {
    console.error(error)
  }
  const { layerName } = config || { layerName: 'ol-layer' }
  return new VectorLayer({
    className: layerName ? layerName : 'ol-layer',
    source: new VectorSource({
      features: featureList
    })
  })
}

/**
 * 创建GeoJson图层
 * @param {GeoData[]} dataList - 数据列表
 * @param config - 配置项
 */
export const createGeoJsonLayer = (dataList, config = {}) => {
  const geoJsonStr = {
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
  const { layerName } = config || { layerName: 'ol-layer' }
  return new VectorLayer({
    className: layerName ? layerName : 'ol-layer',
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geoJsonStr)
    })
  })
}
