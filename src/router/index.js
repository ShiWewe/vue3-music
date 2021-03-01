import routes from './routes'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
