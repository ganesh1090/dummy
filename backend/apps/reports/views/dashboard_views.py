from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.reports.services import DashboardService


class DashboardSummaryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        summary = (
            DashboardService.get_dashboard_summary()
        )

        return Response(
            summary,
            status=status.HTTP_200_OK
        )