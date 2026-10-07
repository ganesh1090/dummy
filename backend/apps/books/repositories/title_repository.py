from apps.books.models import Title


class TitleRepository:

    @staticmethod
    def get_all():
        return Title.objects.all()

    @staticmethod
    def get_by_id(title_id):
        return Title.objects.filter(
            id=title_id
        ).first()

    @staticmethod
    def get_by_identifier(identifier):
        return Title.objects.filter(
            identifiers__contains={"isbn": identifier}
        ).first()

    @staticmethod
    def create(data):
        return Title.objects.create(**data)

    @staticmethod
    def update(title, data):
        for field, value in data.items():
            setattr(title, field, value)

        title.save()

        return title

    @staticmethod
    def delete(title):
        title.delete()