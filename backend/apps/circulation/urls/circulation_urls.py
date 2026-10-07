from django.urls import path

from apps.circulation.views import (
    IssueBookAPIView,
    IssuedBookListAPIView,
    MemberBorrowingHistoryAPIView,
    IssueDetailAPIView,
    ReturnBookAPIView,
)


urlpatterns = [

    path(
        "issue/",
        IssueBookAPIView.as_view(),
        name="issue-book",
    ),

    path(
        "issued/",
        IssuedBookListAPIView.as_view(),
        name="issued-books",
    ),

    path(
        "members/<int:member_id>/history/",
        MemberBorrowingHistoryAPIView.as_view(),
        name="member-borrowing-history",
    ),

    path(
        "issued/<int:issue_id>/",
        IssueDetailAPIView.as_view(),
        name="issue-detail",
    ),

    path(
        "return/<int:issue_id>/",
        ReturnBookAPIView.as_view(),
        name="return-book",
    ),

]