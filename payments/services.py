from datetime import date
from decimal import Decimal
from .models import Payment

def calculate_emi(principal, annual_rate, tenure_months):
    """
    EMI = P × r × (1+r)^n / ((1+r)^n - 1)
    """
    p = Decimal(principal)
    r = Decimal(annual_rate) / Decimal(12) / Decimal(100)
    n = int(tenure_months)
    
    if r == 0:
        return (p / n).quantize(Decimal('0.01'))
        
    emi = p * r * ((1 + r)**n) / (((1 + r)**n) - 1)
    return emi.quantize(Decimal('0.01'))

def update_overdue_payments():
    """
    Identifies PENDING payments whose due date has passed and marks them as OVERDUE,
    applying a 2% penalty of the EMI amount.
    """
    today = date.today()
    overdue_payments = Payment.objects.filter(due_date__lt=today, status='PENDING')
    
    for payment in overdue_payments:
        payment.status = 'OVERDUE'
        # Penalty calculation: 2% of the EMI amount
        penalty = (payment.emi_amount * Decimal('0.02')).quantize(Decimal('0.01'))
        payment.penalty_amount = penalty
        payment.total_due_amount = payment.emi_amount + penalty
        payment.save()
    
    return overdue_payments.count()

def mark_payment_as_paid(payment_id):
    """
    Marks a specific payment as PAID.
    Updates paid_date and keeps penalty if it was overdue.
    """
    try:
        payment = Payment.objects.get(id=payment_id)
        if payment.status != 'PAID':
            payment.status = 'PAID'
            payment.paid_date = date.today()
            # If it wasn't overdue, total_due is just emi_amount
            if not payment.penalty_amount:
                payment.total_due_amount = payment.emi_amount
            payment.save()
            return True, "Payment marked as paid."
        return False, "Payment is already paid."
    except Payment.DoesNotExist:
        return False, "Payment not found."
