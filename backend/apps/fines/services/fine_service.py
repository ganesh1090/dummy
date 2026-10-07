from decimal import Decimal

from apps.circulation.repositories import CirculationRepository
from apps.fines.repositories import FineRepository


class FineService:

    DEFAULT_DAILY_FINE = Decimal("5.00")

    @staticmethod
    def calculate_fine(issue, daily_rate=None):

        if issue.return_date is None:
            raise ValueError(
                "The book has not been returned yet."
            )

        if issue.return_date <= issue.due_date:
            return Decimal("0.00")

        rate = (
            daily_rate
            if daily_rate is not None
            else FineService.DEFAULT_DAILY_FINE
        )

        overdue_seconds = (
            issue.return_date - issue.due_date
        ).total_seconds()

        overdue_days = int(
            overdue_seconds // 86400
        )

        if overdue_seconds % 86400 > 0:
            overdue_days += 1

        return rate * overdue_days

    @staticmethod
    def create_fine(
        issue_id,
        reason="Late return",
        daily_rate=None,
    ):

        issue = CirculationRepository.get_by_id(
            issue_id
        )

        if issue is None:
            raise ValueError(
                "Issue record not found."
            )

        if issue.return_date is None:
            raise ValueError(
                "Cannot create a fine before the book is returned."
            )

        existing_fine = (
            FineRepository.get_by_issue_id(
                issue_id
            )
        )

        if existing_fine:
            raise ValueError(
                "A fine already exists for this issue."
            )

        amount = FineService.calculate_fine(
            issue,
            daily_rate=daily_rate,
        )

        return FineRepository.create(
            {
                "issue": issue,
                "amount": amount,
                "reason": reason,
            }
        )

    @staticmethod
    def get_all_fines():
        return FineRepository.get_all()

    @staticmethod
    def get_fine(fine_id):

        fine = FineRepository.get_by_id(
            fine_id
        )

        if fine is None:
            raise ValueError(
                "Fine not found."
            )

        return fine

    @staticmethod
    def mark_as_paid(fine_id):

        fine = FineService.get_fine(
            fine_id
        )

        if fine.status == "PAID":
            raise ValueError(
                "This fine is already marked as paid."
            )

        from django.utils import timezone

        fine = FineRepository.update(
            fine,
            {
                "status": "PAID",
                "paid_at": timezone.now(),
            }
        )

        return fine