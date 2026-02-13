import MySQLdb

print("Attempting to connect to MySQL on 127.0.0.1:3307 with password 'root'...")
try:
    db = MySQLdb.connect(host="127.0.0.1", user="root", passwd="root", port=3307)
    cursor = db.cursor()
    
    cursor.execute("SELECT VERSION()")
    version = cursor.fetchone()[0]
    print(f"SUCCESS: Connected to Database Server.")
    print(f"SERVER VERSION: {version}")
    
    # Check for MariaDB signature
    if 'MariaDB' in version:
        print("WARNING: This server identifies as MariaDB!")
    else:
        print("CONFIRMED: This server appears to be standard MySQL.")

    # Create DB if not exists
    cursor.execute("CREATE DATABASE IF NOT EXISTS fintrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    print("Database 'fintrack_db' ensured.")
    
    db.close()
except Exception as e:
    print(f"ERROR: Could not connect to database: {e}")
