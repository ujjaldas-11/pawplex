from django.db import models
from django.conf import settings


class AdoptionListing(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('adopted',   'Adopted'),
        ('pending',   'Pending'),
    ]
    SPECIES_CHOICES = [
        ('dog',    'Dog'),
        ('cat',    'Cat'),
        ('bird',   'Bird'),
        ('rabbit', 'Rabbit'),
        ('other',  'Other'),
    ]

    shelter     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    pet_name    = models.CharField(max_length=100)
    species     = models.CharField(max_length=50, choices=SPECIES_CHOICES)
    breed       = models.CharField(max_length=100, blank=True)
    age_months  = models.IntegerField()
    gender      = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('unknown', 'Unknown')], default='unknown')
    description = models.TextField()
    photo       = models.ImageField(upload_to='adoption/photos/', blank=True, null=True)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pet_name} ({self.species}) — {self.status}'

    class Meta:
        ordering = ['-created_at']


class AdoptionRequest(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('approved',  'Approved'),
        ('rejected',  'Rejected'),
    ]

    listing    = models.ForeignKey(AdoptionListing, on_delete=models.CASCADE, related_name='requests')
    requester  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='adoption_requests')
    message    = models.TextField(blank=True)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.requester.username} → {self.listing.pet_name} ({self.status})'

    class Meta:
        ordering = ['-created_at']
        unique_together = ['listing', 'requester']


class LostFound(models.Model):
    TYPE_CHOICES = [
        ('lost',  'Lost'),
        ('found', 'Found'),
    ]
    SPECIES_CHOICES = [
        ('dog',    'Dog'),
        ('cat',    'Cat'),
        ('bird',   'Bird'),
        ('rabbit', 'Rabbit'),
        ('other',  'Other'),
    ]

    reporter    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lost_found_reports')
    type        = models.CharField(max_length=10, choices=TYPE_CHOICES)
    pet_name    = models.CharField(max_length=100, blank=True)
    species     = models.CharField(max_length=50, choices=SPECIES_CHOICES)
    description = models.TextField()
    photo       = models.ImageField(upload_to='lost_found/photos/', blank=True, null=True)
    lat         = models.FloatField()
    lng         = models.FloatField()
    address     = models.CharField(max_length=255, blank=True)
    contact     = models.CharField(max_length=100)
    is_resolved = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.type.upper()} — {self.pet_name} ({self.species})'

    class Meta:
        ordering = ['-created_at']