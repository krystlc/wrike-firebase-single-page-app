import Vue from 'vue'
import Router from 'vue-router'
const fb = require('../firebaseConfig')

import { Overview, Releases, Workstreams, Reporting, Login } from '../views'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: '/overview'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/overview',
      name: 'Overview',
      component: Overview,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/summary',
      name: 'Summary',
      component: Releases,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/processes',
      name: 'Processes',
      component: Workstreams,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/history',
      name: 'History',
      component: Reporting,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = fb.auth.currentUser
  
  if (requiresAuth && !currentUser) next('/login')
  else if (currentUser && to.path === '/login') next('/overview')
  else if (requiresAuth && currentUser) next()
  else next()
}) 

export default router
