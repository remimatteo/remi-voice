import { getAuth } from '@clerk/nextjs/server'
import { AccessToken } from 'livekit-server-sdk'

// In-memory storage for room metadata - replace with database later
const roomMetadata = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get the authenticated user from Clerk
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // TODO: Check if user has active subscription
    // For now, we'll allow all authenticated users
    // Later, you should check subscription status from your database
    // const hasSubscription = await checkUserSubscription(userId)
    // if (!hasSubscription) {
    //   return res.status(403).json({ error: 'Active subscription required' })
    // }

    const { roomName, participantName, agentName, agentInstructions } = req.body

    // Store agent customization for this room
    if (agentName && agentInstructions) {
      roomMetadata.set(roomName, {
        userId,
        agentName,
        agentInstructions,
      })
    }

    if (!roomName) {
      return res.status(400).json({ error: 'Room name is required' })
    }

    // Create LiveKit access token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName || userId,
        // Token expires in 1 hour
        ttl: '1h',
      }
    )

    // Grant permissions for the room
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    // Add agent configuration as metadata (if provided)
    if (agentName && agentInstructions) {
      at.metadata = JSON.stringify({
        agentName,
        agentInstructions,
      })
    }

    const token = await at.toJwt()

    return res.status(200).json({
      token,
      url: process.env.NEXT_PUBLIC_LIVEKIT_URL,
      roomName,
    })
  } catch (error) {
    console.error('Error creating LiveKit token:', error)
    return res.status(500).json({
      error: 'Failed to create LiveKit token',
      message: error.message,
    })
  }
}
