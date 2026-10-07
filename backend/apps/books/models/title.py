from django.db import models


class Title(models.Model):

    MEDIA_TYPE_CHOICES = [
        ("book", "Book"),
        ("ebook", "E-Book"),
        ("audiobook", "Audiobook"),
    ]

    id = models.CharField(
        max_length=20,
        primary_key=True
    )

    title = models.CharField(
        max_length=255
    )

    author = models.CharField(
        max_length=255,
        blank=True
    )

    media_type = models.CharField(
        max_length=20,
        choices=MEDIA_TYPE_CHOICES,
        default="book"
    )

    identifiers = models.JSONField(
        default=dict,
        blank=True
    )

    category_id = models.CharField(
        max_length=100,
        blank=True
    )

    tags = models.JSONField(
        default=list,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    publisher = models.CharField(
        max_length=255,
        blank=True
    )

    publication_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    language = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    cover_image = models.ImageField(
        upload_to="book_covers/",
        blank=True,
        null=True
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