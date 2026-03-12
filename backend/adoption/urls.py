from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AdoptionListingViewSet, LostFoundViewSet

router = DefaultRouter()
router.register(r'adoption',    AdoptionListingViewSet, basename='adoption')
router.register(r'lost-found',  LostFoundViewSet,       basename='lost-found')

urlpatterns = [
    path('', include(router.urls)),
]