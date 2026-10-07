from django.db import transaction

from apps.books.repositories import BookRepository


class BookService:

    @staticmethod
    def get_all_books(
        search=None,
        author=None,
        publisher=None,
        available=None,
    ):
        from apps.books.filters import BookFilter

        books = BookRepository.get_all()

        return BookFilter.filter_books(
            books,
            search=search,
            author=author,
            publisher=publisher,
            available=available,
        )

    @staticmethod
    def get_book(book_id):

        book = BookRepository.get_by_id(
            book_id
        )

        if book is None:
            raise ValueError(
                "Book not found."
            )

        return book

    # =====================================================
    # BARCODE GENERATION
    # =====================================================

    @staticmethod
    def generate_barcode():

        import uuid

        while True:

            barcode = (
                "LIB"
                + str(uuid.uuid4().int)[:9]
            )

            existing_book = (
                BookRepository.get_by_barcode(
                    barcode
                )
            )

            if not existing_book:
                return barcode

    # =====================================================
    # CREATE BOOK(S)
    # =====================================================

    @staticmethod
    @transaction.atomic
    def create_book(data):

        data = data.copy()

        # -------------------------------------------------
        # Basic information
        # -------------------------------------------------

        barcode = data.get(
            "barcode"
        )

        title_record = data.get(
            "title_record"
        )

        branch = data.get(
            "branch"
        )

        quantity = data.get(
            "quantity",
            1
        )

        # -------------------------------------------------
        # Branch
        # -------------------------------------------------

        if branch is None:

            raise ValueError(
                "Branch is required for a physical book."
            )

        # -------------------------------------------------
        # Barcode
        # -------------------------------------------------

        if not barcode:

            raise ValueError(
                "Barcode is required for a physical book."
            )

        barcode = barcode.strip()

        if not barcode:

            raise ValueError(
                "Barcode is required for a physical book."
            )

        # -------------------------------------------------
        # Quantity
        # -------------------------------------------------

        try:

            quantity = int(quantity)

        except (
            TypeError,
            ValueError
        ):

            raise ValueError(
                "Quantity must be a valid number."
            )

        if quantity < 1:

            raise ValueError(
                "Quantity must be at least 1."
            )

        # -------------------------------------------------
        # First barcode must be unique
        # -------------------------------------------------

        existing_book = (
            BookRepository.get_by_barcode(
                barcode
            )
        )

        if existing_book:

            raise ValueError(
                "A book with this barcode already exists."
            )

        # =================================================
        # FIND OR CREATE TITLE
        # =================================================

        if title_record is None:

            from apps.books.services import TitleService

            isbn = data.get(
                "isbn"
            )

            if not isbn:

                raise ValueError(
                    "ISBN is required when creating a new Title."
                )

            isbn = isbn.strip()

            # -------------------------------------------------
            # Reuse Title if ISBN already exists
            # -------------------------------------------------

            existing_title = (
                TitleService.get_title_by_isbn(
                    isbn
                )
            )

            if existing_title:

                title_record = existing_title

            else:

                # -------------------------------------------------
                # Create new Title
                # -------------------------------------------------

                title_data = {
                    "title": data.get(
                        "title",
                        ""
                    ),
                    "author": data.get(
                        "author",
                        ""
                    ),
                    "media_type": data.get(
                        "media_type",
                        "book"
                    ),
                    "identifiers": {
                        "isbn": isbn
                    },
                    "category_id": data.get(
                        "category_id",
                        ""
                    ),
                    "tags": data.get(
                        "tags",
                        []
                    ),
                    "description": data.get(
                        "description",
                        ""
                    ),
                    "publisher": data.get(
                        "publisher",
                        ""
                    ),
                    "publication_year": data.get(
                        "publication_year"
                    ),
                }

                title_record = (
                    TitleService.create_title(
                        title_data
                    )
                )

        # =================================================
        # PREPARE TITLE INFORMATION
        # =================================================

        identifiers = (
            title_record.identifiers
            or {}
        )

        title_isbn = identifiers.get(
            "isbn",
            ""
        )

        # =================================================
        # REMOVE TITLE-LEVEL FIELDS
        # =================================================

        data.pop(
            "media_type",
            None
        )

        data.pop(
            "category_id",
            None
        )

        data.pop(
            "tags",
            None
        )

        # =================================================
        # PHYSICAL COPY TEMPLATE
        # =================================================

        base_data = data.copy()

        base_data["title_record"] = (
            title_record
        )

        base_data["title"] = (
            title_record.title
        )

        base_data["author"] = (
            title_record.author
        )

        base_data["isbn"] = (
            title_isbn
        )

        base_data["publisher"] = (
            title_record.publisher
        )

        base_data["publication_year"] = (
            title_record.publication_year
        )

        base_data["description"] = (
            title_record.description
        )

        # -------------------------------------------------
        # IMPORTANT
        #
        # One Book row = one physical copy.
        #
        # Therefore quantity on every physical Book row
        # is always 1.
        # -------------------------------------------------

        base_data["quantity"] = 1

        base_data["available_quantity"] = 1

        # =================================================
        # CREATE PHYSICAL COPIES
        # =================================================

        created_books = []

        for copy_number in range(
            quantity
        ):

            copy_data = base_data.copy()

            # -------------------------------------------------
            # First copy uses the barcode entered by the user.
            # Additional copies receive unique barcodes.
            # -------------------------------------------------

            if copy_number == 0:

                copy_data["barcode"] = (
                    barcode
                )

            else:

                copy_data["barcode"] = (
                    BookService.generate_barcode()
                )

            # -------------------------------------------------
            # Create physical Book
            # -------------------------------------------------

            book = BookRepository.create(
                copy_data
            )

            created_books.append(
                book
            )

            # -------------------------------------------------
            # Create Inventory record
            # -------------------------------------------------

            from apps.inventory.repositories import (
                InventoryRepository
            )

            InventoryRepository.create(
                {
                    "book": book,
                    "total_quantity": 1,
                    "available_quantity": 1,
                    "issued_quantity": 0,
                    "damaged_quantity": 0,
                    "lost_quantity": 0,
                }
            )

        # =================================================
        # RETURN FIRST PHYSICAL COPY
        # =================================================

        return created_books[0]

    # =====================================================
    # UPDATE BOOK
    # =====================================================

    @staticmethod
    def update_book(
        book_id,
        data
    ):

        book = BookService.get_book(
            book_id
        )

        if "barcode" in data:

            barcode = data["barcode"]

            if not barcode:

                raise ValueError(
                    "Barcode is required."
                )

            existing_book = (
                BookRepository.get_by_barcode(
                    barcode
                )
            )

            if (
                existing_book
                and existing_book.id != book.id
            ):

                raise ValueError(
                    "A book with this barcode already exists."
                )

        return BookRepository.update(
            book,
            data
        )

    # =====================================================
    # DELETE BOOK
    # =====================================================

    @staticmethod
    def delete_book(book_id):

        book = BookService.get_book(
            book_id
        )

        return BookRepository.delete(
            book
        )