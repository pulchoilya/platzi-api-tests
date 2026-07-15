import { BaseController } from './BaseController';

export class UserController extends BaseController {
  userEndpoint = '/api/user';
  usersEndpoint = '/api/users';

  async getCurrentUser(
    options?: {
      failOnStatusCode?: boolean;
      timeout?: number;
    },
  ) {
    const response = await this.request.get(this.userEndpoint, {
      failOnStatusCode: options?.failOnStatusCode,
      timeout: options?.timeout,
    });

    return response;
  }

  async updateUser(
    user: {
      email?: string;
      username?: string;
      bio?: string;
      image?: string;
      password?: string;
    },
    options?: {
      failOnStatusCode?: boolean;
      timeout?: number;
    },
  ) {
    const response = await this.request.put(this.userEndpoint, {
      data: {
        user,
      },
      failOnStatusCode: options?.failOnStatusCode,
      timeout: options?.timeout,
    });

    return response;
  }

  async createUser(
    user: {
      email: string;
      password: string;
      username: string;
    },
    options?: {
      failOnStatusCode?: boolean;
      timeout?: number;
    },
  ) {
    const response = await this.request.post(this.usersEndpoint, {
      data: {
        user,
      },
      failOnStatusCode: options?.failOnStatusCode,
      timeout: options?.timeout,
    });

    return response;
  }
}