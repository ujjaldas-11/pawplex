from django.db import models
from django.conf import settings


class EmergencyContact(models.Model):
    user    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='emergency_contacts')
    name    = models.CharField(max_length=100)
    phone   = models.CharField(max_length=20)
    relation = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f'{self.name} ({self.phone}) — {self.user.username}'


class SOSAlert(models.Model):
    STATUS_CHOICES = [
        ('active',   'Active'),
        ('resolved', 'Resolved'),
    ]

    owner             = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sos_alerts')
    lat               = models.FloatField()
    lng               = models.FloatField()
    address           = models.CharField(max_length=255, blank=True)
    status            = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    emergency_contact = models.CharField(max_length=20, blank=True)
    message           = models.TextField(blank=True)
    timestamp         = models.DateTimeField(auto_now_add=True)
    resolved_at       = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'SOS — {self.owner.username} — {self.status}'

    class Meta:
        ordering = ['-timestamp']