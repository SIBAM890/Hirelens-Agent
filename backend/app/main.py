from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, hr_agent, candidate_flow, proctoring
from app.core import database, config

app = FastAPI(title="HireLens Agent API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
database.Base.metadata.create_all(bind=database.engine)

# Routers
app.include_router(auth.router)
app.include_router(hr_agent.router)
app.include_router(candidate_flow.router)
app.include_router(proctoring.router)

@app.get("/")
def read_root():
    return {"message": "HireLens Agent Backend Running"}
