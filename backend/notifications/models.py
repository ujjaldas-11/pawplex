from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_CHOICES = [
        ('vaccination',  'Vaccination Reminder'),
        ('appointment',  'Appointment Update'),
        ('adoption',     'Adoption Request'),
        ('sos',          'SOS Alert'),
        ('community',    'Community'),
        ('general',      'General'),
    ]

    recipient  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type       = models.CharField(max_length=20, choices=TYPE_CHOICES, default='general')
    title      = models.CharField(max_length=200)
    body       = models.TextField()
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.recipient.username} — {self.title}'

    class Meta:
        ordering = ['-created_at']