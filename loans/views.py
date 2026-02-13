from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Loan
from .serializers import LoanSerializer
from .services import create_loan_with_schedule
from django.db.models import Sum, Count, Q
from payments.models import Payment
from datetime import date

class LoanViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        loan = create_loan_with_schedule(
            user=request.user,
            loan_name=serializer.validated_data.get('loan_name'),
            loan_type=serializer.validated_data.get('loan_type'),
            total_amount=serializer.validated_data.get('total_amount'),
            interest_rate=serializer.validated_data.get('interest_rate'),
            tenure_months=serializer.validated_data.get('tenure_months'),
            start_date=serializer.validated_data.get('start_date'),
            emi_amount=None # Let service calculate
        )
        
        headers = self.get_success_headers(serializer.data)
        return Response(LoanSerializer(loan).data, status=status.HTTP_201_CREATED, headers=headers)

    # def perform_create(self, serializer): ... removed as we overrode create

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def dashboard_summary(self, request):
        user = request.user
        payments = Payment.objects.filter(loan__user=user)
        
        total_pending = payments.filter(status='PENDING').aggregate(total=Sum('emi_amount'))['total'] or 0
        total_overdue = payments.filter(status='OVERDUE').aggregate(total=Sum('emi_amount'))['total'] or 0
        total_penalty = payments.aggregate(total=Sum('penalty_amount'))['total'] or 0
        total_paid = payments.filter(status='PAID').aggregate(total=Sum('total_due_amount'))['total'] or 0
        
        # Outstanding principal tracking
        loans = Loan.objects.filter(user=user, status='Active')
        total_loan_amount = loans.aggregate(total=Sum('total_amount'))['total'] or 0
        paid_principal = payments.filter(status='PAID').aggregate(total=Sum('principal_component'))['total'] or 0
        outstanding_balance = total_loan_amount - paid_principal
        
        return Response({
            "total_pending": total_pending,
            "total_overdue": total_overdue,
            "total_penalty": total_penalty,
            "total_paid": total_paid,
            "outstanding_balance": outstanding_balance
        })
