from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from django.urls import path, include
from .views import PetViewSet, VaccinationViewSet, MedicalRecordViewSet

router = DefaultRouter()
router.register(r'pets', PetViewSet, basename='pet')


# Nested router — /api/pets/{pet_pk}/vaccinations/
pets_router = routers.NestedDefaultRouter(router, r'pets', lookup='pet')
pets_router.register(r'vaccinations',    VaccinationViewSet,   basename='pet-vaccinations')
pets_router.register(r'medical-records', MedicalRecordViewSet, basename='pet-medical-records')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(pets_router.urls)),
]