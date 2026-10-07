from common.pagination.custom_pagination import StandardPagination
from common.permissions import IsStaffUser

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.circulation.serializers import BookIssueSerializer
from apps.circulation.services import CirculationService


class IssueBookAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsStaffUser,
    ]

    def post(self, request):

        book_id = request.data.get("book")
        member_id = request.data.get("member")
        loan_days = request.data.get("loan_days", 14)
        notes = request.data.get("notes", "")

        if not book_id or not member_id:
            return Response(
                {
                    "detail": "Book and member are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            loan_days = int(loan_days)

        except (TypeError, ValueError):
            return Response(
                {
                    "detail": "loan_days must be an integer."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if loan_days < 1:
            return Response(
                {
                    "detail": "loan_days must be at least 1."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            issue = CirculationService.issue_book(
                book_id=book_id,
                member_id=member_id,
                issued_by=request.user,
                loan_days=loan_days,
                notes=notes,
            )

        except ValueError as error:
            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            BookIssueSerializer(issue).data,
            status=status.HTTP_201_CREATED
        )


class IssuedBookListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        issues = CirculationService.get_all_issues()

        paginator = StandardPagination()

        paginated_issues = paginator.paginate_queryset(
            issues,
            request
        )

        serializer = BookIssueSerializer(
            paginated_issues,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )


class MemberBorrowingHistoryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, member_id):

        history = CirculationService.get_member_history(
            member_id
        )

        serializer = BookIssueSerializer(
            history,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class IssueDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, issue_id):

        try:
            issue = CirculationService.get_issue(
                issue_id
            )

        except ValueError as error:
            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            BookIssueSerializer(issue).data,
            status=status.HTTP_200_OK
        )


class ReturnBookAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsStaffUser,
    ]

    def post(self, request, issue_id):

        try:
            issue = CirculationService.return_book(
                issue_id
            )

        except ValueError as error:
            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Book returned successfully.",
                "issue": BookIssueSerializer(issue).data,
            },
            status=status.HTTP_200_OK
        )