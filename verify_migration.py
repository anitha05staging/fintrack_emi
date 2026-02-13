import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fintrack.settings')
django.setup()

print(f"Connected to: {connection.settings_dict['ENGINE']}")
print(f"Database Name: {connection.settings_dict['NAME']}")

from django.contrib.auth import get_user_model
User = get_user_model()
print(f"Users: {User.objects.count()}")

from loans.models import Loan
print(f"Loans: {Loan.objects.count()}")

from payments.models import Payment
print(f"Payments: {Payment.objects.count()}")
