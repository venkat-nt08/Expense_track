from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Any
import crud, database
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud, database, auth, models

router = APIRouter(
    prefix="/reports",
    tags=["reports"]
)

@router.get("/monthly/{year}/{month}")
def get_monthly_report(year: int, month: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    report = crud.get_monthly_report(db, user_id=current_user.id, year=year, month=month)
    # Format the result
    return [{"category": r[0], "color": r[1], "type": r[2], "total": r[3]} for r in report]
