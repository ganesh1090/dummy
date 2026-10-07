from apps.branches.repositories import BranchRepository


class BranchService:

    @staticmethod
    def get_all_branches():
        return BranchRepository.get_all()

    @staticmethod
    def get_branch(branch_id):
        branch = BranchRepository.get_by_id(branch_id)

        if branch is None:
            raise ValueError(
                "Branch not found."
            )

        return branch

    @staticmethod
    def _generate_branch_id():

        number = 1

        while True:

            branch_id = f"B-{number:03d}"

            if BranchRepository.get_by_id(
                branch_id
            ) is None:
                return branch_id

            number += 1

    @staticmethod
    def create_branch(data):

        existing_branch = (
            BranchRepository.get_by_name(
                data["name"]
            )
        )

        if existing_branch:
            raise ValueError(
                "A branch with this name already exists."
            )

        data = data.copy()

        data["id"] = (
            BranchService._generate_branch_id()
        )

        return BranchRepository.create(data)

    @staticmethod
    def update_branch(branch_id, data):

        branch = BranchService.get_branch(
            branch_id
        )

        if "name" in data:

            existing_branch = (
                BranchRepository.get_by_name(
                    data["name"]
                )
            )

            if (
                existing_branch
                and existing_branch.id != branch.id
            ):
                raise ValueError(
                    "A branch with this name already exists."
                )

        return BranchRepository.update(
            branch,
            data
        )

    @staticmethod
    def delete_branch(branch_id):

        branch = BranchService.get_branch(
            branch_id
        )

        return BranchRepository.delete(
            branch
        )