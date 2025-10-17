# LiveKit Voice Agent Setup Guide

Your Remi AI application now has LiveKit integration! This guide explains how everything works and how to run your voice agent backend.

## Architecture

```
┌──────────────────┐
│   User Browser   │
│  (Dashboard UI)  │
└────────┬─────────┘
         │ 1. Click "Start Call"
         ↓
┌──────────────────┐
│   Next.js API    │
│ /api/livekit-token│  ← Generates secure access token
└────────┬─────────┘
         │ 2. Returns token + room name
         ↓
┌──────────────────┐
│  LiveKit Cloud   │  ← WebRTC connection for audio
│ (wss://...)      │
└────────┬─────────┘
         │ 3. Agent joins same room
         ↓
┌──────────────────┐
│  Python Agent    │  ← Your AI voice assistant
│   (Backend)      │
└──────────────────┘
```

## What's Already Done (Frontend)

✅ LiveKit credentials added to `.env.local`
✅ LiveKit server SDK installed (`livekit-server-sdk`)
✅ Token generation API route created (`/api/livekit-token.js`)
✅ Voice call component created (`components/VoiceCall.js`)
✅ Dashboard updated with voice call feature
✅ Authentication required for LiveKit access

## Setting Up the Python Voice Agent Backend

### 1. Navigate to Your Project Root

```bash
cd "C:\Users\Potato 99\Desktop\remi-ai"
```

### 2. Create the Python Agent Directory

```bash
mkdir livekit-voice-agent
cd livekit-voice-agent
```

### 3. Initialize Python Project

If you don't have `uv` installed, install it first or use `pip`:

**Option A: Using uv (recommended)**
```bash
uv init . --bare
uv add "livekit-agents[silero,turn-detector]~=1.2" "livekit-plugins-noise-cancellation~=0.2" "python-dotenv"
```

**Option B: Using pip + venv**
```bash
python -m venv venv
.\venv\Scripts\activate  # On Windows
pip install "livekit-agents[silero,turn-detector]~=1.2" "livekit-plugins-noise-cancellation~=0.2" "python-dotenv"
```

### 4. Create `.env.local` for Python Agent

```bash
# Create .env.local in the livekit-voice-agent folder
echo LIVEKIT_API_KEY=APIpZb5zycn8t2y > .env.local
echo LIVEKIT_API_SECRET=KGMYAekWiXSUTqFVEhEvJwI9maPeawMpkkMfqy0rHecB >> .env.local
echo LIVEKIT_URL=wss://first-agent-6v5ajgaq.livekit.cloud >> .env.local
```

Or create the file manually with:
```env
LIVEKIT_API_KEY=APIpZb5zycn8t2y
LIVEKIT_API_SECRET=KGMYAekWiXSUTqFVEhEvJwI9maPeawMpkkMfqy0rHecB
LIVEKIT_URL=wss://first-agent-6v5ajgaq.livekit.cloud
```

### 5. Create the Voice Agent Code

Create a file named `agent.py`:

```python
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")


class RemiAssistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are Remi AI, a helpful voice assistant for customer service.
            You assist users with their questions in a friendly, professional manner.
            You provide concise, clear responses without complex formatting.
            You are patient, empathetic, and solution-oriented.
            Keep responses natural and conversational.""",
        )


async def entrypoint(ctx: agents.JobContext):
    """Main entry point for the voice agent."""

    session = AgentSession(
        # Speech-to-text: AssemblyAI for accurate transcription
        stt="assemblyai/universal-streaming:en",

        # LLM: OpenAI GPT-4 mini for intelligence
        llm="openai/gpt-4.1-mini",

        # Text-to-speech: Cartesia for natural voice
        tts="cartesia/sonic-2:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",

        # Voice activity detection
        vad=silero.VAD.load(),

        # Turn detection for natural conversations
        turn_detection=MultilingualModel(),
    )

    await session.start(
        room=ctx.room,
        agent=RemiAssistant(),
        room_input_options=RoomInputOptions(
            # Noise cancellation for better audio quality
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Greet the user when they join
    await session.generate_reply(
        instructions="Greet the user warmly and ask how you can help them today."
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
```

### 6. Add API Keys for AI Services

You'll need to add API keys for the AI services used by the agent:

**OpenAI (for GPT-4)**
1. Go to https://platform.openai.com/api-keys
2. Create an API key
3. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```

**AssemblyAI (for speech-to-text)**
1. Go to https://www.assemblyai.com/
2. Sign up and get your API key
3. Add to `.env.local`:
   ```env
   ASSEMBLYAI_API_KEY=xxxxxxxxxxxxx
   ```

**Cartesia (for text-to-speech)**
1. Go to https://cartesia.ai/
2. Sign up and get your API key
3. Add to `.env.local`:
   ```env
   CARTESIA_API_KEY=xxxxxxxxxxxxx
   ```

Your `.env.local` should now look like:
```env
LIVEKIT_API_KEY=APIpZb5zycn8t2y
LIVEKIT_API_SECRET=KGMYAekWiXSUTqFVEhEvJwI9maPeawMpkkMfqy0rHecB
LIVEKIT_URL=wss://first-agent-6v5ajgaq.livekit.cloud
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
ASSEMBLYAI_API_KEY=xxxxxxxxxxxxx
CARTESIA_API_KEY=xxxxxxxxxxxxx
```

### 7. Run the Voice Agent

```bash
# Make sure you're in the livekit-voice-agent directory
python agent.py dev
```

You should see output like:
```
INFO     Starting agent worker...
INFO     Connected to LiveKit server
INFO     Waiting for rooms...
```

## Testing the Full Flow

### Terminal 1: Run the Python Agent
```bash
cd "C:\Users\Potato 99\Desktop\remi-ai\livekit-voice-agent"
python agent.py dev
```

### Terminal 2: Run the Next.js Frontend
```bash
cd "C:\Users\Potato 99\Desktop\remi-ai\frontend"
npm run dev
```

### Browser: Test the Voice Call
1. Go to http://localhost:3000
2. Sign in with your Clerk account
3. Go to Dashboard
4. Scroll down to "Try Your AI Voice Agent"
5. Click **"Start Call"**
6. Allow microphone access when prompted
7. Start speaking - your AI agent will respond!

## How It Works

1. **User clicks "Start Call"**
   - Frontend calls `/api/livekit-token`
   - API creates a unique room name and generates a secure token
   - Token is returned to the browser

2. **LiveKit connection established**
   - Browser connects to LiveKit Cloud using the token
   - Joins the room and starts streaming audio

3. **Python agent joins the room**
   - Agent monitors LiveKit for new rooms
   - When a room is created, agent automatically joins
   - Agent greets the user

4. **Conversation begins**
   - User speaks → Audio sent to LiveKit
   - AssemblyAI transcribes speech to text
   - OpenAI GPT-4 generates response
   - Cartesia converts response to speech
   - Audio sent back to user's browser

## Customizing Your Agent

### Change the Voice
Edit `agent.py` and modify the TTS parameter:
```python
tts="cartesia/sonic-2:VOICE_ID_HERE",
```

Browse Cartesia voices at: https://cartesia.ai/voices

### Change the Instructions
Edit the `RemiAssistant` class:
```python
class RemiAssistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""Your custom instructions here...""",
        )
```

### Change the Greeting
Edit the `entrypoint` function:
```python
await session.generate_reply(
    instructions="Your custom greeting here"
)
```

## Subscription-Based Access (Optional)

Currently, all authenticated users can access LiveKit. To restrict access to **paying subscribers only**:

1. **Set up a database** (PostgreSQL, MongoDB, etc.)
2. **Track subscription status** in the database (updated by Stripe webhooks)
3. **Update `/api/livekit-token.js`** to check subscription:

```javascript
// Check if user has active subscription
const subscription = await db.subscriptions.findOne({
  clerkUserId: userId,
  status: 'active'
})

if (!subscription) {
  return res.status(403).json({
    error: 'Active subscription required to use voice calls'
  })
}
```

## Troubleshooting

### "Agent not joining room"
- Make sure the Python agent is running
- Check that `.env.local` has correct LiveKit credentials
- Verify API keys for OpenAI, AssemblyAI, and Cartesia

### "No audio detected"
- Allow microphone permission in your browser
- Check microphone settings in System Preferences/Settings
- Try a different browser (Chrome/Edge recommended)

### "Token generation failed"
- Verify LiveKit credentials in `frontend/.env.local`
- Check that you're signed in to the app
- Restart the Next.js dev server

### "Module not found" errors
- Make sure you installed all Python dependencies
- Activate your virtual environment if using venv
- Try reinstalling: `pip install -r requirements.txt`

## Production Deployment

### Frontend (Render)
Your Next.js app is already configured for Render. Just add the LiveKit environment variables in your Render dashboard.

### Python Agent (Background Worker)
Deploy the Python agent as a background worker:

**Option 1: Render Background Worker**
1. Create a new Background Worker service in Render
2. Point it to your `livekit-voice-agent` directory
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python agent.py start`
5. Add all environment variables

**Option 2: Railway/Fly.io**
- Both support long-running Python processes
- Similar configuration to Render

**Option 3: Self-hosted VPS**
- Use systemd or PM2 to keep agent running
- Cheaper for high-traffic applications

## Resources

- **LiveKit Docs**: https://docs.livekit.io/
- **LiveKit Agents Python**: https://docs.livekit.io/agents/
- **OpenAI API**: https://platform.openai.com/docs
- **AssemblyAI Docs**: https://www.assemblyai.com/docs
- **Cartesia Docs**: https://docs.cartesia.ai/

---

**You're all set!** Start both services and test your voice agent. Users who subscribe will now have access to real-time AI voice conversations! 🎙️🤖
