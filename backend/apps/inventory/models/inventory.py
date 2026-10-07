from django.db import models


class InventoryRecord(models.Model):

    book = models.OneToOneField(
        "books.Book",
        on_delete=models.PROTECT,
        related_name="inventory",
    )

    total_quantity = models.PositiveIntegerField(
        default=0
    )

    available_quantity = models.PositiveIntegerField(
        default=0
    )

    issued_quantity = models.PositiveIntegerField(
        default=0
    )

    damaged_quantity = models.PositiveIntegerField(
        default=0
    )

    lost_quantity = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["book__title"]

    def __str__(self):
        return f"Inventory - {self.book.title}"