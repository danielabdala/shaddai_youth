from fastapi import FastAPI, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import Base, engine, get_db
from app.models import MemberDB, Member, MemberUpdate

Base.metadata.create_all(bind=engine)

app = FastAPI()

SECRET_TOKEN = "token11235813!!*"

@app.post("/members/", response_model=Member)
def create_member(member: Member, request: Request, db: Session = Depends(get_db)):
    check_token(request)
    db_member = MemberDB(id=member.id, name=member.name, birthday=member.birthday)
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@app.get("/members/", response_model=List[Member])
def get_members(request: Request, db: Session = Depends(get_db)):
    check_token(request)
    members = db.query(MemberDB).all()
    return members

@app.put("/members/{member_id}", response_model=Member)
def update_member(
    member_id:int,
    updates:MemberUpdate,
    request: Request,
    db: Session = Depends(get_db)
):

    check_token(request)

    member = db.query(MemberDB).filter(MemberDB.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    if updates.name is not None:
        member.name = updates.name

    if updates.birthday is not None:
        member.birthday = updates.birthday

    db.commit()
    db.refresh(member)

    return member

   


def check_token(request: Request):
    token = request.headers.get("Authorization")
    if token != f"Bearer {SECRET_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
