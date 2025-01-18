import { unzipSync } from 'fflate'

/**
 * 验证是否为单shp压缩包
 * @param zipFile
 * @param extNames
 * @returns {Promise<boolean>}
 */
export const validateIsSingleShpZip = async (
  zipFile,
  extNames = ['.shp', '.dbf', '.shx', '.prj', '.cpg']
) => {
  const arrayBuffer = await zipFile.arrayBuffer()
  const zipCtx = unzipSync(new Uint8Array(arrayBuffer))
  const fileNames = Object.keys(zipCtx)
  console.log(fileNames)
  const shpFiles = fileNames.filter(
    (fileName) =>
      fileName.toLowerCase().endsWith('.shp') || fileName.includes('/')
  )
  if (shpFiles.length !== 1) {
    return false
  }
  const shpName = shpFiles[0].toLowerCase().replace('.shp', '')
  const count = fileNames.filter((fileName) =>
    fileName.toLowerCase().startsWith(shpName)
  ).length
  if (count !== fileNames.length) {
    return false
  }
  return fileNames.some((fileName) =>
    extNames.some((extName) => fileName.toLowerCase().endsWith(extName))
  )
}
