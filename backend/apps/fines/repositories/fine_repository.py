from apps.fines.models import Fine


class FineRepository:

    @staticmethod
    def get_all():
        return (
            Fine.objects
            .select_related(
                "issue",
                "issue__book",
                "issue__member",
            )
            .order_by("-created_at")
        )

    @staticmethod
    def get_by_id(fine_id):
        return (
            Fine.objects
            .select_related(
                "issue",
                "issue__book",
                "issue__member",
            )
            .filter(id=fine_id)
            .first()
        )

    @staticmethod
    def get_by_issue_id(issue_id):
        return (
            Fine.objects
            .select_related(
                "issue",
                "issue__book",
                "issue__member",
            )
            .filter(issue_id=issue_id)
            .first()
        )

    @staticmethod
    def create(data):
        return Fine.objects.create(
            **data
        )

    @staticmethod
    def update(fine, data):

        for field, value in data.items():
            setattr(fine, field, value)

        fine.save()

        return fine