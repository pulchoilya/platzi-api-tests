import {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

type UserData = {
  email?: string;
  bio?: string;
  image?: string;
  username?: string;
};

export class UserController {
  request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(email: string, password: string): Promise<APIResponse> {
    return await this.request.post('users/login', {
      data: {
        user: {
          email,
          password,
        },
      },
      failOnStatusCode: true,
    });
  }

  async getCurrentUser(token: string): Promise<APIResponse> {
    return await this.request.get('user', {
      headers: {
        Authorization: `Token ${token}`,
      },
      failOnStatusCode: true,
    });
  }

  async updateUser(
    token: string,
    userData: UserData,
  ): Promise<APIResponse> {
    return await this.request.put('user', {
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        user: userData,
      },
      failOnStatusCode: true,
    });
  }
}