const fs = require('fs')
const path = require('path')

const moduleFile = path.join(__dirname, 'modules.mjs')
fs.writeFileSync(moduleFile, 'export const modules = [\n')

const moduleDir = path.join(__dirname, 'module')
fs.readdirSync(moduleDir).forEach((file) => {
  if (!file.endsWith('.js')) return
  fs.appendFileSync(moduleFile, `  '${file}',\n`)
})

fs.appendFileSync(moduleFile, ']\n')
