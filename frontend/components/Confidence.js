export default function Confidence() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const features = [
    {
      title: 'Preview in a sandbox',
      description: 'See exactly how Remi responds to callers across FAQs, complex scenarios, and sensitive topics—so you know it always meets your standards before launch',
      color: 'border-l-coral-500'
    },
    {
      title: 'Inspect every answer',
      description: 'Drill into recordings, transcripts, and answer logic to understand why Remi responded the way it did—and fine-tune until it\'s right',
      color: 'border-l-blue-500'
    },
    {
      title: 'Test handoffs before launch',
      description: 'Simulate escalations to teammates, workflows, or callbacks so you can be confident handoffs work seamlessly if customers need a human agent',
      color: 'border-l-green-500'
    }
  ]

  return (
    <section id="confidence" className="py-20 px-6 bg-navy-900">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="mb-4">
          <span className="text-coral-500 font-semibold text-sm tracking-wider uppercase">UNMATCHED CAPABILITIES</span>
        </div>

        {/* Grid layout */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left side - Main heading */}
          <div>
            <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight text-white">
              Test, refine, and launch <br />
              with confidence
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Preview Remi Voice before launch. Test calls, review transcripts,
              and validate performance—so you can go live with confidence
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => scrollToSection('confidence')}
                className="bg-white text-navy-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
              >
                Start free trial
              </button>
              <button
                onClick={() => scrollToSection('demo')}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-navy-900 transition-all duration-200"
              >
                View demo
              </button>
            </div>
          </div>

          {/* Right side - Feature grid */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`border-l-4 ${feature.color} pl-6 fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview mockup */}
        <div className="bg-cream-100 rounded-2xl p-8 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left preview panel */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-auto text-sm text-gray-600 font-mono">Preview</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-navy-900">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"/>
                  </svg>
                  <span className="font-medium">Phone › Customer Support</span>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="text-sm text-yellow-800 font-medium">When a customer calls support...</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-coral-500 rounded flex items-center justify-center text-white text-xs">1</div>
                    <p className="flex-1 text-navy-900">Greet customer warmly</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-navy-900 rounded flex items-center justify-center text-white text-xs">2</div>
                    <p className="flex-1 text-navy-900">Remi answers the customer</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs text-gray-700">
                    Using support content
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-navy-900 rounded flex items-center justify-center text-white text-xs">3</div>
                    <p className="flex-1 text-navy-900">Categorizing the issue</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M7 7L17 17M7 17L17 7" strokeWidth="2"/>
                    </svg>
                    <span className="text-xs">If Remi can't resolve the conversation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs">4</div>
                    <p className="flex-1 text-navy-900">Hands over or remains connected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right conversation panel */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="mb-4">
                <span className="text-sm font-medium text-navy-900">Live Conversation</span>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="text-navy-900">Hi, I'm having trouble with my recent order</p>
                </div>
                <div className="bg-navy-900 text-white p-3 rounded-lg">
                  <p className="text-sm text-gray-300 mb-1">Remi Voice</p>
                  <p>Hi there! I'd be happy to help you with your order. Can you provide me with your order number?</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="text-navy-900">It's ORD-12345</p>
                </div>
                <div className="bg-navy-900 text-white p-3 rounded-lg">
                  <p className="text-sm text-gray-300 mb-1">Remi Voice</p>
                  <p>Perfect! I found your order. I see it was placed on October 10th. What seems to be the issue?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
