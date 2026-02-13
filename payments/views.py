from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Payment
from .serializers import PaymentSerializer
from .services import mark_payment_as_paid, update_overdue_payments

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_queryset(self):
        queryset = self.queryset.filter(loan__user=self.request.user)
        loan_id = self.request.query_params.get('loan_id')
        status_param = self.request.query_params.get('status')
        
        if loan_id:
            queryset = queryset.filter(loan_id=loan_id)
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        return queryset

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        success, message = mark_payment_as_paid(pk)
        if success:
            return Response({"message": message}, status=status.HTTP_200_OK)
        return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def trigger_overdue_check(self, request):
        count = update_overdue_payments()
        return Response({"message": f"Updated {count} payments to overdue."}, status=status.HTTP_200_OK)
