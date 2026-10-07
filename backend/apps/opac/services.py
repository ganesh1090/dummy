from django.db.models import Q

from apps.books.models import Book, Title


class OPACService:

    @staticmethod
    def search_titles(
        search=None,
        category=None,
        media_type=None,
        available=None,
    ):
        """
        Search the library catalogue at Title level.

        One Title = one catalogue record,
        regardless of how many physical Books exist.
        """

        titles = Title.objects.filter(
            is_active=True
        )

        # -----------------------------------------
        # Search
        # -----------------------------------------

        if search:
            search = search.strip()

            if search:
                titles = titles.filter(
                    Q(title__icontains=search)
                    | Q(author__icontains=search)
                    | Q(publisher__icontains=search)
                    | Q(identifiers__isbn=search)
                    | Q(
                        physical_books__barcode__icontains=search
                    )
                ).distinct()

        # -----------------------------------------
        # Category
        # -----------------------------------------

        if category:
            titles = titles.filter(
                category_id__iexact=category
            )

        # -----------------------------------------
        # Media type
        # -----------------------------------------

        if media_type:
            titles = titles.filter(
                media_type__iexact=media_type
            )

        # -----------------------------------------
        # Available filter
        # -----------------------------------------

        if available is True:
            titles = titles.filter(
                physical_books__is_active=True,
                physical_books__status="AVAILABLE",
            ).distinct()

        return titles.order_by("title")

    @staticmethod
    def get_title(title_id):
        """
        Return one Title record.
        """

        return (
            Title.objects
            .filter(
                id=title_id,
                is_active=True
            )
            .first()
        )

    @staticmethod
    def get_isbn(title):
        """
        Get ISBN from the Title identifiers JSON.
        """

        identifiers = title.identifiers or {}

        return identifiers.get(
            "isbn",
            ""
        )

    @staticmethod
    def get_title_data(title):
        """
        Convert a Title and its physical copies
        into an OPAC-friendly dictionary.
        """

        physical_books = (
            Book.objects
            .filter(
                title_record=title,
                is_active=True
            )
            .select_related("branch")
        )

        total_copies = physical_books.count()

        available_copies = physical_books.filter(
            status="AVAILABLE"
        ).count()

        # -----------------------------------------
        # Branch availability
        # -----------------------------------------

        branches = []

        branch_ids = (
            physical_books
            .values_list(
                "branch_id",
                flat=True
            )
            .distinct()
        )

        for branch_id in branch_ids:

            branch_books = physical_books.filter(
                branch_id=branch_id
            )

            branch = (
                branch_books
                .select_related("branch")
                .first()
            )

            if not branch or not branch.branch:
                continue

            branch_total = branch_books.count()

            branch_available = branch_books.filter(
                status="AVAILABLE"
            ).count()

            branches.append(
                {
                    "id": branch.branch.id,
                    "name": branch.branch.name,
                    "total_copies": branch_total,
                    "available_copies": branch_available,
                }
            )

        return {
            "id": str(title.id),

            "title": title.title,

            "author": title.author,

            "isbn": OPACService.get_isbn(
                title
            ),

            "media_type": title.media_type,

            "publisher": title.publisher,

            "publication_year": (
                title.publication_year
            ),

            "description": title.description,

            "category": str(
                title.category_id or ""
            ),

            "total_copies": total_copies,

            "available_copies": available_copies,

            "branches": branches,
        }

    @staticmethod
    def get_catalogue(
        search=None,
        category=None,
        media_type=None,
        available=None,
    ):
        """
        Return OPAC catalogue records.
        """

        titles = OPACService.search_titles(
            search=search,
            category=category,
            media_type=media_type,
            available=available,
        )

        return [
            OPACService.get_title_data(
                title
            )
            for title in titles
        ]

    @staticmethod
    def get_title_details(title_id):

        title = OPACService.get_title(
            title_id
        )

        if title is None:
            return None

        return OPACService.get_title_data(
            title
        )