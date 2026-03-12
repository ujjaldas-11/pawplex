from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PostViewSet, FollowViewSet

router = DefaultRouter()
router.register(r'community/posts', PostViewSet,   basename='post')
router.register(r'community/users', FollowViewSet, basename='follow')

urlpatterns = [
    path('', include(router.urls)),
    path('community/follow/<int:pk>/', FollowViewSet.as_view({'post': 'toggle'})),
]