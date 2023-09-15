import { modules } from "./modules.mjs"
import util from "./util/index.js";
import { request, setAnonymousToken } from "./util/request.js";

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
        return request(...args)
      },
    )
  }
}

export function initAnonymousToken() {
  const res = obj['register_anonimous']()
  const cookie = res.body.cookie
  if (cookie) {
    const cookieObj = util.cookieToJson(cookie)
    setAnonymousToken(cookieObj.MUSIC_A)
  } else {
    console.error('no cookie found in response')
  }
}

export default obj
