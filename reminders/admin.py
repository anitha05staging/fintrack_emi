from django.contrib import admin
from .models import Reminder

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('user', 'payment', 'reminder_date', 'is_sent')
    list_filter = ('is_sent', 'reminder_date')
    search_fields = ('user__username', 'message')
