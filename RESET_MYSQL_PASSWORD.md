# How to Reset MySQL Root Password (Safe Method)

Since we cannot recover the existing password, follow these steps to reset it safely.

### Step 1: Stop the MySQL Service
1.  Open **Task Manager** -> **Services** tab.
2.  Find the service named `MySQL80` (or similar, matching PID **6088** on Port 3307).
3.  Right-click and select **Stop**.

### Step 2: Create a Password Reset File
1.  Create a text file named `mysql-init.txt` in `C:\` (or any accessible folder).
2.  Paste the following content into it:
    ```sql
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass123!';
    ```
    *(Replace `MyNewPass123!` with your desired password).*

### Step 3: Start MySQL in Init Mode
1.  Open a **Command Prompt** as **Administrator**.
2.  Navigate to the MySQL bin directory (we found it at `C:\Program Files\MySQL\MySQL Server 8.0\bin`):
    ```cmd
    cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
    ```
3.  Run the following command (pointing to the file in your project folder):
    ```cmd
    mysqld --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" --init-file="d:\Ecrubit project\fintrack\mysql-init.txt" --console
    ```
4.  Wait until you see "ready for connections". The password is now changed.
5.  Press `Ctrl+C` to stop the server.

### Step 4: Restart Service & Update Django
1.  Go back to **Task Manager** -> **Services**.
2.  Start the `MySQL80` service.
3.  Update `fintrack/settings.py` with the new password.
4.  Run `python check_db_password.py` to verify.
