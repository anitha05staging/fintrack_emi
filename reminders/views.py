from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Reminder
from .serializers import ReminderSerializer

class ReminderViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def trigger(self, request):
        """
        Manually trigger sending of due reminders for the current user.
        In production, this would be a background task (Celery/Cron).
        """
        from django.core.management import call_command
        from io import StringIO
        
        out = StringIO()
        try:
            # Call the management command
            call_command('send_reminders', stdout=out)
            output = out.getvalue()
            
            # Simple parsing of the output to give better feedback
            sent_count = output.count("Sent reminder to")
            skipped_count = output.count("Skipping")
            
            if sent_count > 0:
                msg = f"Successfully sent {sent_count} reminders."
            elif skipped_count > 0:
                msg = "Reminders alreay sent today. No new emails sent."
            else:
                msg = "No due payments found needing reminders."

            return Response({"message": msg, "details": output}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
