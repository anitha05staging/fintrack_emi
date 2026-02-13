from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from payments.models import Payment
from reminders.models import Reminder
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Sends email reminders for due and overdue payments'

    def handle(self, *args, **options):
        today = timezone.now().date()
        self.stdout.write(f"Starting reminder job for {today}...")

        # Find payments due today or in the past that are not PAID
        # We want to remind for anything PENDING or OVERDUE
        due_payments = Payment.objects.filter(
            status__in=['PENDING', 'OVERDUE'],
            due_date__lte=today
        ).select_related('loan', 'loan__user')

        count_sent = 0
        count_skipped = 0
        count_failed = 0

        for payment in due_payments:
            user = payment.loan.user
            
            # Check if we already sent a reminder TODAY for this payment
            already_sent = Reminder.objects.filter(
                payment=payment,
                reminder_type='EMAIL',
                reminder_date=today,
                is_sent=True
            ).exists()

            if already_sent:
                self.stdout.write(f"Skipping {payment}: Reminder already sent today.")
                count_skipped += 1
                continue

            try:
                # Prepare Email Content
                subject = f"Action Required: EMI Due for {payment.loan.loan_name}"
                
                # Dynamic Status Context
                status_text = "OVERDUE" if payment.due_date < today else "DUE TODAY"
                color = "#dc2626" if payment.due_date < today else "#4f46e5"

                html_message = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                            <div style="background-color: {color}; padding: 20px; text-align: center;">
                                <h2 style="color: #ffffff; margin: 0;">EMI Payment Reminder</h2>
                            </div>
                            <div style="padding: 20px;">
                                <p>Dear {user.username},</p>
                                <p>This is a friendly reminder regarding your loan.</p>
                                
                                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: {color}; font-weight: bold;">{status_text}</span></p>
                                    <p style="margin: 5px 0;"><strong>Loan:</strong> {payment.loan.loan_name}</p>
                                    <p style="margin: 5px 0;"><strong>Amount Due:</strong> ₹{payment.emi_amount}</p>
                                    <p style="margin: 5px 0;"><strong>Due Date:</strong> {payment.due_date}</p>
                                </div>
                                
                                <p>Please ensure sufficient balance in your account or make the payment through the portal to avoid late fees.</p>
                                
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="http://localhost:5173/payments" style="background-color: {color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Pay Now</a>
                                </div>
                            </div>
                            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                                <p>&copy; {timezone.now().year} FinTrack. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                </html>
                """

                # Send Email
                send_mail(
                    subject=subject,
                    message=f"Your EMI of {payment.emi_amount} for {payment.loan.loan_name} is {status_text}.",
                    from_email=None,
                    recipient_list=[user.email],
                    fail_silently=False,
                    html_message=html_message
                )

                # Log Success
                Reminder.objects.create(
                    user=user,
                    payment=payment,
                    reminder_type='EMAIL',
                    reminder_date=today,
                    is_sent=True,
                    sent_at=timezone.now()
                )
                self.stdout.write(self.style.SUCCESS(f"Sent reminder to {user.email} for {payment}"))
                count_sent += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to send to {user.email}: {e}"))
                # Log Failure
                Reminder.objects.create(
                    user=user,
                    payment=payment,
                    reminder_type='EMAIL',
                    reminder_date=today,
                    is_sent=False,
                    error_message=str(e)
                )
                count_failed += 1

        self.stdout.write(self.style.SUCCESS(f"Job completed. Sent: {count_sent}, Skipped: {count_skipped}, Failed: {count_failed}"))
