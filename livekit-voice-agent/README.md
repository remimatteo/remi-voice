# Remi AI - Voice Agent Backend

This is the Python backend that powers the AI voice conversations in Remi AI.

## Quick Start

### 1. Get API Keys

You need API keys for these services (all have free tiers):

#### OpenAI (for GPT-4 intelligence)
1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)

#### AssemblyAI (for speech-to-text)
1. Go to: https://www.assemblyai.com/
2. Sign up for free
3. Go to your dashboard
4. Copy your API key

#### Cartesia (for text-to-speech)
1. Go to: https://cartesia.ai/
2. Sign up for free
3. Go to API keys section
4. Copy your API key

### 2. Add API Keys to .env.local

Open `.env.local` and add your keys:

```env
# LiveKit Configuration (already set)
LIVEKIT_API_KEY=APIpZb5zycn8t2y
LIVEKIT_API_SECRET=KGMYAekWiXSUTqFVEhEvJwI9maPeawMpkkMfqy0rHecB
LIVEKIT_URL=wss://first-agent-6v5ajgaq.livekit.cloud

# OpenAI API Key (ADD YOUR KEY HERE)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# AssemblyAI API Key (ADD YOUR KEY HERE)
ASSEMBLYAI_API_KEY=xxxxxxxxxxxxx

# Cartesia API Key (ADD YOUR KEY HERE)
CARTESIA_API_KEY=xxxxxxxxxxxxx
```

### 3. Run the Voice Agent

```bash
python agent.py dev
```

You should see:
```
INFO     Starting agent worker...
INFO     Connected to LiveKit server
INFO     Waiting for rooms...
```

## Testing

1. **Terminal 1** (This directory):
   ```bash
   python agent.py dev
   ```

2. **Terminal 2** (Frontend):
   ```bash
   cd ../frontend
   npm run dev
   ```

3. **Browser**:
   - Go to http://localhost:3000
   - Sign in
   - Go to Dashboard
   - Click "Start Call"
   - Start talking!

## How It Works

When a user clicks "Start Call" in the browser:

1. Frontend creates a LiveKit room and gets a token
2. User's browser connects to LiveKit Cloud
3. **This Python agent automatically joins the room**
4. User speaks → AssemblyAI transcribes → GPT-4 thinks → Cartesia speaks back

## Customization

### Change the Voice

Edit `agent.py` line 31:
```python
tts="cartesia/sonic-2:DIFFERENT_VOICE_ID",
```

Browse voices at: https://cartesia.ai/voices

### Change AI Instructions

Edit `agent.py` line 12-17 to customize how your AI behaves.

### Change the Greeting

Edit `agent.py` line 53 to change what the AI says first.

## Troubleshooting

**"No module named 'livekit'"**
- Run: `pip install -r requirements.txt`

**"Missing API key"**
- Make sure all keys are in `.env.local`
- Keys should not have quotes around them

**Agent not joining rooms**
- Check that LiveKit credentials match frontend
- Make sure frontend is creating rooms correctly

## Cost Estimate (Free Tiers)

- **OpenAI**: $5 free credit (GPT-4 mini is very cheap)
- **AssemblyAI**: 100 hours/month free
- **Cartesia**: 100,000 characters/month free
- **LiveKit**: Free tier for development

For light testing, everything should be free!

## Production Deployment

Deploy this as a background worker on:
- Render (Background Worker)
- Railway
- Fly.io
- Your own VPS with systemd

Command to run: `python agent.py start`
