import { useRouter } from 'next/router'

export default function Hero() {
  const router = useRouter()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-coral-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Main headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif mb-8 leading-tight fade-in">
          The #1 AI Agent for all <br />
          customer service—now <br />
          on the phone
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 fade-in" style={{ animationDelay: '0.2s' }}>
          Remi Voice brings unrivaled performance to phone support with instant, natural conversations.
          Calls are resolved quickly and efficiently without IVR menus or hold times,
          so customers get faster answers and a better experience.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-white text-navy-900 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Start free trial
          </button>
          <button
            onClick={() => scrollToSection('demo')}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white hover:text-navy-900 transition-all duration-200"
          >
            View demo
          </button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection('demo')}
          className="mt-20 fade-in mx-auto block hover:opacity-80 transition-opacity"
          style={{ animationDelay: '0.6s' }}
          aria-label="Scroll to demo section"
        >
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full mx-auto flex justify-center">
            <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-bounce"></div>
          </div>
        </button>
      </div>
    </section>
  )
}
