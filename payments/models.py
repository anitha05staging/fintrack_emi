from django.db import models
from loans.models import Loan

class Payment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
    ]

    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='payments')
    emi_number = models.IntegerField(default=1)
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    principal_component = models.DecimalField(max_digits=12, decimal_places=2)
    interest_component = models.DecimalField(max_digits=12, decimal_places=2)
    penalty_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_due_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    outstanding_before_payment = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    outstanding_balance_after_payment = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')

    def __str__(self):
        return f"EMI {self.emi_number} for {self.loan.loan_name} - {self.status}"
