from django.contrib.auth.models import User
from rest_framework import serializers

from apps.members.models import Member


class MemberSerializer(serializers.ModelSerializer):

    name = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    email = serializers.EmailField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    user_id = serializers.IntegerField(
        source="user.id",
        read_only=True,
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    user_email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = Member

        fields = [
            "id",
            "user",
            "user_id",
            "username",
            "name",
            "email",
            "user_email",
            "member_id",
            "phone",
            "address",
            "date_of_birth",
            "membership_date",
            "member_type",
            "notes",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "user_id",
            "username",
            "user_email",
            "membership_date",
            "created_at",
            "updated_at",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        full_name = (
            f"{instance.user.first_name} "
            f"{instance.user.last_name}"
        ).strip()

        data["name"] = full_name or instance.user.username
        data["email"] = instance.user.email

        return data