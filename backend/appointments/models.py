from django.db import models
from django.conf import settings

# Create your models here.


class VetClinic(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clinic') 
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    is_open = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']

class AvailableSlot(models.Model):
    clinic = models.ForeignKey(VetClinic, on_delete=models.CASCADE, related_name='slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str(self):
        return f'{self.clinic.name} - {self.date} {self.start_time}'

    class Meta:
        ordering = ['date','start_time']
    
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirm', 'Confirm'),
        ('done', 'Done'),
        ('cancelled', 'Cancelled')
    ]

    pet = models.ForeignKey('pets.Pet', on_delete=models.CASCADE, related_name='appointments')
    clinic = models.ForeignKey(VetClinic, on_delete=models.CASCADE, related_name='appointments')
    slot = models.ForeignKey(AvailableSlot, on_delete=models.SET_NULL, null=True, blank=True)
    date_time = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=20,choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pet.name} @ {self.clinic.name}  {self.status}'

    class Meta:
        ordering = ['-created_at']
    

