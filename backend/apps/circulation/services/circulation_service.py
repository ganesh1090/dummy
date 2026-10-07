from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from apps.books.models import Book
from apps.members.models import Member
from apps.inventory.repositories import InventoryRepository

from apps.circulation.repositories import (
    CirculationRepository,
)

from apps.fines.services import FineService


class CirculationService:

    @staticmethod
    @transaction.atomic
    def issue_book(
        book_id,
        member_id,
        issued_by,
        loan_days=14,
        notes="",
    ):

        book = Book.objects.filter(
            id=book_id,
            is_active=True,
        ).first()

        if book is None:
            raise ValueError(
                "Book not found."
            )

        member = Member.objects.filter(
            id=member_id,
            is_active=True,
        ).first()

        if member is None:
            raise ValueError(
                "Member not found."
            )

        # Physical-copy availability
        if book.status != "AVAILABLE":
            raise ValueError(
                "This physical copy is not available."
            )

        active_issue = (
            CirculationRepository.get_active_issue(
                book_id=book_id,
                member_id=member_id,
            )
        )

        if active_issue:
            raise ValueError(
                "This member already has this book issued."
            )

        # Find inventory record for this physical copy
        inventory = (
            InventoryRepository.get_by_book_id(
                book.id
            )
        )

        if inventory is None:
            raise ValueError(
                "Inventory record not found for this book."
            )

        if inventory.available_quantity <= 0:
            raise ValueError(
                "No available quantity for this book."
            )

        due_date = (
            timezone.now()
            + timedelta(days=loan_days)
        )

        issue = CirculationRepository.create(
            {
                "book": book,
                "member": member,
                "issued_by": issued_by,
                "due_date": due_date,
                "notes": notes,
            }
        )

        # Mark exact physical copy as issued
        book.status = "ISSUED"

        book.save(
            update_fields=["status"]
        )

        # Update inventory
        inventory.available_quantity -= 1
        inventory.issued_quantity += 1

        inventory.save(
            update_fields=[
                "available_quantity",
                "issued_quantity",
                "updated_at",
            ]
        )

        return issue

    @staticmethod
    @transaction.atomic
    def return_book(issue_id):

        issue = CirculationRepository.get_by_id(
            issue_id
        )

        if issue is None:
            raise ValueError(
                "Issue record not found."
            )

        if issue.status == "RETURNED":
            raise ValueError(
                "This book has already been returned."
            )

        book = issue.book

        inventory = (
            InventoryRepository.get_by_book_id(
                book.id
            )
        )

        if inventory is None:
            raise ValueError(
                "Inventory record not found for this book."
            )

        # Set return information
        issue.return_date = timezone.now()
        issue.status = "RETURNED"

        issue = CirculationRepository.update(
            issue,
            {
                "return_date": issue.return_date,
                "status": issue.status,
            }
        )

        # Make exact physical copy available again
        book.status = "AVAILABLE"

        book.save(
            update_fields=["status"]
        )

        # Update inventory
        if inventory.issued_quantity <= 0:
            raise ValueError(
                "Inventory issued quantity is already zero."
            )

        inventory.issued_quantity -= 1
        inventory.available_quantity += 1

        inventory.save(
            update_fields=[
                "available_quantity",
                "issued_quantity",
                "updated_at",
            ]
        )

        # Automatically create a fine if the book was returned late
        fine_amount = FineService.calculate_fine(
            issue
        )

        if fine_amount > 0:

            FineService.create_fine(
                issue_id=issue.id,
                reason="Late return",
            )

        return issue

    @staticmethod
    def get_all_issues():
        return CirculationRepository.get_all()

    @staticmethod
    def get_member_history(member_id):
        return CirculationRepository.get_by_member(
            member_id
        )

    @staticmethod
    def get_issue(issue_id):

        issue = CirculationRepository.get_by_id(
            issue_id
        )

        if issue is None:
            raise ValueError(
                "Issue record not found."
            )

        return issue