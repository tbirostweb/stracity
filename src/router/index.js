import { createRouter, createWebHistory } from 'vue-router'

const SITE = 'Stracity'
export const DEFAULT_DESCRIPTION = 'Joue gratuitement au morpion, Memory, Snake et 2048 sur Stracity.'

export const routes = [
  { path: '/', redirect: '/accueil' },
  {
    path: '/accueil',
    component: () => import('../pages/Accueil.vue'),
    meta: { title: `${SITE} — Mini-jeux`, description: DEFAULT_DESCRIPTION },
  },
  {
    path: '/jeux',
    component: () => import('../pages/Jeux.vue'),
    meta: { title: `Jeux — ${SITE}`, description: 'Morpion, Memory, Snake et 2048 : choisis un mini-jeu gratuit et lance-toi.' },
  },
  {
    path: '/contact',
    component: () => import('../pages/Contact.vue'),
    meta: { title: `Contact — ${SITE}`, description: 'Une idée de jeu pour Stracity ? Page de contact.' },
  },
  {
    path: '/mentions-legales',
    component: () => import('../pages/MentionsLegales.vue'),
    meta: { title: `Mentions légales — ${SITE}`, description: 'Mentions légales du site Stracity.' },
  },
  {
    path: '/confidentialite',
    component: () => import('../pages/Confidentialite.vue'),
    meta: { title: `Confidentialité — ${SITE}`, description: 'Informations sur les données traitées par le site Stracity.' },
  },
  { path: '/loading', redirect: '/accueil' },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../pages/NotFound.vue'),
    meta: { title: `Page introuvable — ${SITE}`, description: DEFAULT_DESCRIPTION, noindex: true },
  },
]

export function applyMeta(meta = {}) {
  if (typeof document === 'undefined') return
  document.title = meta.title || `${SITE} — Mini-jeux`
  const setMeta = (name, content) => {
    let el = document.head.querySelector(`meta[name="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }
  setMeta('description', meta.description || DEFAULT_DESCRIPTION)
  setMeta('robots', meta.noindex ? 'noindex' : 'index,follow')
}

export function createAppRouter(history = createWebHistory()) {
  const router = createRouter({
    history,
    routes,
    scrollBehavior: () => ({ top: 0 }),
  })
  router.afterEach((to) => applyMeta(to.meta))
  return router
}

export default createAppRouter()
