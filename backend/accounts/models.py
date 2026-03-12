from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLL_CHOICES= [
        ('owner', 'Pet Owner'),
        ('vet', 'Veterinarian'),
        ('shelter', 'Animal Shelter'),
        ('store', 'Pet Store')
    ]

    role = models.CharField(max_length=20, choices=ROLL_CHOICES, default='owner')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatar/", blank=True, null=True)
    bio = models.TextField(blank=True)  

    def __str__(self):
        return f'{self.username} {self.role}'

    @property
    def is_owner(self):
        return self.role == 'owner'

    @property
    def is_vet(self):
        return self.role == 'vet'

    @print
    def is_shelter(self):
        return self.role == 'shelter'

    @property
    def is_store(self):
        return self.role == 'store'
    
    