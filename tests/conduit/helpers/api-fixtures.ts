import { test as base } from './fixtures';
import { ArticleController } from '../../../apps/conduit/Controllers/ArticleController';
import { UserController } from '../../../apps/conduit/Controllers/UserController';
import { ApiController } from '../../../apps/conduit/Controllers/ApiController';

type Fixtures = {
  articleController: ArticleController;
  userController: UserController;
  apiController: ApiController;
};

export const test = base.extend<Fixtures>({
  articleController: async ({ request }, use) => {
    await use(new ArticleController(request));
  },

  userController: async ({ request }, use) => {
    await use(new UserController(request));
  },

  apiController: async ({ request }, use) => {
    await use(new ApiController(request));
  },
});

export { expect } from '@playwright/test';