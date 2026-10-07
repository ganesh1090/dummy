from rest_framework import serializers

from apps.circulation.models import BookIssue
from apps.books.models import Book


class BookIssueSerializer(serializers.ModelSerializer):

    barcode = serializers.CharField(
        source="book.barcode",
        read_only=True,
    )

    book_title = serializers.CharField(
        source="book.title",
        read_only=True,
    )

    branch_id = serializers.CharField(
        source="book.branch.id",
        read_only=True,
    )

    branch_name = serializers.CharField(
        source="book.branch.name",
        read_only=True,
    )

    class Meta:
        model = BookIssue

        fields = [
            "id",
            "book",
            "barcode",
            "book_title",
            "branch_id",
            "branch_name",
            "member",
            "issued_by",
            "issue_date",
            "due_date",
            "return_date",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "barcode",
            "book_title",
            "branch_id",
            "branch_name",
            "issued_by",
            "issue_date",
            "return_date",
            "status",
            "created_at",
            "updated_at",
        ]