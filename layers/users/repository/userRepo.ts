import { BaseRepo } from '#layers/shared/repository/baseRepo';

export class UserRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/users';
  getAll() {
    return this.fetch(`${this.basePath}`);
  }

  getMe() {
    return this.fetch(`${this.basePath}/me`);
  }

  saveMe(user: UserDataForm) {
    return this.fetch(`${this.basePath}/save-me`, {
      method: 'POST',
      body: user,
    });
  }
}
