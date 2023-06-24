import { createRouter, createWebHistory } from '@ionic/vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { RouteRecordRaw } from 'vue-router'
import { pageRoutes } from '@/functions/appPages'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/menu/home'
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/menu/home'
  },
  {
    path: '/login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/register',
    component: () => import('./views/Register.vue')
  },
  {
    path: '/forgot-password',
    component: () => import('./views/ForgotPassword.vue')
  },
  {
    path: '/menu/',
    component: () => import('./views/Menu.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/menu/home/'
      },
      ...pageRoutes
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const getUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(getAuth(), user => {
        unsubscribe()
        resolve(user)
      }, reject)
    })
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getUser()) {
      if (to.path == '/login') {
        next({ path: '/menu/home' })
      } else {
        next()
      }
    } else {
      next({ path: '/login' })
    }
  } else {
    next()
  }
})

export default router
