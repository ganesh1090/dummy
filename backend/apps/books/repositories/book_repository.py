from apps.books.models import Book


class BookRepository:

    @staticmethod
    def get_all():
        return Book.objects.filter(
            is_active=True
        ).order_by("title")

    @staticmethod
    def get_by_id(book_id):
        return Book.objects.filter(
            id=book_id,
            is_active=True,
        ).first()

    @staticmethod
    def get_by_isbn(isbn):
        return Book.objects.filter(
            isbn=isbn
        ).first()

    @staticmethod
    def get_by_barcode(barcode):
        return Book.objects.filter(
            barcode=barcode
        ).first()

    @staticmethod
    def create(data):
        return Book.objects.create(
            **data
        )

    @staticmethod
    def update(book, data):
        for field, value in data.items():
            setattr(book, field, value)

        book.save()

        return book

    @staticmethod
    def delete(book):
        book.is_active = False

        book.save(
            update_fields=["is_active"]
        )

        return book