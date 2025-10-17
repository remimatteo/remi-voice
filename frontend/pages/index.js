import Head from 'next/head'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import PhoneDemo from '../components/PhoneDemo'
import Confidence from '../components/Confidence'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Remi AI - The #1 AI Agent for Customer Service</title>
        <meta name="description" content="Remi AI brings unrivaled performance to phone support with instant, natural conversations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navigation />

      <main>
        <Hero />
        <PhoneDemo />
        <Confidence />
      </main>

      <Footer />
    </>
  )
}
