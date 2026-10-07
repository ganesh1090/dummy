from django.db.models import Q

from apps.books.models import Book


class BookFilter:

    @staticmethod
    def filter_books(
        queryset,
        search=None,
        author=None,
        publisher=None,
        available=None,
    ):

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(author__icontains=search)
                | Q(isbn__icontains=search)
                | Q(barcode__icontains=search)
                | Q(title_record__title__icontains=search)
                | Q(title_record__author__icontains=search)
                | Q(
                    title_record__identifiers__isbn__icontains=search
                )
            )

        if author:
            queryset = queryset.filter(
                Q(author__icontains=author)
                | Q(title_record__author__icontains=author)
            )

        if publisher:
            queryset = queryset.filter(
                Q(publisher__icontains=publisher)
                | Q(title_record__publisher__icontains=publisher)
            )

        if available is True:
            queryset = queryset.filter(
                status="AVAILABLE"
            )

        elif available is False:
            queryset = queryset.exclude(
                status="AVAILABLE"
            )

        return queryset.distinct()