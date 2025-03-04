import Map from 'ol/Map'
import proj4 from 'proj4'
import View from 'ol/View'
import { defaults } from 'ol/control'
import { register } from 'ol/proj/proj4'
import {
  getLayerByName,
  changeBaseLayer,
  createBaseLayers,
  removeLayerByName,
  changeLayersByNames
} from '@/utils/layer-utils'

proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs')
register(proj4)

export let instance
export const createMapInstance = (config) => {
  const innerConfig = Object.assign(
    {
      zoom: 12,
      maxZoom: 18,
      minZoom: 4,
      baseLayer: 'vec-layer',
      projection: 'EPSG:4490',
      center: [120.188, 30.246],
      tk: 'c77eddc667c5bed016fded560baf93e7'
    },
    config || {}
  )
  const { baseVecLayer, baseCvaLayer, baseImgLayer, baseCiaLayer } =
    createBaseLayers(innerConfig.tk || 'c77eddc667c5bed016fded560baf93e7')

  const layers =
    innerConfig.baseLayer === 'img-layer'
      ? [baseImgLayer, baseCiaLayer]
      : [baseVecLayer, baseCvaLayer]

  if (!instance) {
    instance = new Map({
      layers: layers,
      view: new View(innerConfig),
      controls: defaults({
        attribution: false,
        zoom: false,
        rotate: false
      })
    })
    instance.activeBaseLayer = innerConfig.baseLayer
    instance.getLayerByName = getLayerByName
    instance.changeBaseLayer = changeBaseLayer
    instance.removeLayerByName = removeLayerByName
    instance.changeLayersByNames = changeLayersByNames
    instance.on('pointermove', (evt) => {
      instance.getTargetElement().style.cursor = instance.hasFeatureAtPixel(
        evt.pixel
      )
        ? 'pointer'
        : ''
    })
    return instance
  }
  return instance
}

export const getMapInstance = (config) => createMapInstance(config)

/**
 * 销毁地图实例
 */
export const disposeInstance = () => {
  if (instance) {
    const layers = instance.getAllLayers()
    layers.forEach((layer) => {
      instance.removeLayer(layer)
    })
    instance.setTarget(null)
    instance.dispose()
    instance = null
  }
}
