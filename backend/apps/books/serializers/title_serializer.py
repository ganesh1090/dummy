from rest_framework import serializers

from apps.books.models import Title


class TitleSerializer(serializers.ModelSerializer):

    cover_image = serializers.ImageField(
        required=False,
        allow_null=True
    )

    class Meta:
        model = Title

        fields = [
            "id",
            "title",
            "author",
            "media_type",
            "identifiers",
            "category_id",
            "tags",
            "description",
            "publisher",
            "publication_year",
            "language",
            "cover_image",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_title(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Title is required."
            )

        return value