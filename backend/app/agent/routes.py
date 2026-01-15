

#routes.py
import os
import uuid
from fastapi import APIRouter, Query, HTTPException
from livekit import api
from dotenv import load_dotenv

print("🔥 Loading LiveKit token route")

load_dotenv()  # force load

router = APIRouter()

@router.get("/getToken")
async def get_token(name: str = Query("guest")):
    try:
        api_key = os.getenv("LIVEKIT_API_KEY")
        api_secret = os.getenv("LIVEKIT_API_SECRET")

        print("🔑 API KEY:", api_key)
        print("🔐 API SECRET:", "FOUND" if api_secret else "MISSING")

        if not api_key or not api_secret:
            raise Exception("LiveKit env vars missing")

        room_name = f"room-{uuid.uuid4().hex[:8]}"

        token = (
            api.AccessToken(api_key, api_secret)
            .with_identity(name)
            .with_name(name)
            .with_grants(
                api.VideoGrants(
                    room_join=True,
                    room=room_name,
                )
            )
        )

        jwt = token.to_jwt()
        print("✅ TOKEN GENERATED")

        return jwt

    except Exception as e:
        print("❌ TOKEN ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
