from django.conf import settings
from django.db import models


class Member(models.Model):

    MEMBER_TYPE_CHOICES = [
        ("Student", "Student"),
        ("Faculty", "Faculty"),
        ("Staff", "Staff"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="member_profile",
    )

    member_id = models.CharField(
        max_length=50,
        unique=True,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True,
    )

    membership_date = models.DateField(
        auto_now_add=True,
    )

    member_type = models.CharField(
        max_length=20,
        choices=MEMBER_TYPE_CHOICES,
        default="Student",
    )

    notes = models.TextField(
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["member_id"]

    def __str__(self):
        return f"{self.member_id} - {self.user.username}"