from rest_framework import serializers

from apps.books.models import Book, Title
from apps.branches.models import Branch


class BookSerializer(serializers.ModelSerializer):

    # =====================================================
    # TITLE INFORMATION
    # =====================================================

    title_id = serializers.CharField(
        source="title_record.id",
        read_only=True,
        allow_null=True,
    )

    title_name = serializers.CharField(
        source="title_record.title",
        read_only=True,
        allow_null=True,
    )

    author = serializers.CharField(
        source="title_record.author",
        read_only=True,
        allow_null=True,
    )

    publisher = serializers.CharField(
        source="title_record.publisher",
        read_only=True,
        allow_null=True,
    )

    publication_year = serializers.IntegerField(
        source="title_record.publication_year",
        read_only=True,
        allow_null=True,
    )

    language = serializers.CharField(
        source="title_record.language",
        read_only=True,
        allow_null=True,
    )

    cover_image = serializers.ImageField(
        source="title_record.cover_image",
        read_only=True,
        allow_null=True,
    )

    description = serializers.CharField(
        source="title_record.description",
        read_only=True,
        allow_null=True,
    )

    # =====================================================
    # ISBN
    # =====================================================
    #
    # ISBN is accepted when creating a Book.
    # It is ultimately stored inside the linked Title.
    #

    isbn = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    # =====================================================
    # FIELDS USED WHEN CREATING A NEW TITLE
    # =====================================================

    title = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    media_type = serializers.CharField(
        write_only=True,
        required=False,
        default="book",
    )

    category_id = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    tags = serializers.ListField(
        write_only=True,
        required=False,
        default=list,
    )

    # =====================================================
    # TITLE RELATIONSHIP
    # =====================================================

    title_record = serializers.PrimaryKeyRelatedField(
        queryset=Title.objects.filter(
            is_active=True
        ),
        required=False,
        allow_null=True,
    )

    # =====================================================
    # BRANCH INFORMATION
    # =====================================================

    branch_id = serializers.CharField(
        source="branch.id",
        read_only=True,
        allow_null=True,
    )

    branch_name = serializers.CharField(
        source="branch.name",
        read_only=True,
        allow_null=True,
    )

    branch = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.filter(
            is_active=True
        ),
        required=True,
        allow_null=False,
    )

    # =====================================================
    # META
    # =====================================================

    class Meta:

        model = Book

        fields = [
            # Physical Book
            "id",
            "barcode",

            # Title relationship
            "title_record",
            "title_id",
            "title_name",

            # Title creation fields
            "title",
            "author",
            "isbn",
            "media_type",
            "category_id",
            "tags",

            # Catalogue information
            "publisher",
            "publication_year",
            "language",
            "cover_image",
            "description",

            # Physical location
            "branch",
            "branch_id",
            "branch_name",

            # Physical copy information
            "condition",
            "status",

            # Legacy quantity fields
            "quantity",
            "available_quantity",

            # Metadata
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",

            # Title information
            "title_id",
            "title_name",
            "author",
            "publisher",
            "publication_year",
            "language",
            "cover_image",
            "description",

            # Branch information
            "branch_id",
            "branch_name",

            # Calculated fields
            "available_quantity",

            # Metadata
            "created_at",
            "updated_at",
        ]

    # =====================================================
    # VALIDATION
    # =====================================================

    def validate(self, attrs):

        # -------------------------------------------------
        # Branch is required
        # -------------------------------------------------

        if not attrs.get("branch"):

            raise serializers.ValidationError(
                {
                    "branch":
                    "Branch is required for a physical book."
                }
            )

        # -------------------------------------------------
        # Barcode is required
        # -------------------------------------------------

        barcode = attrs.get("barcode")

        if not barcode:

            raise serializers.ValidationError(
                {
                    "barcode":
                    "Barcode is required for a physical book."
                }
            )

        # -------------------------------------------------
        # Existing Title vs New Title
        # -------------------------------------------------

        title_record = attrs.get(
            "title_record"
        )

        # Existing Title selected
        if title_record:

            return attrs

        # -------------------------------------------------
        # Creating a new Title
        # -------------------------------------------------

        isbn = attrs.get("isbn")

        if not isbn:

            raise serializers.ValidationError(
                {
                    "isbn":
                    "ISBN is required when creating a new Title."
                }
            )

        isbn = isbn.strip()

        if not isbn:

            raise serializers.ValidationError(
                {
                    "isbn":
                    "ISBN is required when creating a new Title."
                }
            )

        attrs["isbn"] = isbn

        title = attrs.get("title")

        if not title:

            raise serializers.ValidationError(
                {
                    "title":
                    "Title is required when creating a new Title."
                }
            )

        title = title.strip()

        if not title:

            raise serializers.ValidationError(
                {
                    "title":
                    "Title is required when creating a new Title."
                }
            )

        attrs["title"] = title

        return attrs

    # =====================================================
    # QUANTITY VALIDATION
    # =====================================================

    def validate_quantity(self, value):

        if value < 1:

            raise serializers.ValidationError(
                "Quantity must be at least 1."
            )

        return value

    # =====================================================
    # RESPONSE REPRESENTATION
    # =====================================================

    def to_representation(self, instance):

        data = super().to_representation(
            instance
        )

        # -------------------------------------------------
        # Always return ISBN from the linked Title
        # -------------------------------------------------

        if instance.title_record:

            identifiers = (
                instance.title_record.identifiers
                or {}
            )

            data["isbn"] = identifiers.get(
                "isbn",
                ""
            )

        else:

            data["isbn"] = (
                getattr(instance, "isbn", "")
                or ""
            )

        # -------------------------------------------------
        # Make physical-copy information explicit
        # -------------------------------------------------

        data["book_id"] = instance.id

        data["physical_copy"] = True

        return data