from django.db import models

class Reminder(models.Model):
    REMINDER_TYPES = [
        ('EMAIL', 'Email'),
    ]
    
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='reminders')
    payment = models.ForeignKey('payments.Payment', on_delete=models.CASCADE, related_name='reminders')
    reminder_date = models.DateField()
    message = models.TextField()
    reminder_type = models.CharField(max_length=10, choices=REMINDER_TYPES, default='EMAIL')
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reminder_type} Reminder for {self.user.username} on {self.reminder_date}"
