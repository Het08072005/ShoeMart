# agents.py
import os
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent, room_io 
from livekit.plugins import noise_cancellation, bey
from tools import search_products
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION

# Load .env variables
load_dotenv()

server = AgentServer()

class Assistant(Agent):
    """Basic AI Assistant"""
    def __init__(self):
        super().__init__(
            instructions=AGENT_INSTRUCTION,
            tools=[search_products]
        )

@server.rtc_session()
async def my_agent(ctx: agents.JobContext):
    """Main agent session with avatar"""

    # 1. Create the LiveKit agent session
    session = AgentSession(
        stt="assemblyai/universal-streaming:en",
        llm="google/gemini-3-flash-preview",
        tts="cartesia/sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
    )

    # 2. Initialize Bey / Beyond Presence Avatar session
    avatar = bey.AvatarSession(
        api_key=os.getenv("BEY_API_KEY"),
        avatar_id=os.getenv("BEY_AVATAR_ID")
    )

    # 3. Start the avatar session BEFORE or BEFORE agent.start()
    #    Pass session and room only (no tts argument)
    await avatar.start(session, ctx.room)

    # 4. Start the voice agent session with noise cancellation
    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda _: noise_cancellation.BVC()
            )
        ),
    )

    # 5. Generate a reply using SESSION_INSTRUCTION
    await session.generate_reply(instructions=SESSION_INSTRUCTION)

if __name__ == "__main__":
    agents.cli.run_app(server)
