export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { event, attendees } = req.body || {}
  if (!event || !attendees || !attendees.length) {
    return res.status(400).json({ error: 'Missing event or attendees' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'RESEND_API_KEY not configured' })

  // Build Google Calendar link for the invite email
  const d = event.date.replace(/-/g, '')
  const s = event.startTime ? `${d}T${event.startTime.replace(':', '')}00` : d
  const e = event.endTime   ? `${d}T${event.endTime.replace(':', '')}00`   : s
  const gcalParams = new URLSearchParams({ action: 'TEMPLATE', text: event.title, dates: `${s}/${e}` })
  const det = [event.description, event.gmeetLink ? `Google Meet: ${event.gmeetLink}` : ''].filter(Boolean).join('\n\n')
  if (det) gcalParams.set('details', det)
  if (event.gmeetLink) gcalParams.set('location', event.gmeetLink)
  const gcalUrl = `https://calendar.google.com/calendar/render?${gcalParams}`

  // Human-readable date/time
  const dateLabel = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  function fmtTime(t) {
    if (!t) return null
    const [h, m] = t.split(':').map(Number)
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
  }
  const timeLabel = event.startTime
    ? `${fmtTime(event.startTime)}${event.endTime ? ` – ${fmtTime(event.endTime)}` : ''}`
    : null

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6fe;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fe;padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#FF855C,#F6718D);padding:28px 32px">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.7);text-transform:uppercase">Firma · Nation of Heaven</p>
          <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#fff">You're invited</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px">
          <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#1a1a1a">${event.title}</h2>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px">
            <tr>
              <td style="padding:10px 16px;background:#fef9f5;border-radius:10px 10px 0 0;border-bottom:1px solid #f0e8e0">
                <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:1.5px;color:#FF855C;text-transform:uppercase">Date</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1a1a1a">${dateLabel}</p>
              </td>
            </tr>
            ${timeLabel ? `<tr><td style="padding:10px 16px;background:#fef9f5;border-radius:0;border-bottom:1px solid #f0e8e0">
              <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:1.5px;color:#FF855C;text-transform:uppercase">Time</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1a1a1a">${timeLabel}</p>
            </td></tr>` : ''}
            ${event.gmeetLink ? `<tr><td style="padding:10px 16px;background:#fef9f5;border-radius:0 0 10px 10px">
              <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:1.5px;color:#FF855C;text-transform:uppercase">Location</p>
              <p style="margin:4px 0 0;font-size:14px"><a href="${event.gmeetLink}" style="color:#3b82f6;font-weight:600">Join Google Meet</a></p>
            </td></tr>` : ''}
          </table>
          ${event.description ? `<p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#555">${event.description.replace(/\n/g, '<br>')}</p>` : ''}
          <a href="${gcalUrl}" style="display:inline-block;background:linear-gradient(135deg,#FF855C,#F6718D);color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700">Add to Google Calendar</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 32px;border-top:1px solid #f0e8e0">
          <p style="margin:0;font-size:11px;color:#aaa">Sent via Firma Team Workspace · firma-team-system.vercel.app</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const errors = []
  for (const email of attendees) {
    const trimmed = email.trim()
    if (!trimmed) continue
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: 'Firma Workspace <onboarding@resend.dev>',
          to: [trimmed],
          subject: `You're invited: ${event.title}`,
          html: htmlBody,
        }),
      })
      if (!r.ok) {
        const txt = await r.text()
        errors.push({ email: trimmed, error: txt })
      }
    } catch (err) {
      errors.push({ email: trimmed, error: err.message })
    }
  }

  if (errors.length === attendees.length) {
    return res.status(502).json({ error: 'Failed to send invites', details: errors })
  }
  return res.json({ ok: true, sent: attendees.length - errors.length, errors })
}
