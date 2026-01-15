from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import search
from app.agent.routes import router as livekit_router
from app.websocket.routes import router as ws_router
# Tables create karein
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shoe Store Smart API")

# --- CORS SETTINGS (Fixes ERR_NETWORK) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(search.router, prefix="/api")
app.include_router(livekit_router, prefix="/api")
app.include_router(ws_router)


@app.get("/")
def home():
    return {"message": "API is running. Go to /docs for testing."}