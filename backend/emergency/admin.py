from django.contrib import admin
from .models import SOSAlert, EmergencyContact


@admin.register(SOSAlert)
class SOSAlertAdmin(admin.ModelAdmin):
    list_display  = ['owner', 'status', 'lat', 'lng', 'timestamp']
    list_filter   = ['status']
    search_fields = ['owner__username']


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display  = ['user', 'name', 'phone', 'relation']
    search_fields = ['user__username', 'name']