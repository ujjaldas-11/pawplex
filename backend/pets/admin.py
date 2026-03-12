from django.contrib import admin
from .models import Pet, VaccinationRecord, MedicalRecord


# Register your models here.


class VaccinationInline(admin.TabularInline):
    model = VaccinationRecord
    extra = 0

class MedicalRecordInline(admin.TabularInline):
    model = MedicalRecord
    extra = 0

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display   = ['name', 'species', 'breed', 'owner', 'is_active', 'created_at']
    list_filter    = ['species', 'gender', 'is_active']
    search_fields  = ['name', 'owner__username', 'microchip_id']
    inlines        = [VaccinationInline, MedicalRecordInline]


@admin.register(VaccinationRecord)
class vaccinationAdmin(admin.ModelAdmin):
    list_display  = ['vaccine_name', 'pet', 'administered', 'next_due']
    list_filter   = ['vaccine_name']
    search_fields = ['pet__name', 'vaccine_name']

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display  = ['title', 'pet', 'diagnosed', 'treated_by']
    search_fields = ['pet__name', 'title']


