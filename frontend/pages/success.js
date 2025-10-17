import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function Success() {
  const router = useRouter()
  const { session_id } = router.query
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Redirect to agent page after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/agent')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <>
      <Head>
        <title>Success - Remi AI</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-navy-800/40 backdrop-blur-sm rounded-2xl border border-navy-700 p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-white mb-3">
              Welcome to Remi AI!
            </h1>
            <p className="text-gray-300 mb-6">
              Your subscription has been successfully activated.
            </p>

            {/* Trial Info */}
            <div className="bg-navy-900/60 rounded-xl border border-navy-600 p-6 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <svg
                  className="w-6 h-6 text-coral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-white">
                  7-Day Free Trial Started
                </h2>
              </div>
              <p className="text-gray-400 text-sm">
                You won't be charged until your trial ends. Cancel anytime.
              </p>
            </div>

            {/* Session ID (for debugging) */}
            {session_id && (
              <p className="text-gray-500 text-xs mb-6 font-mono">
                Session ID: {session_id}
              </p>
            )}

            {/* Auto-redirect Notice */}
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Redirecting to your AI agent in {countdown} seconds...
              </p>

              <button
                onClick={() => router.push('/agent')}
                className="w-full bg-coral-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-coral-600 transition-all duration-200"
              >
                Start Using Your Agent Now
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-6 bg-navy-800/40 backdrop-blur-sm rounded-2xl border border-navy-700 p-6">
            <h3 className="text-white font-semibold mb-3">Next Steps:</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-coral-400 font-bold">1.</span>
                <span>Customize your AI agent's name and instructions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-coral-400 font-bold">2.</span>
                <span>Test your agent with a live voice call</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-coral-400 font-bold">3.</span>
                <span>Fine-tune based on your conversations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
