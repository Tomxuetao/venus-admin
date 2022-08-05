import { readFileSync, readdirSync } from 'fs'

const svgTitle = /<svg([^>+].*?)>/
const clearHeightWidth = /(width|height)="([^>+].*?)"/g

const hasViewBox = /(viewBox="[^>+].*?")/g

const clearReturn = /(\r)|(\n)/g

function findSvgFile(dir) {
  const svgRes = []
  const directoryList = readdirSync(dir, { withFileTypes: true })
  for (const directory of directoryList) {
    if (directory.isDirectory()) {
      svgRes.push(...findSvgFile(dir + directory.name + '/'))
    } else {
      const svg = readFileSync(dir + directory.name)
        .toString()
        .replace(clearReturn, '')
        .replace(svgTitle, ($1, $2) => {
          let width = 0
          let height = 0
          let content = $2.replace(
            clearHeightWidth,
            (s1, s2, s3) => {
              if (s2 === 'width') {
                width = s3
              } else if (s2 === 'height') {
                height = s3
              }
              return ''
            }
          )
          if (!hasViewBox.test($2)) {
            content += `viewBox="0 0 ${width} ${height}"`
          }
          return `<symbol id="${directory.name.replace('.svg', '')}" ${content}>`
        }).replace('</svg>', '</symbol>')
      svgRes.push(svg)
    }
  }
  return svgRes
}

export const BuilderSvg = (path) => {
  if (path) {
    const svgFileList = findSvgFile(path)
    return {
      name: 'svg-transform',
      transformIndexHtml(html) {
        return html.replace('<body>', `<body><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">${svgFileList.join('')}</svg>`)
      }
    }
  }
}
