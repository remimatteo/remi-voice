import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/router'

export default function Navigation() {
  const router = useRouter()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleStartTrial = () => {
    // Redirect to dashboard - if not authenticated, Clerk will show sign-up
    router.push('/dashboard')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-navy-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0a1628" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-semibold text-white">Remi AI</span>
        </button>

        {/* CTA Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => scrollToSection('demo')}
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            View demo
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-white hover:text-gray-300 transition-colors duration-200">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-white text-navy-900 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200">
                Start free trial
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <button
              onClick={handleStartTrial}
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              Dashboard
            </button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
