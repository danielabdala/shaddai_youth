from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.member import Member, MemberUpdate, MemberCreate, MemberDB
from app.core.auth import check_token
from app.core.database import SessionLocal, get_db
from app.crud import member as crud


router = APIRouter()
# Dependency to get the database session


@router.get("/members/", response_model=List[Member])
def list_members(request: Request, db: Session = Depends(get_db)):
    check_token(request)
    members = crud.get_members(db)
    return members


@router.get("/members/{member_id}", response_model=Member)
def list_member(
    member_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    check_token(request)
    member = crud.get_member_by_id(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member


@router.post("/members/", response_model=Member)
def create_member(
    member: MemberCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    print("Incoming member:", member)
    check_token(request)
    db_member = MemberDB(**member.dict())
    return crud.create_member(db, db_member)


@router.put("/members/{member_id}", response_model=Member)
def update_member(
    member_id: int,
    updates: MemberUpdate,
    request: Request,
    db: Session = Depends(get_db)
):
    check_token(request)
    member = crud.get_member_by_id(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return crud.update_member_fields(db, member, updates)


@router.delete("/members/{member_id}")
def delete_member(
    member_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    check_token(request)
    member = crud.get_member_by_id(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    crud.delete_member(db, member)
    return {"message": f"Member {member_id} deleted successfully"}
