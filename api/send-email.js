export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, cc, subject, body, fromName } = req.body || {}
  if (!to || !subject) return res.status(400).json({ error: 'Missing to or subject' })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'RESEND_API_KEY not configured' })

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6fe;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fe;padding:40px 16px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <tr><td style="background:#111;padding:24px 32px;display:flex;align-items:center;gap:12px">
          <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.45);text-transform:uppercase">Firma · Nation of Heaven</p>
        </td></tr>
        <tr><td style="padding:32px">
          <p style="margin:0 0 24px;font-size:14px;line-height:1.75;color:#333;white-space:pre-wrap">${body.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#fafafa;border-top:1px solid #eee">
          <p style="margin:0;font-size:11px;color:#aaa">Sent via Firma Team Workspace${fromName ? ` by ${fromName}` : ''} · firma-team-system.vercel.app</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    const toList = to.split(',').map(e => e.trim()).filter(Boolean)
    const ccList = cc ? cc.split(',').map(e => e.trim()).filter(Boolean) : []

    const payload = {
      from: 'Firma Workspace <onboarding@resend.dev>',
      to: toList,
      subject,
      html: htmlBody,
    }
    if (ccList.length) payload.cc = ccList

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload),
    })

    if (!r.ok) {
      const txt = await r.text()
      return res.status(502).json({ error: `Resend error: ${txt}` })
    }

    const data = await r.json()
    return res.json({ ok: true, id: data.id })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
