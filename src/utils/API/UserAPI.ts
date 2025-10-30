import { APIRequestContext } from '@playwright/test';

export type UserData = {
  _id?: string;
  name?: string;
  firstName?: string;
  alias?: string;
  email?: string;
  active?: boolean;
  roles?: string[];
  audit?: Record<string, any>;
};

export class UserApi {
  /** Base URL for user API */
  private static endpoint = `${process.env.BASE_URL_API}/api/user`;

  /**
   * Fetch all users
   */
  static async getAll(request: APIRequestContext): Promise<UserData[]> {
    const response = await request.get(UserApi.endpoint);
    if (!response.ok()) {
      throw new Error(`Failed to fetch users: ${response.status()} ${await response.text()}`);
    }
    return await response.json();
  }

  /**
   * Create a user
   */
  static async createUser(request: APIRequestContext, overrides: Partial<UserData> = {}) {
    const defaultPayload: UserData = {
      _id: '',
      name: 'e2e-test-user',
      firstName: ' ',
      alias: '',
      email: '',
      active: true,
      roles: ['1'],
      audit: {},
      ...overrides,
    };

    const response = await request.post(UserApi.endpoint, { data: defaultPayload });
    if (!response.ok()) {
      throw new Error(`Failed to create user: ${response.status()} ${await response.text()}`);
    }
    return await response.json();
  }

  /**
   * Safe create: create user if not already present
   */
  static async safeCreateUser(
    request: APIRequestContext,
    overrides: Partial<UserData> = {}
  ): Promise<UserData> {
    const users = await UserApi.getAll(request);

    // You can change the matching condition if needed
    const existing = users.find(
      u =>
        (overrides.email && u.email === overrides.email) ||
        (!overrides.email && u.name === (overrides.name || 'e2e-test-user'))
    );

    if (existing) {
      console.log(`User '${existing.name}' already exists, skipping creation.`);
      return existing;
    }

    console.log(`User not found, creating new user: ${overrides.name ?? 'e2e-test-user'}`);
    return await UserApi.createUser(request, overrides);
  }
}
