import { useState, useEffect, useRef } from 'react'

// Realistic roofing company conversation with timing
const conversation = [
  {
    speaker: 'agent',
    text: 'Hi, thanks for calling Roofing Company. What can I help you with?',
    startTime: 1000,
    duration: 4000
  },
  {
    speaker: 'customer',
    text: 'Hi, I have a roof leak. I wanted to ask when you can get someone out here to assess the cost of fixing my roof?',
    startTime: 5500,
    duration: 6000
  },
  {
    speaker: 'agent',
    text: 'Sorry to hear you\'re having a leak. I\'ll check the schedule now. But first, can I have your first and last name?',
    startTime: 12000,
    duration: 6000
  },
  {
    speaker: 'customer',
    text: 'Sure, it\'s Sarah Mitchell.',
    startTime: 18500,
    duration: 2000
  },
  {
    speaker: 'agent',
    text: 'Great, thanks Sarah. We have a 9:00 AM and a 12:00 PM slot available on Tuesday the 12th. Do either of these work for you?',
    startTime: 21000,
    duration: 7000
  },
  {
    speaker: 'customer',
    text: 'The 12:00 PM slot would be perfect.',
    startTime: 28500,
    duration: 2500
  },
  {
    speaker: 'agent',
    text: 'Perfect! I\'ve scheduled you for Tuesday, October 12th at 12:00 PM. You\'ll receive a confirmation text shortly. Is there anything else I can help you with?',
    startTime: 31500,
    duration: 8000
  },
  {
    speaker: 'customer',
    text: 'No, that\'s all. Thank you!',
    startTime: 40000,
    duration: 2000
  },
  {
    speaker: 'agent',
    text: 'You\'re welcome! We\'ll see you on the 12th. Have a great day!',
    startTime: 42500,
    duration: 4000
  },
]

export default function PhoneDemo() {
  const [isMuted, setIsMuted] = useState(true) // Start muted
  const [callTime, setCallTime] = useState(0)
  const [currentSpeaker, setCurrentSpeaker] = useState(null)
  const [captions, setCaptions] = useState([])
  const audioRef = useRef(null)

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Handle conversation flow with speaker states
  useEffect(() => {
    const timeouts = []

    conversation.forEach((line) => {
      // Show caption
      const captionTimeout = setTimeout(() => {
        setCaptions(prev => [...prev, { speaker: line.speaker, text: line.text }])
      }, line.startTime)
      timeouts.push(captionTimeout)

      // Set speaking state
      const speakStartTimeout = setTimeout(() => {
        setCurrentSpeaker(line.speaker)
      }, line.startTime)
      timeouts.push(speakStartTimeout)

      // Clear speaking state
      const speakEndTimeout = setTimeout(() => {
        setCurrentSpeaker(null)
      }, line.startTime + line.duration)
      timeouts.push(speakEndTimeout)
    })

    // Cleanup
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  // Simulated audio control
  const toggleMute = () => {
    setIsMuted(!isMuted)
    // In a real implementation, this would control actual audio playback
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <section id="demo" className="py-20 px-6 bg-cream-100 text-navy-900">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="mb-4">
          <span className="text-coral-500 font-semibold text-sm tracking-wider uppercase">LIVE DEMO</span>
        </div>

        {/* Grid layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div>
            <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
              Natural conversations. <br />
              Instant answers.
            </h2>
            <p className="text-xl text-navy-800 leading-relaxed mb-6">
              Remi Voice transforms phone support into a better experience for every caller.
              Phone conversations feel natural, reflect your brand, and get resolved without
              IVR menus or long hold times.
            </p>
            <div className="bg-white/60 backdrop-blur-sm border-l-4 border-coral-500 p-4 rounded">
              <p className="text-sm text-navy-900">
                <strong>Try it:</strong> Click the unmute button to hear a live conversation between
                a customer and Remi AI handling a roofing appointment.
              </p>
            </div>
          </div>

          {/* Right side - Phone mockup with particle effect */}
          <div className="flex justify-center relative">
            {/* Animated speaking indicator ball */}
            {currentSpeaker && (
              <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-10">
                <div className="relative flex items-center justify-center">
                  {/* Expanding circle effect */}
                  <div className={`speech-ball ${currentSpeaker === 'agent' ? 'bg-coral-500' : 'bg-blue-500'}`}>
                    <div className="speech-ring"></div>
                    <div className="speech-ring" style={{ animationDelay: '0.3s' }}></div>
                    <div className="speech-ring" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Larger phone mockup */}
            <div className="phone-mockup-large relative">
              {/* Hidden audio element for future implementation */}
              <audio ref={audioRef} muted={isMuted} />

              {/* Phone screen */}
              <div className="phone-screen-large">
                {/* Status bar */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-5 flex justify-between items-center text-white text-xs z-20">
                  <span className="font-medium">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex items-center space-x-2">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="white">
                      <rect width="4" height="14" rx="1"/>
                      <rect x="6" width="4" height="10" rx="1"/>
                      <rect x="12" width="4" height="6" rx="1"/>
                    </svg>
                  </div>
                </div>

                {/* Call header */}
                <div className="absolute top-16 left-0 right-0 text-center text-white p-6 z-20">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                      </svg>
                    </div>
                    <span className="font-medium text-lg">Roofing Company</span>
                  </div>
                  <span className="text-green-400 text-base font-medium">{formatTime(callTime)}</span>
                </div>

                {/* Live captions area */}
                <div className="absolute bottom-32 left-0 right-0 px-6 space-y-3 max-h-96 overflow-y-auto z-10">
                  {captions.map((caption, index) => (
                    <div key={index} className="caption-fade-in">
                      <div className="text-xs text-white/60 mb-1 font-medium">
                        {caption.speaker === 'agent' ? 'Remi AI' : 'Customer'}
                      </div>
                      <div
                        className={`p-4 rounded-2xl max-w-[85%] ${
                          caption.speaker === 'customer'
                            ? 'bg-gray-700 text-white ml-auto'
                            : 'bg-white/95 text-navy-900 shadow-lg'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{caption.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call controls */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center space-x-8 z-20">
                  {/* Mute/Unmute button - starts muted */}
                  <button
                    onClick={toggleMute}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 ${
                      isMuted ? 'bg-white/90' : 'bg-white/30 backdrop-blur-md'
                    }`}
                    aria-label={isMuted ? 'Unmute to hear conversation' : 'Mute conversation'}
                  >
                    {isMuted ? (
                      <div className="relative">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-navy-900">
                          <path d="M12 1C11.2 1 10.5 1.7 10.5 2.5V11.5C10.5 12.3 11.2 13 12 13C12.8 13 13.5 12.3 13.5 11.5V2.5C13.5 1.7 12.8 1 12 1Z" fill="currentColor"/>
                          <path d="M19 10V12C19 15.866 15.866 19 12 19C8.134 19 5 15.866 5 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-navy-900 font-medium">
                          UNMUTE
                        </div>
                      </div>
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 1C11.2 1 10.5 1.7 10.5 2.5V11.5C10.5 12.3 11.2 13 12 13C12.8 13 13.5 12.3 13.5 11.5V2.5C13.5 1.7 12.8 1 12 1Z" fill="white"/>
                        <path d="M19 10V12C19 15.866 15.866 19 12 19C8.134 19 5 15.866 5 12V10" strokeLinecap="round"/>
                      </svg>
                    )}
                  </button>

                  {/* End call button */}
                  <button
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110"
                    aria-label="End call"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.32.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" transform="rotate(135 12 12)"/>
                    </svg>
                  </button>
                </div>

                {/* Audio indicator when unmuted */}
                {!isMuted && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className="waveform-bar w-1.5 bg-green-400/60 rounded-full"
                            style={{
                              animationDelay: `${i * 0.15}s`,
                              height: '24px'
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-green-400 text-xs font-medium">LIVE AUDIO</div>
                    </div>
                  </div>
                )}

                {/* Muted overlay */}
                {isMuted && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-2">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white/60">
                        <path d="M12 1C11.2 1 10.5 1.7 10.5 2.5V11.5C10.5 12.3 11.2 13 12 13C12.8 13 13.5 12.3 13.5 11.5V2.5C13.5 1.7 12.8 1 12 1Z" fill="currentColor"/>
                        <path d="M19 10V12C19 15.866 15.866 19 12 19C8.134 19 5 15.866 5 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="text-white/60 text-sm">Tap unmute to hear audio</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
