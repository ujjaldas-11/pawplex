from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    ChangePasswordView,
    RegisterView,
    ProfileView,
    DeleteAccountView
)


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/',    CustomTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('me/', ProfileView.as_view()),
    path('change-password/', ChangePasswordView.as_view()),
    path('delete/', DeleteAccountView.as_view()),
]

