from django.db import models


class Fine(models.Model):

    issue = models.OneToOneField(
        "circulation.BookIssue",
        on_delete=models.PROTECT,
        related_name="fine",
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    reason = models.CharField(
        max_length=255,
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("PAID", "Paid"),
            ("WAIVED", "Waived"),
        ],
        default="PENDING",
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
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
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"Fine #{self.id} - "
            f"{self.amount} - "
            f"{self.status}"
        )