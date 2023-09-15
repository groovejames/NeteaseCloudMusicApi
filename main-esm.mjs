import { modules } from "./modules.mjs"
import util from './util/index.js'
import generateConfig from './generateConfig.js'
import request from './util/request.js'

let firstRun = true
let obj = {}

for (const file of modules.reverse()) {
  const fileModule = (await import(new URL("module/" + file, import.meta.url))).default
  const fn = file.split('.').shift() || ''
  obj[fn] = function(data = {}) {
    if (typeof data.cookie === 'string') {
      data.cookie = util.cookieToJson(data.cookie)
    }
    return fileModule(
      {
        ...data,
        cookie: data.cookie ? data.cookie : {},
      },
      async (...args) => {
        if (firstRun) {
          firstRun = false
          await generateConfig()
        }
        return request(...args)
      },
    )
  }
}

export default obj
