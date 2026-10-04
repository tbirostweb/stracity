import { describe, it, expect } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter, applyMeta } from '../src/router'

const make = () => createAppRouter(createMemoryHistory())

describe('routage', () => {
  it('redirige / vers /accueil', async () => {
    const r = make(); await r.push('/'); expect(r.currentRoute.value.path).toBe('/accueil')
  })
  it.each(['/accueil', '/jeux', '/contact', '/mentions-legales', '/confidentialite'])('résout %s sans 404', async (path) => {
    const r = make(); await r.push(path)
    expect(r.currentRoute.value.path).toBe(path)
    expect(r.currentRoute.value.meta.noindex).toBeFalsy()
    expect(document.title).toBe(r.currentRoute.value.meta.title)
  })
  it('affiche une page 404 noindex pour une URL inconnue (pas de redirection)', async () => {
    const r = make(); await r.push('/n-importe-quoi')
    expect(r.currentRoute.value.path).toBe('/n-importe-quoi')
    expect(r.currentRoute.value.meta.noindex).toBe(true)
    expect(document.head.querySelector('meta[name="robots"]').content).toBe('noindex')
  })
  it('titres distincts par route', async () => {
    const titles = new Set()
    for (const p of ['/accueil', '/jeux', '/contact', '/mentions-legales', '/confidentialite']) {
      const r = make(); await r.push(p); titles.add(document.title)
    }
    expect(titles.size).toBe(5)
  })
  it('applyMeta met à jour la description', () => {
    applyMeta({ title: 'T', description: 'D' })
    expect(document.head.querySelector('meta[name="description"]').content).toBe('D')
  })
})
