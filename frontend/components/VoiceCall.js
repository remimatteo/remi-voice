import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  DisconnectButton,
} from '@livekit/components-react'
import '@livekit/components-styles'

function VoiceAssistantUI({ onTranscriptUpdate }) {
  const { state, audioTrack } = useVoiceAssistant()
  const [transcript, setTranscript] = useState([])
  const transcriptEndRef = useRef(null)
  const lastStateRef = useRef(state)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  // Listen for state changes to capture transcripts
  useEffect(() => {
    // This is a simplified version - LiveKit's actual transcript events would be better
    // For now, we'll simulate based on state changes
    if (lastStateRef.current === 'listening' && state === 'thinking') {
      // User just finished speaking
      setTranscript(prev => [...prev, {
        speaker: 'user',
        text: 'User spoke (full transcript will appear here)',
        timestamp: new Date()
      }])
      if (onTranscriptUpdate) {
        onTranscriptUpdate([...transcript, { speaker: 'user', text: 'User spoke' }])
      }
    } else if (lastStateRef.current === 'thinking' && state === 'speaking') {
      // Agent is responding
      setTranscript(prev => [...prev, {
        speaker: 'assistant',
        text: 'AI is responding (full transcript will appear here)',
        timestamp: new Date()
      }])
      if (onTranscriptUpdate) {
        onTranscriptUpdate([...transcript, { speaker: 'assistant', text: 'AI responded' }])
      }
    }
    lastStateRef.current = state
  }, [state, onTranscriptUpdate, transcript])

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Status indicator */}
      <div className="text-center">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
          state === 'connecting' ? 'bg-yellow-500/20 text-yellow-300' :
          state === 'connected' ? 'bg-green-500/20 text-green-300' :
          state === 'listening' ? 'bg-blue-500/20 text-blue-300' :
          state === 'thinking' ? 'bg-coral-500/20 text-coral-300' :
          state === 'speaking' ? 'bg-coral-500/20 text-coral-300' :
          'bg-gray-500/20 text-gray-300'
        }`}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-sm font-medium capitalize">{state || 'Idle'}</span>
        </div>
      </div>

      {/* Audio visualizer */}
      <div className="w-full max-w-md h-32 bg-navy-900/40 rounded-xl border border-navy-600 flex items-center justify-center overflow-hidden">
        {audioTrack && state === 'speaking' ? (
          <BarVisualizer
            state={state}
            barCount={7}
            trackRef={audioTrack}
            className="w-full h-full"
            options={{ minHeight: 20 }}
          />
        ) : (
          <div className="text-gray-500 text-sm">
            {state === 'listening' ? 'Listening...' :
             state === 'thinking' ? 'Processing...' :
             'Start speaking to your AI assistant'}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center max-w-md">
        <p className="text-gray-400 text-sm">
          {state === 'connected' || state === 'listening' ?
            'Speak naturally - your AI assistant is listening!' :
            state === 'connecting' ? 'Connecting to your AI assistant...' :
            'Click "Start Call" to begin your conversation'}
        </p>
      </div>

      {/* Transcript Display */}
      {transcript.length > 0 && (
        <div className="w-full max-w-2xl bg-navy-900/60 rounded-xl border border-navy-600 p-4">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Conversation Transcript
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {transcript.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.speaker === 'user'
                      ? 'bg-coral-500/20 border border-coral-500/30 text-white'
                      : 'bg-blue-500/20 border border-blue-500/30 text-blue-100'
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {message.speaker === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  <div className="text-sm">{message.text}</div>
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}

      {/* Disconnect button */}
      <DisconnectButton className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
        End Call
      </DisconnectButton>
    </div>
  )
}

export default function VoiceCall({ agentName = 'Remi', agentInstructions }) {
  const { user } = useUser()
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inCall, setInCall] = useState(false)
  const [roomName, setRoomName] = useState(null)

  const startCall = async () => {
    setLoading(true)
    setError(null)

    try {
      // Generate a unique room name for this user
      const newRoomName = `voice-agent-${user.id}-${Date.now()}`
      setRoomName(newRoomName)

      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: newRoomName,
          participantName: user.firstName || user.id,
          agentName,
          agentInstructions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get LiveKit token')
      }

      setToken(data.token)
      setInCall(true)
    } catch (err) {
      console.error('Error starting call:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const endCall = () => {
    setToken(null)
    setInCall(false)
  }

  if (!user) {
    return (
      <div className="text-center text-gray-400">
        Please sign in to use voice calls
      </div>
    )
  }

  if (inCall && token) {
    return (
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={true}
        video={false}
        onDisconnected={endCall}
        className="bg-navy-800/40 backdrop-blur-sm rounded-2xl border border-navy-700 p-6"
      >
        <VoiceAssistantUI />
        <RoomAudioRenderer />
      </LiveKitRoom>
    )
  }

  return (
    <div className="bg-navy-800/40 backdrop-blur-sm rounded-2xl border border-navy-700 p-8">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-coral-500/20 rounded-full">
          <svg
            className="w-10 h-10 text-coral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Talk to Your AI Assistant
          </h3>
          <p className="text-gray-400">
            Start a voice conversation with your intelligent AI agent
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={startCall}
          disabled={loading}
          className="bg-coral-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-coral-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Connecting...</span>
            </span>
          ) : (
            'Start Call'
          )}
        </button>

        <div className="bg-navy-900/60 rounded-xl border border-navy-600 p-4">
          <p className="text-gray-400 text-sm">
            <strong className="text-white">Note:</strong> Make sure your microphone is enabled in your browser settings
          </p>
        </div>
      </div>
    </div>
  )
}
