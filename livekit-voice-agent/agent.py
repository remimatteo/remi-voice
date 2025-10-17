from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation, silero, openai
from livekit.plugins.turn_detector.multilingual import MultilingualModel
import json

load_dotenv(".env.local")


class RemiAssistant(Agent):
    def __init__(self, instructions: str = None, agent_name: str = "Remi") -> None:
        # Use custom instructions if provided, otherwise use default
        default_instructions = """You are Remi AI, a helpful voice assistant for customer service.
            You assist users with their questions in a friendly, professional manner.
            You provide concise, clear responses without complex formatting.
            You are patient, empathetic, and solution-oriented.
            Keep responses natural and conversational."""

        super().__init__(
            instructions=instructions or default_instructions,
        )
        self.agent_name = agent_name


async def entrypoint(ctx: agents.JobContext):
    """Main entry point for the voice agent."""

    # Try to get custom agent settings from room metadata
    agent_name = "Remi"
    agent_instructions = None

    # Check if there are any participants with metadata
    try:
        # Wait for participant to join and get metadata
        async for event in ctx.room.on("participant_connected"):
            participant = event.participant
            if participant.metadata:
                try:
                    metadata = json.loads(participant.metadata)
                    agent_name = metadata.get("agentName", "Remi")
                    agent_instructions = metadata.get("agentInstructions")
                    break
                except json.JSONDecodeError:
                    pass
    except:
        pass  # Use defaults if metadata not available

    session = AgentSession(
        # Speech-to-text: OpenAI Whisper for transcription
        stt=openai.STT(),

        # LLM: OpenAI GPT-4 mini for intelligence
        llm=openai.LLM(model="gpt-4o-mini"),

        # Text-to-speech: OpenAI TTS for natural voice (female voice)
        tts=openai.TTS(voice="nova"),  # Options: alloy, echo, fable, onyx, nova, shimmer

        # Voice activity detection
        vad=silero.VAD.load(),

        # Turn detection for natural conversations
        turn_detection=MultilingualModel(),
    )

    await session.start(
        room=ctx.room,
        agent=RemiAssistant(instructions=agent_instructions, agent_name=agent_name),
        room_input_options=RoomInputOptions(
            # Noise cancellation for better audio quality
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Greet the user when they join
    greeting = f"Greet the user warmly, introduce yourself as {agent_name}, and ask how you can help them today."
    await session.generate_reply(instructions=greeting)


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
