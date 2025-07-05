from fastapi import FastAPI
from app.routes.member import router as member_router
from app.routes.debug import router as debug_router
from app.core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Youth Team App", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(member_router)
app.include_router(debug_router)
