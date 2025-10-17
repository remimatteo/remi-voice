import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import VoiceCall from '../components/VoiceCall'

export default function Agent() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('test') // 'test' or 'customize'

  // Agent customization state
  const [agentName, setAgentName] = useState('Remi')
  const [agentInstructions, setAgentInstructions] = useState(
    `You are a helpful voice assistant for customer service.
You assist users with their questions in a friendly, professional manner.
You provide concise, clear responses without complex formatting.
You are patient, empathetic, and solution-oriented.
Keep responses natural and conversational.`
  )
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load agent settings when component mounts
  useEffect(() => {
    if (user) {
      loadAgentSettings()
    }
  }, [user])

  const loadAgentSettings = async () => {
    try {
      const response = await fetch('/api/agent-settings')
      if (response.ok) {
        const settings = await response.json()
        setAgentName(settings.name)
        setAgentInstructions(settings.instructions)
      }
    } catch (error) {
      console.error('Error loading agent settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCustomization = async () => {
    setSaving(true)
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/agent-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: agentName,
          instructions: agentInstructions,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      setSaveSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving agent settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // TODO: Add subscription check here
  // For now, allow all authenticated users
  // Later: check if user has active subscription

  return (
    <>
      <Head>
        <title>AI Agent - Remi AI</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#0a1628]">
        {/* Header */}
        <header className="border-b border-navy-700 bg-navy-900/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0a1628" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-semibold text-white">Remi AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Your AI Voice Agent
            </h1>
            <p className="text-gray-400">
              Test your agent or customize its behavior
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('test')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'test'
                  ? 'bg-coral-500 text-white'
                  : 'bg-navy-800/60 text-gray-400 hover:bg-navy-800'
              }`}
            >
              Test Agent
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'customize'
                  ? 'bg-coral-500 text-white'
                  : 'bg-navy-800/60 text-gray-400 hover:bg-navy-800'
              }`}
            >
              Customize Agent
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'test' ? (
            /* Test Agent Tab */
            <div className="bg-navy-800/40 backdrop-blur-sm rounded-2xl border border-navy-700 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Test Your Voice Agent
                </h2>
                <p className="text-gray-400">
                  Click "Start Call" to have a live conversation with your AI agent
                </p>
              </div>

              {loading ? (
                <div className="text-center text-gray-400 py-12">Loading agent settings...</div>
              ) : (
                <VoiceCall agentName={agentName} agentInstructions={agentInstructions} />
              )}
            </div>
          ) : (
            /* Customize Agent Tab */
            <div className="bg-navy-800/40 backdrop-blur-sm rounded-2xl border border-navy-700 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Customize Your Agent
                </h2>
                <p className="text-gray-400">
                  Personalize how your AI agent behaves and responds
                </p>
              </div>

              <div className="space-y-6">
                {/* Agent Name */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Remi, Alex, Sam"
                    className="w-full bg-navy-900/60 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-coral-500 transition-colors"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    What should customers call your AI agent?
                  </p>
                </div>

                {/* Agent Instructions */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Agent Instructions
                  </label>
                  <textarea
                    value={agentInstructions}
                    onChange={(e) => setAgentInstructions(e.target.value)}
                    rows={12}
                    placeholder="Describe how your agent should behave..."
                    className="w-full bg-navy-900/60 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-coral-500 transition-colors font-mono text-sm"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Define your agent's personality, tone, and how it should handle customer inquiries
                  </p>
                </div>

                {/* Example Prompts */}
                <div className="bg-navy-900/40 rounded-xl border border-navy-600 p-4">
                  <h3 className="text-white font-medium mb-3">Example Instructions</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>• "You are a friendly support agent for [Company Name]. Always start by asking for the customer's name."</p>
                    <p>• "You help customers schedule appointments. Be efficient and professional."</p>
                    <p>• "You are a technical support agent. Ask clarifying questions before providing solutions."</p>
                    <p>• "You handle order inquiries. Always confirm order numbers before proceeding."</p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSaveCustomization}
                    disabled={saving}
                    className="bg-coral-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-coral-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Customization'}
                  </button>

                  {saveSuccess && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Saved successfully!</span>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-300">
                      <strong>Note:</strong> Changes will take effect immediately. Test your agent after saving to ensure it behaves as expected.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
