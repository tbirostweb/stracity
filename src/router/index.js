import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/accueil' },
    { path: '/accueil', component: () => import('../pages/Accueil.vue') },
    { path: '/jeux', component: () => import('../pages/Jeux.vue') },
    { path: '/contact', component: () => import('../pages/Contact.vue') },
    { path: '/loading', redirect: '/accueil' },
    { path: '/:pathMatch(.*)*', redirect: '/accueil' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
