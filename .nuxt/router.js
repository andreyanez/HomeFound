import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5d8db89d = () => interopDefault(import('../pages/admin.vue' /* webpackChunkName: "pages/admin" */))
const _225e19fc = () => interopDefault(import('../pages/admin/homes.vue' /* webpackChunkName: "pages/admin/homes" */))
const _2b3d38be = () => interopDefault(import('../pages/no-access.vue' /* webpackChunkName: "pages/no-access" */))
const _036d08ca = () => interopDefault(import('../pages/search.vue' /* webpackChunkName: "pages/search" */))
const _7e74571b = () => interopDefault(import('../pages/booking/success.vue' /* webpackChunkName: "pages/booking/success" */))
const _9b64b7a8 = () => interopDefault(import('../pages/home/_id.vue' /* webpackChunkName: "pages/home/_id" */))
const _2c1e64a0 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _5d8db89d,
    name: "admin",
    children: [{
      path: "homes",
      component: _225e19fc,
      name: "admin-homes"
    }]
  }, {
    path: "/no-access",
    component: _2b3d38be,
    name: "no-access"
  }, {
    path: "/search",
    component: _036d08ca,
    name: "search"
  }, {
    path: "/booking/success",
    component: _7e74571b,
    name: "booking-success"
  }, {
    path: "/home/:id?",
    component: _9b64b7a8,
    name: "home-id"
  }, {
    path: "/",
    component: _2c1e64a0,
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
