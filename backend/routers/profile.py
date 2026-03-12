from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, database, auth

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/", response_model=schemas.UserProfile)
def get_profile(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.put("/", response_model=schemas.UserProfile)
def update_profile(profile: schemas.UserProfileUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if profile.name is not None:
        current_user.name = profile.name
    if profile.avatar_url is not None:
        current_user.avatar_url = profile.avatar_url
    db.commit()
    db.refresh(current_user)
    return current_user
