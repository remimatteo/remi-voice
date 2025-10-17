# Remi AI - Setup & Running Instructions

## Prerequisites

- Node.js 18+ installed
- Python 3.9+ installed
- npm or yarn package manager
- Git

## Initial Setup (First Time Only)

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Install Python Agent Dependencies
```bash
cd livekit-voice-agent
pip install -r requirements.txt
python agent.py download-files
```

### 3. Environment Variables

Create `.env.local` in the `frontend` directory with:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# LiveKit
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create `.env.local` in the `livekit-voice-agent` directory with:
```env
LIVEKIT_URL=wss://your-livekit-url.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
OPENAI_API_KEY=your_openai_api_key
```

## Running the Application

**IMPORTANT: You MUST run both terminals at the same time for the voice agent to work!**

### Terminal 1: Frontend (Next.js)
```bash
cd frontend
npm run dev
```
The frontend will be available at: http://localhost:3000

### Terminal 2: LiveKit Voice Agent (Python)
```bash
cd livekit-voice-agent
python agent.py dev
```
You should see:
```
INFO     Starting agent worker...
INFO     Connected to LiveKit server
INFO     Waiting for rooms...
```

## Using the Application

1. Open http://localhost:3000 in your browser
2. Click "Start Free Trial" to sign up/sign in with Clerk
3. You'll be redirected to the Dashboard
4. Click "Start Your Free Trial" to go through Stripe checkout (use test card: 4242 4242 4242 4242)
5. After successful payment, you'll be redirected to the Agent page
6. **Customize Agent Tab**: Set your agent's name and instructions, then click "Save Customization"
7. **Test Agent Tab**: Click "Start Call" to test your voice agent
8. Allow microphone access and start speaking!

## Features

- **Voice AI Agent**: Real-time voice conversation with AI using LiveKit + OpenAI
- **Customization**: Change agent name, instructions, and behavior
- **Transcript**: See live transcript of your conversation
- **Female Voice**: AI uses OpenAI's "nova" voice (can be changed in agent.py)
- **Authentication**: Clerk handles user authentication
- **Payments**: Stripe handles subscriptions with 7-day free trial

## Troubleshooting

### Voice agent not responding
- Make sure BOTH terminals are running (frontend AND python agent)
- Check that the Python terminal shows "Waiting for rooms..."
- Verify your OpenAI API key is valid and has credits

### "Connecting..." never finishes
- Restart the Python agent (Terminal 2)
- Check LiveKit credentials are correct in both .env.local files

### No audio from AI
- Check browser microphone permissions
- Verify OpenAI API key is set in livekit-voice-agent/.env.local
- Make sure you have the livekit-plugins-openai installed

### Customization not working
- Make sure you clicked "Save Customization" before testing
- Refresh the page after saving
- Check browser console for any errors

## Tech Stack

- **Frontend**: Next.js 14 (Pages Router), React, TailwindCSS
- **Authentication**: Clerk
- **Payments**: Stripe
- **Voice Infrastructure**: LiveKit Cloud
- **AI Services**: OpenAI (Whisper STT, GPT-4 LLM, TTS)
- **Python Agent**: livekit-agents, livekit-plugins-openai

## File Structure

```
remi-ai/
├── frontend/                   # Next.js frontend application
│   ├── pages/
│   │   ├── api/               # API routes
│   │   │   ├── create-checkout-session.js
│   │   │   ├── stripe-webhook.js
│   │   │   ├── livekit-token.js
│   │   │   ├── agent-settings.js
│   │   │   └── agent-config.js
│   │   ├── dashboard.js       # Subscription dashboard
│   │   ├── agent.js           # Agent customization & testing
│   │   └── success.js         # Post-payment success page
│   ├── components/
│   │   ├── VoiceCall.js       # LiveKit voice call component
│   │   └── Navigation.js      # Header with Clerk auth
│   ├── middleware.ts          # Clerk route protection
│   └── .env.local            # Frontend environment variables
│
├── livekit-voice-agent/       # Python voice agent backend
│   ├── agent.py              # Main agent logic
│   ├── requirements.txt      # Python dependencies
│   └── .env.local           # Agent environment variables
│
└── SETUP.md                  # This file
```

## Next Steps / TODO

- [ ] Add database to persist agent settings and subscriptions
- [ ] Implement full transcript with actual speech-to-text content
- [ ] Add conversation history/logs
- [ ] Deploy frontend to Vercel/Render
- [ ] Deploy Python agent to Render/Railway
- [ ] Add more voice customization options
- [ ] Implement webhook verification for Stripe
