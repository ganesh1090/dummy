from rest_framework import serializers


class OPACBookSerializer(serializers.Serializer):

    id = serializers.CharField()

    title = serializers.CharField()

    author = serializers.CharField(
        allow_blank=True,
        required=False
    )

    isbn = serializers.CharField(
        allow_blank=True,
        required=False
    )

    media_type = serializers.CharField(
        allow_blank=True,
        required=False
    )

    publisher = serializers.CharField(
        allow_blank=True,
        required=False
    )

    publication_year = serializers.IntegerField(
        allow_null=True,
        required=False
    )

    description = serializers.CharField(
        allow_blank=True,
        required=False
    )

    category = serializers.CharField(
        allow_blank=True,
        required=False
    )

    total_copies = serializers.IntegerField()

    available_copies = serializers.IntegerField()

    branches = serializers.ListField(
        child=serializers.DictField()
    )