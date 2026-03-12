from django.urls import path
from .views import (
    NotificationListView,
    MarkReadView,
    MarkAllReadView,
    UnreadCountView,
)

urlpatterns = [
    path('notifications/',                NotificationListView.as_view()),
    path('notifications/unread-count/',   UnreadCountView.as_view()),
    path('notifications/mark-all-read/',  MarkAllReadView.as_view()),
    path('notifications/<int:pk>/read/',  MarkReadView.as_view()),
]

