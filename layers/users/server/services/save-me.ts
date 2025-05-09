import type { UserRepository } from '../repository/user';

type UserProfileUpdate = {
  name?: string;
  locale?: string;
  theme?: string;
};

export class SaveMeService {
  constructor(private repo: UserRepository) {}

  async execute(userId: string, userData: UserProfileUpdate) {
    // Only allow updating specific profile fields (name, locale, theme)
    const allowedUpdates = {
      name: userData.name,
      locale: userData.locale,
      theme: userData.theme,
    };
    
    // Return the updated user
    return this.repo.update(userId, allowedUpdates);
  }
}
