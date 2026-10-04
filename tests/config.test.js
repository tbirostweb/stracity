import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const read = (f) => readFileSync(join(process.cwd(), f), 'utf8')
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] })

describe('nginx / en-têtes', () => {
  const conf = read('nginx.conf')
  const headers = read('security-headers.conf')
  it('le snippet définit les en-têtes de sécurité', () => {
    for (const h of ['X-Content-Type-Options', 'Referrer-Policy', 'Content-Security-Policy', 'Permissions-Policy', 'X-Frame-Options']) expect(headers).toContain(h)
    expect(headers).toContain("frame-ancestors 'none'")
    expect(headers).toContain("object-src 'none'")
    expect(headers).not.toMatch(/googleapis|gstatic/)
  })
  it('chaque location qui définit add_header ré-inclut le snippet', () => {
    const locs = [...conf.matchAll(/location [^{]+\{([^}]*)\}/g)].map((m) => m[1])
    expect(locs.length).toBeGreaterThan(3)
    for (const body of locs) if (/add_header|try_files|return 200/.test(body)) expect(body).toContain('security-headers.conf')
  })
  it('vrai 404 : pas de fallback SPA global, error_page 404 conservant le statut', () => {
    expect(conf).not.toMatch(/try_files [^;]*\/index\.html/)
    expect(conf).toMatch(/error_page 404 \/index\.html;/)
  })
  it('routes SPA listées, journal sans query string, corps limité, méthodes limitées', () => {
    for (const r of ['accueil', 'jeux', 'contact', 'mentions-legales', 'confidentialite']) expect(conf).toContain(r)
    expect(conf).not.toMatch(/\$request\b|\$args|\$query_string|\$request_uri/)
    expect(conf).toMatch(/client_max_body_size/)
    expect(conf).toMatch(/GET\|HEAD/)
  })
})

describe('Dockerfile', () => {
  const d = read('Dockerfile')
  it('non-root, port >1024, images épinglées au digest, pas de secret', () => {
    expect(d).toMatch(/^USER 101$/m)
    expect(d).toContain('EXPOSE 8080')
    const froms = d.match(/^FROM .*$/gm)
    for (const f of froms) expect(f).toMatch(/@sha256:[0-9a-f]{64}/)
    expect(d).not.toMatch(/^(ARG|ENV) .*(KEY|TOKEN|SECRET|PASSWORD)/im)
    expect(d).toMatch(/HEALTHCHECK.*:8080\/healthz/)
  })
  it('.env.example sans valeur, .dockerignore exclut secrets', () => {
    const env = read('.env.example').split('\n').filter((l) => /^[A-Z_]+=/.test(l))
    for (const l of env) expect(l.split('=')[1]).toBe('')
    expect(read('.dockerignore')).toContain('.env')
  })
})

describe('sources', () => {
  it('aucune ressource tierce ni v-html', () => {
    for (const f of [...walk('src'), 'index.html']) {
      const t = readFileSync(f, 'utf8')
      expect(t, f).not.toMatch(/fonts\.googleapis|fonts\.gstatic|v-html/)
    }
  })
  it('robots.txt présent', () => expect(existsSync(join(process.cwd(), 'public/robots.txt'))).toBe(true))
})
