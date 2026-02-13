import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fintrack.settings')
django.setup()

from reminders.services import send_emi_reminders
from reminders.models import Reminder
from payments.models import Payment
from loans.models import Loan
from django.contrib.auth.models import User
from datetime import date

def test_email():
    print("🚀 Triggering Email Test...")
    
    # 1. Ensure we have a pending reminder for today or create one
    user = User.objects.filter(username='testuser').first()
    if not user:
        print("❌ Test user not found. Run seed_data first.")
        return

    # Create a dummy reminder just for testing
    # Find a payment with actual amounts to attach to
    payment = Payment.objects.filter(loan__user=user, emi_amount__gt=0).first()
    if not payment:
        print("❌ No valid payments found (all have 0 amount). Run seed_data again.")
        return

    # Create a test reminder
    reminder = Reminder.objects.create(
        user=user,
        payment=payment,
        reminder_date=date.today(),
        message=f"Dear User,\n\nThis is a reminder that your EMI of ₹{payment.emi_amount} for {payment.loan.loan_name} is due on {payment.due_date}.\n\nOutstanding Loan Balance: ₹{payment.outstanding_balance_after_payment}\n\nPlease make payment before due date to avoid 2% penalty.\n\nRegards,\nEMI Tracker Team",
        reminder_type='EMAIL',
        is_sent=False
    )
    print(f"✅ Created test reminder ID: {reminder.id}")

    # 2. Trigger the service
    count = send_emi_reminders()
    
    if count > 0:
        print(f"✅ Successfully sent {count} email(s)!")
        print("📧 Please check inbox: anitha05staging@gmail.com")
    else:
        print("⚠️ No emails were sent. Check logs/console for errors.")

if __name__ == "__main__":
    test_email()
