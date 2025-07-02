from sqlalchemy.orm import Session
from app.models.member import MemberDB


def get_members(db: Session):
    return db.query(MemberDB).all()


def get_member_by_id(db: Session, member_id: int):
    return db.query(MemberDB).filter(MemberDB.id == member_id).first()


def create_member(db: Session, member: MemberDB):
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def update_member_fields(db: Session, member: MemberDB, updates: MemberDB):

    if updates.name is not None:
        member.name = updates.name

    if updates.birthday is not None:
        member.birthday = updates.birthday

    db.commit()
    db.refresh(member)

    return member


def delete_member(db: Session, member: MemberDB):
    db.delete(member)
    db.commit()
