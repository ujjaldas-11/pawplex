# appointments/urls.py

from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from django.urls import path, include
from .views import VetClinicViewSet, AvailableSlotViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'clinics',      VetClinicViewSet,   basename='clinic')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

# Nested — /api/clinics/{clinic_pk}/slots/
clinics_router = routers.NestedDefaultRouter(router, r'clinics', lookup='clinic')
clinics_router.register(r'slots', AvailableSlotViewSet, basename='clinic-slots')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(clinics_router.urls)),
]