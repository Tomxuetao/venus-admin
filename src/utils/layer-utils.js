import { WMTS } from 'ol/source'
import { GeoJSON, WKB } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { instance } from '@/utils/create-map'
import WebGLTileLayer from 'ol/layer/WebGLTile'

const matrixIds = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19'
]
const resolutions = [
  0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
  0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625,
  0.0006866455078125, 0.00034332275390625, 0.000171661376953125,
  0.0000858306884765625, 0.00004291534423828125, 0.000021457672119140625,
  0.000010728836059570312, 0.000005364418029785156, 0.000002682209014892578
]

const createBaseLayer = (
  layerName,
  className,
  tk = 'c77eddc667c5bed016fded560baf93e7'
) => {
  const [name, matrixSet] = layerName.split('_')
  return new WebGLTileLayer({
    className: className,
    cacheSize: 20240,
    source: new WMTS({
      crossOrigin: 'anonymous',
      projection: 'EPSG:4490',
      wrapX: true,
      layer: name,
      style: 'default',
      version: '1.0.0',
      format: 'image/png',
      matrixSet: matrixSet,
      tileGrid: new WMTSTileGrid({
        matrixIds: matrixIds,
        origin: [-180.0, 90.0],
        resolutions: resolutions
      }),
      url: `https://t{0-7}.tianditu.gov.cn/${layerName}/wmts?tk=${tk}`
    }),
    zIndex: -1
  })
}

export const createBaseLayers = (tk) => {
  return {
    // 矢量图层
    baseVecLayer: createBaseLayer('vec_c', 'vec-layer', tk),

    // 矢量注记
    baseCvaLayer: createBaseLayer('cva_c', 'vec-layer', tk),

    // 影像图层
    baseImgLayer: createBaseLayer('img_c', 'img-layer', tk),

    // 影像注记
    baseCiaLayer: createBaseLayer('cia_c', 'img-layer', tk)
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
