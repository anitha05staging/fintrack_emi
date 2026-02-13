from decimal import Decimal
from datetime import date
from dateutil.relativedelta import relativedelta
from .models import Loan
from payments.models import Payment

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

def solve_interest_rate(principal, emi, tenure_months):
    """
    Finds annual interest rate using binary search for given P, EMI, n.
    f(r) = P*r*(1+r)^n / ((1+r)^n - 1) - EMI = 0
    """
    p = float(principal)
    e = float(emi)
    n = int(tenure_months)
    
    # Binary search for r (monthly rate)
    low = 0.0
    high = 1.0 # 100% per month is a safe upper bound
    
    for _ in range(100): # 100 iterations for high precision
        mid = (low + high) / 2
        if mid == 0:
            f_mid = p / n - e
        else:
            f_mid = (p * mid * (1 + mid)**n) / ((1 + mid)**n - 1) - e
            
        if f_mid > 0:
            high = mid
        else:
            low = mid
            
    annual_rate = mid * 12 * 100
    return Decimal(annual_rate).quantize(Decimal('0.0001'))

def generate_emi_schedule(loan):
    """
    Generates the full EMI schedule for a given loan, including Reminders.
    Uses reducing balance formula and tracks month-wise outstanding.
    """
    from reminders.models import Reminder # Avoid circular import
    
    principal = loan.total_amount
    annual_rate = loan.interest_rate
    monthly_rate = Decimal(annual_rate) / Decimal(12) / Decimal(100)
    tenure = loan.tenure_months
    emi = loan.emi_amount
    start_date = loan.start_date
    
    outstanding_principal = principal
    
    for i in range(1, tenure + 1):
        interest_component = (outstanding_principal * monthly_rate).quantize(Decimal('0.01'))
        principal_component = (emi - interest_component).quantize(Decimal('0.01'))
        
        # Adjust last payment
        if i == tenure:
            principal_component = outstanding_principal
            emi = principal_component + interest_component
            
        due_date = start_date + relativedelta(months=i-1)
        outstanding_before = outstanding_principal
        outstanding_after = outstanding_principal - principal_component
        
        payment = Payment.objects.create(
            loan=loan,
            emi_number=i,
            due_date=due_date,
            emi_amount=emi,
            principal_component=principal_component,
            interest_component=interest_component,
            total_due_amount=emi,
            outstanding_before_payment=outstanding_before,
            outstanding_balance_after_payment=outstanding_after,
            status='PENDING'
        )
        
        # Create Reminder record
        Reminder.objects.create(
            user=loan.user,
            payment=payment,
            reminder_date=due_date,
            message=f"Dear User,\n\nThis is a reminder that your EMI of ₹{emi} for {loan.loan_name} is due on {due_date}.\n\nOutstanding Loan Balance: ₹{outstanding_after}\n\nPlease make payment before due date to avoid 2% penalty.\n\nRegards,\nEMI Tracker Team",
            reminder_type='EMAIL'
        )
        
        outstanding_principal = outstanding_after

def create_loan_with_schedule(user, loan_name, loan_type, total_amount, interest_rate=None, tenure_months=None, start_date=None, emi_amount=None):
    """
    Enhanced service function to create a loan. 
    Calculates interest rate if EMI is provided, or EMI if rate is provided.
    """
    total_amount = Decimal(total_amount)
    tenure_months = int(tenure_months)
    
    if emi_amount and not interest_rate:
        interest_rate = solve_interest_rate(total_amount, emi_amount, tenure_months)
    elif interest_rate and not emi_amount:
        emi_amount = calculate_emi(total_amount, interest_rate, tenure_months)
    
    loan = Loan.objects.create(
        user=user,
        loan_name=loan_name,
        loan_type=loan_type,
        total_amount=total_amount,
        interest_rate=interest_rate,
        tenure_months=tenure_months,
        emi_amount=emi_amount,
        start_date=start_date
    )
    
    generate_emi_schedule(loan)
    return loan
