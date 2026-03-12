from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    SOSAlertView,
    SOSResolveView,
    SOSListView,
    NearbyVetsView,
    EmergencyContactViewSet,
)

router = DefaultRouter()
router.register(r'emergency/contacts', EmergencyContactViewSet, basename='emergency-contact')

urlpatterns = [
    path('', include(router.urls)),
    path('emergency/sos/',                 SOSAlertView.as_view()),
    path('emergency/sos/list/',            SOSListView.as_view()),
    path('emergency/sos/<int:pk>/resolve/', SOSResolveView.as_view()),
    path('emergency/nearby/',              NearbyVetsView.as_view()),
]