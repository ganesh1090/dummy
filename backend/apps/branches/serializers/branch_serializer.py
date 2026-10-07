from rest_framework import serializers

from apps.branches.models import Branch


class BranchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Branch

        fields = [
            "id",
            "name",
            "location",
            "city",
            "state",
            "pincode",
            "phone",
            "email",
            "notes",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Branch name is required."
            )

        return value

    def validate_email(self, value):
        return value.strip()