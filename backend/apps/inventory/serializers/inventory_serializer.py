from rest_framework import serializers

from apps.inventory.models import InventoryRecord


class InventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = InventoryRecord

        fields = [
            "id",
            "book",
            "total_quantity",
            "available_quantity",
            "issued_quantity",
            "damaged_quantity",
            "lost_quantity",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "available_quantity",
            "issued_quantity",
            "created_at",
            "updated_at",
        ]


class InventoryUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = InventoryRecord

        fields = [
            "id",
            "book",
            "total_quantity",
            "available_quantity",
            "issued_quantity",
            "damaged_quantity",
            "lost_quantity",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "book",
            "available_quantity",
            "issued_quantity",
            "created_at",
            "updated_at",
        ]