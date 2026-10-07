from django.db import models


class Book(models.Model):

    CONDITION_CHOICES = [
        ("NEW", "New"),
        ("GOOD", "Good"),
        ("FAIR", "Fair"),
        ("POOR", "Poor"),
        ("DAMAGED", "Damaged"),
    ]

    STATUS_CHOICES = [
        ("AVAILABLE", "Available"),
        ("ISSUED", "Issued"),
        ("RESERVED", "Reserved"),
    ]

    # Physical copy identifier
    barcode = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
    )

    # One physical copy belongs to one catalog Title
    title_record = models.ForeignKey(
        "books.Title",
        on_delete=models.PROTECT,
        related_name="physical_books",
        null=True,
        blank=True,
    )

    # Physical copy location
    branch = models.ForeignKey(
        "branches.Branch",
        on_delete=models.PROTECT,
        related_name="books",
        null=True,
        blank=True,
    )

    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default="NEW",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="AVAILABLE",
    )

    # Existing fields — temporarily preserved
    title = models.CharField(
        max_length=255
    )

    author = models.CharField(
        max_length=255
    )

    isbn = models.CharField(
    max_length=20,
    blank=True,
    default=""
    )

    publisher = models.CharField(
        max_length=255,
        blank=True
    )

    publication_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    available_quantity = models.PositiveIntegerField(
        default=1
    )

    description = models.TextField(
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title