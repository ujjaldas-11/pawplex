from django.db import models
from django.conf import settings

# Create your models here.

class Pet(models.Model):
    SPECIES_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('bird', 'Bird'),
        ('rabbit', 'Rabbit'),
        ('fish', 'Fish'),
        ('other', 'Other'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pets')
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=20, choices=SPECIES_CHOICES)
    breed = models.CharField(max_length=100, blank=True)  
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('unkown', 'Unkown')], default='unkown')

    weight = models.FloatField(null=True, blank=True, help_text='weight in kg')
    photo = models.ImageField(upload_to='pets/photos', blank=True, null=True)
    microchip_id = models.CharField(max_length=100, blank=True, unique=True, null=True)
    qr_code = models.ImageField(upload_to='pets/qr_codes', blank=True, null=True)
    is_active    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{self.name} {self.species} - {self.owner.username}'

    
    class Meta:
        ordering = ['-created_at']
    
class VaccinationRecord(models.Model):
    pet            = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='vaccinations')
    vaccine_name   = models.CharField(max_length=200)
    administered   = models.DateField()
    next_due       = models.DateField(null=True, blank=True)
    vet_clinic     = models.CharField(max_length=200, blank=True)
    notes          = models.TextField(blank=True)
    document       = models.FileField(upload_to='pets/vaccine_docs/', blank=True, null=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.vaccine_name} — {self.pet.name}'

    class Meta:
        ordering = ['-administered']
    

class MedicalRecord(models.Model):
    pet         = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='medical_records')
    title       = models.CharField(max_length=200)
    description = models.TextField()
    diagnosed   = models.DateField()
    treated_by  = models.CharField(max_length=200, blank=True)
    document    = models.FileField(upload_to='pets/medical_docs/', blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} — {self.pet.name}'

    class Meta:
        ordering = ['-diagnosed']