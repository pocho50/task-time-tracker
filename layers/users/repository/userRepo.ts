import { BaseRepo } from '#layers/shared/repository/baseRepo';

export class UserRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/users';
  getAll() {
    const query = this.getQueryParams();
    return this.fetch(`${this.basePath}?${query}`);
  }

  getMe() {
    return this.fetch(`${this.basePath}/me`);
  }

  saveMe(settingsData: SettingsDataForm) {
    return this.fetch(`${this.basePath}/save-me`, {
      method: 'POST',
      body: settingsData,
    });
  }

  save(data: UserDataForm) {
    return this.fetch(`${this.basePath}/save`, {
      method: 'POST',
      body: data,
    });
  }

  remove(id: string) {
    return this.fetch(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
  }
}
