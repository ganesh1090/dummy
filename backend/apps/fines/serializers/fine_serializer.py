from rest_framework import serializers

from apps.fines.models import Fine


class FineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Fine

        fields = [
            "id",
            "issue",
            "amount",
            "reason",
            "status",
            "paid_at",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]