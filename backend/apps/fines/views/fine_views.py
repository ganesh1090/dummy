from common.pagination.custom_pagination import StandardPagination
from common.permissions import IsStaffUser

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.fines.serializers import FineSerializer
from apps.fines.services import FineService


class FineListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        fines = FineService.get_all_fines()

        paginator = StandardPagination()

        paginated_fines = paginator.paginate_queryset(
            fines,
            request
        )

        serializer = FineSerializer(
            paginated_fines,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )


class FineDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, fine_id):

        try:

            fine = FineService.get_fine(
                fine_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            FineSerializer(fine).data,
            status=status.HTTP_200_OK
        )


class CreateFineAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsStaffUser,
    ]

    def post(self, request):

        issue_id = request.data.get("issue")

        reason = request.data.get(
            "reason",
            "Late return"
        )

        if not issue_id:

            return Response(
                {
                    "detail": "Issue is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            fine = FineService.create_fine(
                issue_id=issue_id,
                reason=reason,
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            FineSerializer(fine).data,
            status=status.HTTP_201_CREATED
        )


class PayFineAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsStaffUser,
    ]

    def post(self, request, fine_id):

        try:

            fine = FineService.mark_as_paid(
                fine_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            FineSerializer(fine).data,
            status=status.HTTP_200_OK
        )