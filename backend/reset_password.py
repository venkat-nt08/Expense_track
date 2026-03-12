import sys
sys.path.insert(0, '.')
from database import SessionLocal
from models import User
from auth import get_password_hash

db = SessionLocal()
users = db.query(User).all()
print("=== USERS IN DATABASE ===")
for u in users:
    print(f"ID: {u.id} | Email: {u.email} | Name: {u.name}")

print("\nEnter the email you want to reset password for:")
email = input().strip()
new_password = input("Enter new password: ").strip()

user = db.query(User).filter(User.email == email).first()
if user:
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    print(f"\n✅ Password reset for {email}!")
else:
    print(f"\n❌ User '{email}' not found.")

db.close()
