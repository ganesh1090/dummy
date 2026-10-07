from django.conf import settings
from django.db import models


class BookIssue(models.Model):

    book = models.ForeignKey(
        "books.Book",
        on_delete=models.PROTECT,
        related_name="issues",
    )

    member = models.ForeignKey(
        "members.Member",
        on_delete=models.PROTECT,
        related_name="book_issues",
    )

    issued_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="issued_books",
    )

    issue_date = models.DateTimeField(
        auto_now_add=True,
    )

    due_date = models.DateTimeField()

    return_date = models.DateTimeField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("ISSUED", "Issued"),
            ("RETURNED", "Returned"),
            ("OVERDUE", "Overdue"),
        ],
        default="ISSUED",
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-issue_date"]

    def __str__(self):
        return (
            f"{self.book.title} - "
            f"{self.member.member_id} - "
            f"{self.status}"
        )