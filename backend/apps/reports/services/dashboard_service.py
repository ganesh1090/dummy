from django.utils import timezone

from apps.books.models import Book
from apps.members.models import Member
from apps.circulation.models import BookIssue
from apps.fines.models import Fine


class DashboardService:

    @staticmethod
    def get_dashboard_summary():

        now = timezone.now()

        total_books = Book.objects.filter(
            is_active=True
        ).count()

        total_members = Member.objects.filter(
            is_active=True
        ).count()

        issued_books = BookIssue.objects.filter(
            status="ISSUED"
        ).count()

        overdue_books = BookIssue.objects.filter(
            status="ISSUED",
            due_date__lt=now,
            return_date__isnull=True,
        ).count()

        pending_fines = Fine.objects.filter(
            status="PENDING"
        ).count()

        paid_fines = Fine.objects.filter(
            status="PAID"
        ).count()

        return {
            "total_books": total_books,
            "total_members": total_members,
            "issued_books": issued_books,
            "overdue_books": overdue_books,
            "pending_fines": pending_fines,
            "paid_fines": paid_fines,
        }