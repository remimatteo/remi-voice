import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStartTrial = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard - Remi AI</title>
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
            <button
              onClick={() => router.push('/')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-navy-800/40 backdrop-blur-sm rounded-2xl border border-navy-700 p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome, {user?.firstName || 'there'}!
              </h1>
              <p className="text-gray-400">
                Get started with your Remi AI voice agent
              </p>
            </div>

            {/* Subscription Card */}
            <div className="bg-navy-900/60 rounded-xl border border-navy-600 p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Subscription Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Plan:</span>
                  <span className="text-white font-medium">Free Trial Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Trial Period:</span>
                  <span className="text-white font-medium">7 Days</span>
                </div>

                <button
                  onClick={handleStartTrial}
                  disabled={loading}
                  className="w-full mt-4 bg-coral-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-coral-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Start Your Free Trial'}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <p className="text-gray-500 text-sm mt-2">
                  Your trial includes full access to Remi AI. No credit card charge for 7 days.
                </p>
              </div>
            </div>

            {/* Features Preview */}
            <div className="bg-navy-900/60 rounded-xl border border-navy-600 p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                What You'll Get
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">24/7 AI-powered voice support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Natural conversation experience</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Integration with LiveKit</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Advanced analytics and insights</span>
                </li>
              </ul>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}
