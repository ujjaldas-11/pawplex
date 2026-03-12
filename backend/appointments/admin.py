from django.contrib import admin
from .models import VetClinic, AvailableSlot, Appointment

# Register your models here.


class SloteLine(admin.TabularInline):
    model = AvailableSlot
    extra = 0

@admin.register(VetClinic)
class VetClinicAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'phone', 'is_open', 'created_at']
    list_filter = ['is_open']
    search_fields = ['name', 'address']
    inlines = [SloteLine]

@admin.register(AvailableSlot)
class AvailableSlotAdmin(admin.ModelAdmin):
    list_display = ['clinic', 'date', 'start_time', 'end_time', 'is_booked']
    list_filter = ['is_booked', 'date']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['pet','clinic', 'date_time', 'status', 'created_at',]
    list_filter = ['status']
    search_fields = ['pet__name', 'clinic__name']

