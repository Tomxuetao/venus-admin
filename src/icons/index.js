const svgFiles = import.meta.glob('./svg/*.svg')

export default {
  // 获取图标icon-(*).svg名称列表, 例如[shouye, xitong, zhedie, ...]
  getNameList () {
    return Object.keys(svgFiles).map(item => item.default.id.replace('icon-', ''))
  }
}
