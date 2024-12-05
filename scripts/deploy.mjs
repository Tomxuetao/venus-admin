import { execa } from 'execa'

const hosts = ['124.221.201.64', '101.35.244.65']

const pkgName = 'venus-admin'
const tempName = 'temp'
const backName = 'back'
const targetDir = '/data/front'
const timestamp = Date.now()

const build = () => execa('vite', ['build'], {
  stdio: 'inherit'
})

const update = async (host) => await execa('ssh', [`root@${host}`, `mv ${targetDir}/${tempName} ${targetDir}/${pkgName}`], { stdio: 'inherit' })

const push = async (host) => await execa('rsync', ['-ah', '--progress', `${pkgName}/`, `root@${host}:${targetDir}/${tempName}`], { stdio: 'inherit' })

const back = async (host) => await execa('ssh', [`root@${host}`, `mv ${targetDir}/${pkgName}/ ${targetDir}/${backName}/${pkgName}-${timestamp}`], { stdio: 'inherit' })


const deploy = async (hostList) => {
  console.info('开始打包')
  await build()
  console.info('打包完成')
  for (const host of hostList) {
    console.info(`开始推送包到:服务器<${host}>临时目录${targetDir}/${tempName}`)
    await push(host)
    console.info(`开始备份服务器<${host}>历史包文件<${targetDir}/${pkgName}>到<${targetDir}/${backName}>`)
    await back(host)
    console.info(`开始更新服务器<${host}>临时目录<${targetDir}/${tempName}>到${targetDir}/${pkgName}`)
    await update(host)
  }
}

deploy(hosts).then(() => {
  console.info('部署完成')
})
