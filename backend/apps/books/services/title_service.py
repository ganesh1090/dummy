from apps.books.repositories import TitleRepository


class TitleService:

    @staticmethod
    def get_all_titles():
        return TitleRepository.get_all()

    @staticmethod
    def get_title(title_id):
        title = TitleRepository.get_by_id(
            title_id
        )

        if title is None:
            raise ValueError(
                "Title not found."
            )

        return title

    @staticmethod
    def get_title_by_isbn(isbn):

        if not isbn:
            return None

        isbn = isbn.strip()

        if not isbn:
            return None

        return TitleRepository.get_by_identifier(
            isbn
        )

    @staticmethod
    def _generate_title_id():

        number = 1

        while True:

            title_id = f"T-{number:03d}"

            if TitleRepository.get_by_id(
                title_id
            ) is None:
                return title_id

            number += 1

    @staticmethod
    def create_title(data):

        data = data.copy()

        data["id"] = (
            TitleService._generate_title_id()
        )

        return TitleRepository.create(
            data
        )

    @staticmethod
    def update_title(title_id, data):

        title = TitleService.get_title(
            title_id
        )

        data = data.copy()

        data.pop("id", None)

        return TitleRepository.update(
            title,
            data
        )

    @staticmethod
    def delete_title(title_id):

        title = TitleService.get_title(
            title_id
        )

        return TitleRepository.delete(
            title
        )