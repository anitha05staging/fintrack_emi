import os
import django
from django.contrib.auth import get_user_model, authenticate

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fintrack.settings')
django.setup()

User = get_user_model()

username = 'testuser'
password = 'password123'

try:
    user = User.objects.get(username=username)
    print(f"User '{username}' FOUND in database.")
    print(f"Is active: {user.is_active}")
    
    if user.check_password(password):
        print(f"Password for '{username}' is CORRECT.")
    else:
        print(f"Password for '{username}' is INCORRECT.")
        
except User.DoesNotExist:
    print(f"User '{username}' NOT FOUND in database.")

print("-" * 20)
print("All Users:")
for u in User.objects.all():
    print(f"- {u.username} (Email: {u.email})")
