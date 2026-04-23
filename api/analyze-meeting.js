export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { content, title } = req.body || {}
  if (!content) return res.status(400).json({ error: 'Meeting content is required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured in Vercel environment variables' })

  const prompt = `You are analyzing a meeting transcript or notes for an organization called Firma. Extract insights and return ONLY valid JSON — no markdown, no explanation, just the raw JSON object.

Meeting title: "${title || 'Untitled'}"

Content:
${content.slice(0, 8000)}

Return this exact JSON structure:
{
  "summary": "2-3 sentence overview of what was discussed",
  "actionItems": [
    { "description": "what needs to be done", "priority": "high|medium|low", "assignee": "person name or null", "mentionCount": 1 }
  ],
  "recurringTopics": [
    { "topic": "topic name", "frequency": 2, "category": "Bug|Decision|Concern|Goal or null" }
  ],
  "stalledItems": [
    { "description": "what is stuck", "reason": "why it is stuck or null", "severity": "high|medium|low", "timesMentioned": 1 }
  ],
  "keyTakeaways": ["string"],
  "urgentActions": ["string"],
  "blockers": ["string"],
  "highlights": ["string"]
}

If a section has no items, return an empty array []. Be concise and specific.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(502).json({ error: `Anthropic API error: ${text}` })
    }

    const data = await response.json()
    const raw = data.content?.[0]?.text || '{}'

    let analysis
    try {
      analysis = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) return res.status(500).json({ error: 'Could not parse AI response as JSON' })
      analysis = JSON.parse(match[0])
    }

    return res.status(200).json({ analysis })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Analysis failed' })
  }
}
