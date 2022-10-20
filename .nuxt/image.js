import Vue from 'vue'
import { createImage} from '~image'
import NuxtImg from '~image/components/nuxt-img.vue'
import NuxtPicture from '~image/components/nuxt-picture.vue'

import * as staticRuntime$102a from 'C:/Dev/airbnb_clone/node_modules/@nuxt/image/dist/runtime/providers/static.js'
import * as cloudinaryRuntime$13c4 from 'C:/Dev/airbnb_clone/node_modules/@nuxt/image/dist/runtime/providers/cloudinary.js'
import * as ipxRuntime$bd1e from 'C:/Dev/airbnb_clone/node_modules/@nuxt/image/dist/runtime/providers/ipx.js'

const imageOptions = {
  "screens": {
    "xs": 320,
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "xxl": 1536,
    "2xl": 1536
  },
  "presets": {},
  "provider": "ipx",
  "domains": [],
  "alias": {}
}

imageOptions.providers = {
  ['static']: { provider: staticRuntime$102a, defaults: {} },
  ['cloudinary']: { provider: cloudinaryRuntime$13c4, defaults: {"baseURL":"https://res.cloudinary.com/simuniver/image/upload/"} },
  ['ipx']: { provider: ipxRuntime$bd1e, defaults: {} }
}

Vue.component(NuxtImg.name, NuxtImg)
Vue.component(NuxtPicture.name, NuxtPicture)
Vue.component('NImg', NuxtImg)
Vue.component('NPicture', NuxtPicture)

export default function (nuxtContext, inject) {
  const $img = createImage(imageOptions, nuxtContext)

  if (process.static && process.server) {
    nuxtContext.beforeNuxtRender(({ nuxtState }) => {
      const ssrData = nuxtState.data[0] || {}
      ssrData._img = nuxtState._img || {}
    })
  }

  inject('img', $img)
}
