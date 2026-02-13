from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from loans.models import Loan
from payments.models import Payment
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

class Command(BaseCommand):
    help = 'Seeds past overdue data for dashboard visualization'

    def handle(self, *args, **options):
        User = get_user_model()
        user = User.objects.filter(username='testuser').first()
        
        if not user:
            self.stdout.write(self.style.ERROR('Test user not found'))
            return

        # Create a loan started 3 months ago
        start_date = date.today() - relativedelta(months=3)
        loan_name = "Past Personal Loan"
        
        # Check if already exists to avoid duplicates
        existing_loan = Loan.objects.filter(user=user, loan_name=loan_name).first()
        if existing_loan:
             self.stdout.write(self.style.WARNING('Overdue loan exists. Deleting and recreating...'))
             existing_loan.delete()

        loan = Loan.objects.create(
            user=user,
            loan_name=loan_name,
            loan_type="Personal",
            total_amount=100000,
            interest_rate=12.0,
            tenure_months=12,
            start_date=start_date,
            emi_amount=8885.00, # Approx
            status='Active'
        )

        # Generate 3 past EMIs
        # 1st Month: Paid
        # 2nd Month: Overdue
        # 3rd Month: Overdue (Current month due possibly)
        
        # Calculate approximate components
        # Month 1
        interest_1 = 1000.00
        principal_1 = 7885.00
        outstanding_1 = 92115.00
        
        # Month 2
        interest_2 = 921.15
        principal_2 = 7963.85
        outstanding_2 = 84151.15
        
        # Month 3
        interest_3 = 841.51
        principal_3 = 8043.49
        outstanding_3 = 76107.66

        # Payment 1: 2 months ago (PAID)
        due_date_1 = start_date + relativedelta(months=1)
        Payment.objects.create(
            loan=loan,
            emi_number=1,
            due_date=due_date_1,
            emi_amount=8885.00,
            status='PAID',
            paid_date=due_date_1,
            principal_component=principal_1,
            interest_component=interest_1,
            outstanding_before_payment=100000.00,
            outstanding_balance_after_payment=outstanding_1
        )

        # Payment 2: 1 month ago (OVERDUE)
        due_date_2 = start_date + relativedelta(months=2)
        Payment.objects.create(
            loan=loan,
            emi_number=2,
            due_date=due_date_2,
            emi_amount=8885.00, # Base EMI
            status='OVERDUE', 
            penalty_amount=200.00,
            total_due_amount=9085.00, # EMI + Penalty
            principal_component=principal_2,
            interest_component=interest_2,
            outstanding_before_payment=outstanding_1,
            outstanding_balance_after_payment=outstanding_2
        )
        
        # Payment 3: This month
        due_date_3 = start_date + relativedelta(months=3)
        is_overdue = due_date_3 < date.today()
        status = 'OVERDUE' if is_overdue else 'PENDING'
        
        Payment.objects.create(
            loan=loan,
            emi_number=3,
            due_date=due_date_3,
            emi_amount=8885.00,
            status=status,
            principal_component=principal_3,
            interest_component=interest_3,
            outstanding_before_payment=outstanding_2,
            outstanding_balance_after_payment=outstanding_3
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded overdue loan data'))
