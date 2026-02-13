from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import Reminder

def send_emi_reminders():
    """
    Sends pending email reminders to the specified staging email.
    """
    pending_reminders = Reminder.objects.filter(is_sent=False, reminder_type='EMAIL')
    sent_count = 0
    
    for reminder in pending_reminders:
        try:
            loan_name = reminder.payment.loan.loan_name
            subject = f"EMI Payment Reminder - {loan_name}"
            
            # The message is already formatted in loans/services.py
            send_mail(
                subject,
                reminder.message,
                settings.DEFAULT_FROM_EMAIL,
                ['anitha05staging@gmail.com'], # As requested by user
                fail_silently=False,
            )
            
            reminder.is_sent = True
            reminder.sent_at = timezone.now()
            reminder.save()
            sent_count += 1
        except Exception as e:
            print(f"Failed to send reminder {reminder.id}: {e}")
            
    return sent_count
