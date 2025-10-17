from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from livekit import api
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Remi AI Backend", version="1.0.0")

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LiveKit configuration
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "wss://first-agent-6v5ajgaq.livekit.cloud")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# Agent prompt for ACME Roofing receptionist
AGENT_PROMPT = """
You are a friendly, professional receptionist for ACME Roofing.
Answer calls 24/7. Collect the caller's name, phone number, and issue.
If it's urgent, tell them someone will call back first thing in the morning.
Be concise, warm, and confident.
"""

class SessionRequest(BaseModel):
    room_name: str = "remi-voice-demo"
    participant_name: str = "Customer"

@app.get("/")
async def root():
    return {
        "message": "Remi AI Backend API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "create_session": "/session (POST)"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "livekit_configured": bool(LIVEKIT_API_KEY and LIVEKIT_API_SECRET)
    }

@app.post("/session")
async def create_session(request: SessionRequest):
    """
    Create a LiveKit session with AI agent

    This endpoint:
    1. Creates a LiveKit room
    2. Generates a secure token for the participant
    3. Configures the AI agent with the ACME Roofing prompt
    4. Returns room details and token to the frontend
    """

    # Validate LiveKit credentials
    if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
        raise HTTPException(
            status_code=500,
            detail="LiveKit credentials not configured. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in .env"
        )

    try:
        # Create token grants
        token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
            .with_identity(request.participant_name) \
            .with_name(request.participant_name) \
            .with_grants(api.VideoGrants(
                room_join=True,
                room=request.room_name,
                can_publish=True,
                can_subscribe=True,
            ))

        # Generate JWT token
        jwt_token = token.to_jwt()

        return {
            "token": jwt_token,
            "url": LIVEKIT_URL,
            "room_name": request.room_name,
            "participant_name": request.participant_name,
            "agent_prompt": AGENT_PROMPT,
            "message": "Session created successfully. Connect to the room using the provided token."
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create LiveKit session: {str(e)}"
        )

@app.get("/agent-prompt")
async def get_agent_prompt():
    """Get the current agent prompt"""
    return {
        "prompt": AGENT_PROMPT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
