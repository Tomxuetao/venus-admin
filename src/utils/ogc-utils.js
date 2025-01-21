/**
 * 空间数据类型
 * @typedef {Object} GeoData
 * @property {String} id - 唯一标识
 * @property {String} geom - 空间几何
 * @property {String} props - 对象字符串
 */

import TileLayer from 'ol/layer/Tile'
import { TileWMS, WMTS } from 'ol/source'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { GeoJSON, WMTSCapabilities } from 'ol/format'
import { optionsFromCapabilities } from 'ol/source/WMTS'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'

const parser = new WMTSCapabilities()

let capabilities
const getCapabilities = (
  url = '/geoserver/gwc/service/wmts?request=GetCapabilities'
) => {
  return new Promise((resolve) => {
    if (capabilities) {
      resolve(capabilities)
    } else {
      fetch(url)
        .then((data) => data.text())
        .then((text) => {
          resolve(parser.read(text))
        })
    }
  })
}

getCapabilities().then((data) => {
  capabilities = data
})

/**
 * 创建WMS图层
 * @param layerName
 * @returns {TileLayer<TileWMS>}
 */
export const createWmsLayer = (layerName) => {
  return new TileLayer({
    className: layerName,
    source: new TileWMS({
      url: '/geoserver/gwc/service/wms',
      params: {
        TILED: true,
        VERSION: '1.1.1',
        LAYERS: layerName,
        FORMAT: 'image/png'
      }
    })
  })
}

/**
 * 创建WMTS图层
 * @param layerName
 * @returns {Promise<unknown>}
 */
export const createWmtsLayer = async (layerName) => {
  return new Promise((resolve) => {
    getCapabilities().then((data) => {
      resolve(
        new TileLayer({
          className: layerName,
          source: new WMTS(
            optionsFromCapabilities(data, {
              layer: layerName,
              format: 'image/png',
              matrixSet: 'EPSG:4326'
            })
          )
        })
      )
    })
  })
}

/**
 * 创建WFS图层
 * @param layerName
 * @returns {VectorLayer<VectorSource<Geometry>>}
 */
export const createWfsLayer = (layerName) => {
  return new VectorLayer({
    className: layerName,
    source: new VectorSource({
      format: new GeoJSON(),
      strategy: bboxStrategy,
      url: (extent) =>
        `/geoserver/${layerName.split(':')[0]}/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=application/json&srsname=EPSG:4326&bbox=${extent.join(',')},EPSG:4326`
    })
  })
}
