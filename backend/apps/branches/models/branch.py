from django.db import models


class Branch(models.Model):
    id = models.CharField(
        max_length=20,
        primary_key=True
    )

    name = models.CharField(
        max_length=255,
        unique=True
    )

    location = models.TextField(
        blank=True,
        default=""
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    pincode = models.CharField(
        max_length=10,
        blank=True,
        default=""
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        default=""
    )

    email = models.EmailField(
        blank=True,
        default=""
    )

    notes = models.TextField(
        blank=True,
        default=""
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
        ordering = ["name"]

    def __str__(self):
        return self.name