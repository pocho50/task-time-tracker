import type { UserRepository } from '../repository/user';

// get userse services
interface GetUsersInput {
  page: number;
  pageSize: number;
}

export class GetUsersService {
  constructor(private repo: UserRepository) {}

  async execute({ page, pageSize }: GetUsersInput) {
    const skip = (page - 1) * pageSize;
    const [total, users] = await Promise.all([
      this.repo.countUsers(),
      this.repo.findMany(skip, pageSize),
    ]);
    return {
      data: users,
      pagination: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }
}
