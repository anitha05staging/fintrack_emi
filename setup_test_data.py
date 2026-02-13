import os
import django
from django.contrib.auth import get_user_model
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fintrack.settings')
django.setup()

User = get_user_model()

# Create Test User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser 'admin' created.")

if not User.objects.filter(username='testuser').exists():
    user = User.objects.create_user('testuser', 'test@example.com', 'password123')
    print("Test user 'testuser' created.")
    
    # Create some sample data for the test user
    from loans.services import create_loan_with_schedule
    
    print("Creating sample loans...")
    create_loan_with_schedule(
        user=user,
        loan_name="Home Loan",
        loan_type="Housing",
        total_amount=500000,
        interest_rate=8.5,
        tenure_months=24,
        start_date=date.today() - timedelta(days=60),
        emi_amount=None # Auto calculate
    )
    
    create_loan_with_schedule(
        user=user,
        loan_name="iPhone 15",
        loan_type="Personal",
        total_amount=80000,
        interest_rate=12,
        tenure_months=12,
        start_date=date.today() - timedelta(days=30),
        emi_amount=None
    )
    print("Sample loans created.")
