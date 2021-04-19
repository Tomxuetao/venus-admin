const svgFiles = import.meta.glob('./svg/*.svg')

export default {
  getNameList () {
    console.log(svgFiles)
    return Object.keys(svgFiles).map(item => item.replace('./svg/', '').replace('icon-', '').replace('.svg', ''))
  }
}
