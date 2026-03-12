from django.urls import path
from .views import DashboardStatsView, DashboardChartsView, RecentActivityView

urlpatterns = [
    path('dashboard/stats/',    DashboardStatsView.as_view()),
    path('dashboard/charts/',   DashboardChartsView.as_view()),
    path('dashboard/activity/', RecentActivityView.as_view()),
]