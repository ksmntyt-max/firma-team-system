import { createHmac, createHash, timingSafeEqual } from 'crypto'

function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', process.env.AUTH_SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verify(token) {
  try {
    const [data, sig] = token.split('.')
    const expected = createHmac('sha256', process.env.AUTH_SECRET).update(data).digest('base64url')
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.exp && payload.exp < Date.now()) return null
    return payload
  } catch { return null }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { type, email, password, token } = req.body || {}

  // ── LOGIN: check email against server-side whitelist ──
  if (type === 'login' && email) {
    const whitelist = (process.env.AUTH_WHITELIST || '')
      .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    const normalized = email.trim().toLowerCase()
    const isAdmin = whitelist.includes(normalized)
    const name = normalized.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const sessionToken = sign({ email: normalized, name, isAdmin, exp: Date.now() + 7 * 86400000 })
    return res.json({ ok: true, isAdmin, name, token: sessionToken })
  }

  // ── UNLOCK: verify password server-side ──
  if (type === 'unlock' && password) {
    const stored = process.env.AUTH_PASSWORD_HASH
    if (!stored) return res.status(500).json({ error: 'Not configured' })
    const actual = createHash('sha256').update(password).digest('hex')
    const valid = timingSafeEqual(Buffer.from(actual.padEnd(64)), Buffer.from(stored.padEnd(64)))
    if (!valid) return res.json({ ok: false })
    const unlockToken = sign({ unlocked: true, exp: Date.now() + 8 * 3600000 })
    return res.json({ ok: true, token: unlockToken })
  }

  // ── VERIFY: validate a stored token ──
  if (type === 'verify' && token) {
    const payload = verify(token)
    if (!payload) return res.json({ ok: false })
    return res.json({ ok: true, ...payload })
  }

  return res.status(400).json({ error: 'Invalid request' })
}
