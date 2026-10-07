from apps.inventory.models import InventoryRecord


class InventoryRepository:

    @staticmethod
    def get_all():
        return (
            InventoryRecord.objects
            .select_related("book")
            .order_by("book__title")
        )

    @staticmethod
    def get_by_id(inventory_id):
        return (
            InventoryRecord.objects
            .select_related("book")
            .filter(id=inventory_id)
            .first()
        )

    @staticmethod
    def get_by_book_id(book_id):
        return (
            InventoryRecord.objects
            .select_related("book")
            .filter(book_id=book_id)
            .first()
        )

    @staticmethod
    def create(data):
        return InventoryRecord.objects.create(
            **data
        )

    @staticmethod
    def update(inventory, data):

        for field, value in data.items():
            setattr(inventory, field, value)

        inventory.save()

        return inventory