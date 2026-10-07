from apps.books.models import Book
from apps.inventory.repositories import InventoryRepository


class InventoryService:

    @staticmethod
    def get_all_inventory():
        return InventoryRepository.get_all()

    @staticmethod
    def get_inventory(inventory_id):
        inventory = InventoryRepository.get_by_id(
            inventory_id
        )

        if inventory is None:
            raise ValueError(
                "Inventory record not found."
            )

        return inventory

    @staticmethod
    def get_inventory_by_book(book_id):
        inventory = InventoryRepository.get_by_book_id(
            book_id
        )

        if inventory is None:
            raise ValueError(
                "Inventory record not found."
            )

        return inventory

    @staticmethod
    def create_inventory(data):

        book = Book.objects.filter(
            id=data["book"].id,
            is_active=True,
        ).first()

        if book is None:
            raise ValueError(
                "Book not found."
            )

        existing_inventory = (
            InventoryRepository.get_by_book_id(
                book.id
            )
        )

        if existing_inventory:
            raise ValueError(
                "Inventory already exists for this book."
            )

        total_quantity = data.get(
            "total_quantity",
            book.quantity
        )

        if total_quantity < 0:
            raise ValueError(
                "Total quantity cannot be negative."
            )

        inventory_data = {
            "book": book,
            "total_quantity": total_quantity,
            "available_quantity": total_quantity,
            "issued_quantity": 0,
            "damaged_quantity": 0,
            "lost_quantity": 0,
        }

        return InventoryRepository.create(
            inventory_data
        )

    @staticmethod
    def update_inventory(
        inventory_id,
        data
    ):

        inventory = InventoryService.get_inventory(
            inventory_id
        )

        if "total_quantity" in data:

            total_quantity = data["total_quantity"]

            if total_quantity < 0:
                raise ValueError(
                    "Total quantity cannot be negative."
                )

            currently_unavailable = (
                inventory.total_quantity
                - inventory.available_quantity
            )

            if total_quantity < currently_unavailable:
                raise ValueError(
                    "Total quantity cannot be less than "
                    "currently issued, damaged, or lost quantity."
                )

            data["available_quantity"] = (
                total_quantity
                - currently_unavailable
            )

        data.pop(
            "issued_quantity",
            None
        )

        return InventoryRepository.update(
            inventory,
            data
        )