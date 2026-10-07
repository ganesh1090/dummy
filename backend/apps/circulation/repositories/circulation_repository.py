from apps.circulation.models import BookIssue


class CirculationRepository:

    @staticmethod
    def get_all():
        return (
            BookIssue.objects
            .select_related(
                "book",
                "member",
                "issued_by",
            )
            .order_by("-issue_date")
        )

    @staticmethod
    def get_by_user(user):
        return (
            BookIssue.objects
            .select_related(
                "book",
                "member",
                "issued_by",
            )
            .filter(
                member__user=user
            )
            .order_by("-issue_date")
        )

    @staticmethod
    def get_by_member(member_id):
        return (
            BookIssue.objects
            .select_related(
                "book",
                "member",
                "issued_by",
            )
            .filter(
                member_id=member_id
            )
            .order_by("-issue_date")
        )

    @staticmethod
    def get_by_id(issue_id):
        return (
            BookIssue.objects
            .select_related(
                "book",
                "member",
                "issued_by",
            )
            .filter(id=issue_id)
            .first()
        )

    @staticmethod
    def get_active_issue(book_id, member_id):
        return (
            BookIssue.objects
            .filter(
                book_id=book_id,
                member_id=member_id,
                status="ISSUED",
                return_date__isnull=True,
            )
            .first()
        )

    @staticmethod
    def create(data):
        return BookIssue.objects.create(
            **data
        )

    @staticmethod
    def update(issue, data):

        for field, value in data.items():
            setattr(issue, field, value)

        issue.save()

        return issue