import sqlite3

db_path = "expenses.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Add missing columns if they don't exist
try:
    cursor.execute("ALTER TABLE users ADD COLUMN name TEXT")
    print("Added 'name' column")
except Exception as e:
    print(f"name: {e}")

try:
    cursor.execute("ALTER TABLE users ADD COLUMN avatar_url TEXT")
    print("Added 'avatar_url' column")
except Exception as e:
    print(f"avatar_url: {e}")

conn.commit()

# Show all users
cursor.execute("SELECT id, email FROM users")
rows = cursor.fetchall()
print("\n=== USERS IN DATABASE ===")
for r in rows:
    print(f"ID: {r[0]} | Email: {r[1]}")

conn.close()
