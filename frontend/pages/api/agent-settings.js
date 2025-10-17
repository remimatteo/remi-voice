import { getAuth } from '@clerk/nextjs/server'

// In-memory storage for now - replace with database later
const agentSettings = new Map()

export default async function handler(req, res) {
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    // Get agent settings for this user
    const settings = agentSettings.get(userId) || {
      name: 'Remi',
      instructions: `You are a helpful voice assistant for customer service.
You assist users with their questions in a friendly, professional manner.
You provide concise, clear responses without complex formatting.
You are patient, empathetic, and solution-oriented.
Keep responses natural and conversational.`
    }
    return res.status(200).json(settings)
  }

  if (req.method === 'POST') {
    // Save agent settings for this user
    const { name, instructions } = req.body

    if (!name || !instructions) {
      return res.status(400).json({ error: 'Name and instructions are required' })
    }

    agentSettings.set(userId, { name, instructions })
    return res.status(200).json({ success: true, settings: { name, instructions } })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
