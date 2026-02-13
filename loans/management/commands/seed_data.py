from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from loans.services import create_loan_with_schedule
from datetime import date
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds the database with test data'

    def handle(self, *args, **kwargs):
        # 1. Create a test user
        username = 'testuser'
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, password='password123', email='test@example.com')
            self.stdout.write(self.style.SUCCESS(f'User "{username}" created.'))
        else:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.WARNING(f'User "{username}" already exists.'))

        # 2. Create specific test loans
        
        # Loan 1: Jewel Loan (6L, 9%, 12 months)
        if not user.loans.filter(loan_name="Jewel Loan").exists():
            create_loan_with_schedule(
                user=user,
                loan_name="Jewel Loan",
                loan_type="Jewel",
                total_amount=Decimal('600000.00'),
                interest_rate=Decimal('9.0'),
                tenure_months=12,
                start_date=date.today()
            )
            self.stdout.write(self.style.SUCCESS('Jewel Loan created.'))

        # Loan 2: Bike Loan (1L, EMI 3500, 48 months) -> Rate auto-calculated
        if not user.loans.filter(loan_name="Bike Loan").exists():
            create_loan_with_schedule(
                user=user,
                loan_name="Bike Loan",
                loan_type="Vehicle",
                total_amount=Decimal('100000.00'),
                tenure_months=48,
                emi_amount=Decimal('3500.00'), # Rate will be roughly 25%
                start_date=date.today()
            )
            self.stdout.write(self.style.SUCCESS('Bike Loan created.'))

        # Loan 3: Housing Loan (5L, 13.3%, 120 months) -> EMI approx 7730
        if not user.loans.filter(loan_name="Housing Loan").exists():
            create_loan_with_schedule(
                user=user,
                loan_name="Housing Loan",
                loan_type="Home",
                total_amount=Decimal('500000.00'),
                interest_rate=Decimal('13.3'),
                tenure_months=120,
                start_date=date.today()
            )
            self.stdout.write(self.style.SUCCESS('Housing Loan created.'))

        # 3. Trigger Overdue Check for testing
        from payments.services import update_overdue_payments
        count = update_overdue_payments()
        self.stdout.write(self.style.SUCCESS(f'Overdue check run. {count} payments marked overdue.'))

        self.stdout.write(self.style.SUCCESS('Data seeding completed successfully!'))
