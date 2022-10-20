import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6c1e6255 = () => interopDefault(import('..\\pages\\admin.vue' /* webpackChunkName: "pages/admin" */))
const _8e5813a2 = () => interopDefault(import('..\\pages\\admin\\homes.vue' /* webpackChunkName: "pages/admin/homes" */))
const _6d1b7314 = () => interopDefault(import('..\\pages\\no-access.vue' /* webpackChunkName: "pages/no-access" */))
const _721cd3dc = () => interopDefault(import('..\\pages\\search.vue' /* webpackChunkName: "pages/search" */))
const _086216c1 = () => interopDefault(import('..\\pages\\home\\_id.vue' /* webpackChunkName: "pages/home/_id" */))
const _3aaf0e58 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/admin",
    component: _6c1e6255,
    name: "admin",
    children: [{
      path: "homes",
      component: _8e5813a2,
      name: "admin-homes"
    }]
  }, {
    path: "/no-access",
    component: _6d1b7314,
    name: "no-access"
  }, {
    path: "/search",
    component: _721cd3dc,
    name: "search"
  }, {
    path: "/home/:id?",
    component: _086216c1,
    name: "home-id"
  }, {
    path: "/",
    component: _3aaf0e58,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
