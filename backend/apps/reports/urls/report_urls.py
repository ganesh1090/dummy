from django.urls import path

from apps.reports.views import DashboardSummaryAPIView


urlpatterns = [
    path(
        "dashboard/",
        DashboardSummaryAPIView.as_view(),
        name="dashboard-summary",
    ),
]