import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../src/router'
import Contact from '../src/pages/Contact.vue'
import Jeux from '../src/pages/Jeux.vue'
import Navigation from '../src/components/Navigation.vue'
import Mentions from '../src/pages/MentionsLegales.vue'
import Confidentialite from '../src/pages/Confidentialite.vue'
import NotFound from '../src/pages/NotFound.vue'

const mountWith = async (comp, opts = {}) => {
  const router = createAppRouter(createMemoryHistory())
  await router.push('/accueil'); await router.isReady()
  return mount(comp, { global: { plugins: [router] }, attachTo: document.body, ...opts })
}

describe('Contact', () => {
  it('ne soumet rien : pas de GET, message explicite, bouton désactivé', async () => {
    const w = await mountWith(Contact)
    const form = w.get('form')
    expect(form.attributes('method')).toBe('post')
    expect(w.get('button[type=submit]').attributes('disabled')).toBeDefined()
    expect(w.find('[data-testid=contact-indisponible]').exists()).toBe(true)
    const ev = new Event('submit', { cancelable: true, bubbles: true })
    form.element.dispatchEvent(ev)
    await flushPromises()
    expect(ev.defaultPrevented).toBe(true)
    expect(w.get('[data-testid=contact-status]').text()).toMatch(/aucun message n'a été envoyé/)
  })
  it('conserve les labels et un seul h1, avec liens légaux', async () => {
    const w = await mountWith(Contact)
    expect(w.findAll('label').length).toBe(2)
    expect(w.findAll('h1').length).toBe(1)
    expect(w.html()).toContain('/mentions-legales')
    expect(w.html()).toContain('/confidentialite')
  })
})

describe('Navigation et pages légales', () => {
  it('le logo n’est plus un h1', async () => {
    const w = await mountWith(Navigation)
    expect(w.find('h1').exists()).toBe(false)
    expect(w.get('a[aria-label^="Stracity"]').attributes('href')).toBe('/accueil')
  })
  it('pages légales : marqueurs explicites, rien d’inventé', async () => {
    for (const c of [Mentions, Confidentialite]) {
      const w = await mountWith(c)
      expect(w.html()).toContain('[À COMPLÉTER')
      expect(w.findAll('h1').length).toBe(1)
      expect(w.html()).toContain('/mentions-legales')
    }
  })
  it('page 404', async () => {
    const w = await mountWith(NotFound)
    expect(w.text()).toContain('404')
  })
})

describe('Jeux : accessibilité', () => {
  it('cartes = boutons natifs, 4 jeux actifs, 5 désactivés', async () => {
    const w = await mountWith(Jeux)
    const cards = w.findAll('main button')
    expect(cards.length).toBe(9)
    expect(cards.filter((b) => b.attributes('disabled') === undefined).length).toBe(4)
    expect(w.findAll('[role=button]').length).toBe(0)
    expect(w.findAll('h1').length).toBe(1)
    expect(w.text()).toContain('4 jeux actuellement disponibles')
  })
  it('modale : role=dialog, focus, Escape, restauration du focus', async () => {
    const w = await mountWith(Jeux)
    const first = w.findAll('main button').find((b) => b.attributes('disabled') === undefined)
    first.element.focus()
    await first.trigger('click')
    await flushPromises()
    const dlg = w.get('[role=dialog]')
    expect(dlg.attributes('aria-modal')).toBe('true')
    const title = document.getElementById(dlg.attributes('aria-labelledby'))
    expect(title.textContent.trim().length).toBeGreaterThan(0)
    expect(dlg.element.contains(document.activeElement)).toBe(true)
    const fs = w.get('[aria-pressed]')
    expect(fs.attributes('aria-label')).toBe('Passer en plein écran')
    await fs.trigger('click')
    expect(fs.attributes('aria-label')).toBe('Quitter le plein écran')
    await dlg.trigger('keydown', { key: 'Escape' })
    await flushPromises()
    expect(w.find('[role=dialog]').exists()).toBe(false)
    expect(document.activeElement).toBe(first.element)
  })
})
