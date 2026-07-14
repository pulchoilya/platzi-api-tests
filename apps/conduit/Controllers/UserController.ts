import { BaseController } from './BaseController';

export class ArticleController extends BaseController {
  articlesEndpoint = '/api/articles';

  async getArticles(
    params?: {
      offset?: number;
      limit?: number;
      tag?: string;
      author?: string;
      favorited?: string;
    },
    options?: {
      failOnStatusCode?: boolean;
    },
  ){
    const response = await this.request.get(this.articlesEndpoint, {
      params,
      failOnStatusCode: options?.failOnStatusCode,
    });
    return response;
  }

  async createArticle(
    article: {
      title?: string;
      description?: string;
      body?: string;
      tagList: string[];
    },
    options?: {
      failOnStatusCode?: boolean;
      timeout?: number;
      isCleanup?: boolean;
    },
  ){
    const response = await this.request.post(this.articlesEndpoint, {
      data: {
        article,
      },
      failOnStatusCode: options?.failOnStatusCode,
      timeout: options?.timeout,
    }); 
    return response;
  }
};