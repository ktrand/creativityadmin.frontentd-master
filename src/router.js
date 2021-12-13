import Vue from 'vue'
import Router from 'vue-router'
import store from './store/store'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [

        {
            path: '',
            component: () => import('./layouts/main/Main.vue'),
            children: [
              {
                path: '/',
                name: 'home',
                component: () => import('./views/Home.vue')
              },
              {
                path: '/category',
                name: 'category', 
                component: () => import('./views/category/Category.vue')
              },
              
              {
                path: '/instagram-scraper',
                name: 'scraper', 
                component: () => import('./views/instagram/Scraper.vue')
              },
              {
                path: '/posts',
                name: 'posts', 
                component: () => import('./views/posts/Posts.vue')
              },
              {
                path: 'post/content/:postId',
                name: 'postContents', 
                component: () => import('./views/posts/PostContent.vue'),
              },
              {
                path: '/video',
                name: 'video', 
                component: () => import('./views/video/Videos.vue')
              },
            ],
        },
        {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            children: [
        // =============================================================================
        // PAGES
        // =============================================================================
              {
                path: '/login',
                name: 'login',
                component: () => import('@/views/pages/Login.vue')
              },
              {
                path: '/error-404',
                name: 'page-error-404',
                component: () => import('@/views/pages/Error404.vue')
              },
            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/pages/error-404'
        }
    ],
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !store.getters['auth/getToken']) next({ name: 'login' })
  else next()
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

export default router
