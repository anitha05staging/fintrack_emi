import MySQLdb
import sys

# Common passwords to try
passwords = ['MyNewPass123!', 'root', 'password', '123456']
port = 3307
host = "127.0.0.1"
user = "root"

print(f"Targeting MySQL on {host}:{port} with user '{user}'...")

for pwd in passwords:
    print(f"Trying password: '{pwd}' ...", end=" ")
    try:
        db = MySQLdb.connect(host=host, user=user, passwd=pwd, port=port)
        print("SUCCESS!")
        
        cursor = db.cursor()
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()[0]
        print(f"Connected to Server Version: {version}")
        
        # Ensure Database Exists
        cursor.execute("CREATE DATABASE IF NOT EXISTS fintrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print("Database 'fintrack_db' ensured.")
        
        db.close()
        
        # Write the successful password to a file so we can read it
        with open("mysql_password.txt", "w") as f:
            f.write(pwd)
            
        sys.exit(0)
    except MySQLdb.Error as e:
        print(f"Failed ({e.args[0]})")
    except Exception as e:
        print(f"Error: {e}")

print("\nALL ATTEMPTS FAILED. Cannot connect to MySQL.")
sys.exit(1)
