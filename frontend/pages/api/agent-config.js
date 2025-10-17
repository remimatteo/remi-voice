// This endpoint allows the Python agent to fetch custom instructions for a room
// In-memory storage - should match the one in livekit-token.js
// In a real app, this would use a shared database

const roomMetadata = new Map()

// Export function to share metadata between API routes
export function setRoomMetadata(roomName, metadata) {
  roomMetadata.set(roomName, metadata)
}

export function getRoomMetadata(roomName) {
  return roomMetadata.get(roomName)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { roomName } = req.query

  if (!roomName) {
    return res.status(400).json({ error: 'Room name is required' })
  }

  const metadata = roomMetadata.get(roomName)

  if (!metadata) {
    // Return default configuration
    return res.status(200).json({
      agentName: 'Remi',
      agentInstructions: `You are Remi AI, a helpful voice assistant for customer service.
You assist users with their questions in a friendly, professional manner.
You provide concise, clear responses without complex formatting.
You are patient, empathetic, and solution-oriented.
Keep responses natural and conversational.`
    })
  }

  return res.status(200).json({
    agentName: metadata.agentName,
    agentInstructions: metadata.agentInstructions,
  })
}
