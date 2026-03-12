# adoption/admin.py

from django.contrib import admin
from .models import AdoptionListing, AdoptionRequest, LostFound


class AdoptionRequestInline(admin.TabularInline):
    model = AdoptionRequest
    extra = 0


@admin.register(AdoptionListing)
class AdoptionListingAdmin(admin.ModelAdmin):
    list_display  = ['pet_name', 'species', 'shelter', 'status', 'created_at']
    list_filter   = ['status', 'species', 'gender']
    search_fields = ['pet_name', 'shelter__username']
    inlines       = [AdoptionRequestInline]


@admin.register(AdoptionRequest)
class AdoptionRequestAdmin(admin.ModelAdmin):
    list_display  = ['requester', 'listing', 'status', 'created_at']
    list_filter   = ['status']


@admin.register(LostFound)
class LostFoundAdmin(admin.ModelAdmin):
    list_display  = ['type', 'pet_name', 'species', 'reporter', 'is_resolved', 'created_at']
    list_filter   = ['type', 'species', 'is_resolved']
    search_fields = ['pet_name', 'reporter__username']