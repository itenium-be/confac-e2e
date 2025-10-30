import { APIRequestContext } from '@playwright/test';

export type ConsultantData = {
  _id?: string;
  name?: string;
  firstName?: string;
  slug?: string;
  type?: string;
  email?: string;
  telephone?: string;
  active?: boolean;
  audit?: Record<string, any>;
  accountingCode?: string;
};

export class ConsultantApi {
  private static endpoint = `${process.env.BASE_URL_API}/api/consultants`;

  /**
   * Get all consultants
   */
  static async getAll(request: APIRequestContext): Promise<ConsultantData[]> {
    const response = await request.get(ConsultantApi.endpoint);
    if (!response.ok()) throw new Error(`Failed to fetch consultants: ${response.status()} ${await response.text()}`);

    const contentType = response.headers()['content-type'] || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got ${contentType}\nResponse:\n${text}`);
    }

    return await response.json();
  }

  /**
   * Create a consultant
   */
  static async create(request: APIRequestContext, overrides: Partial<ConsultantData> = {}) {
    const defaultPayload: ConsultantData = {
      _id: '',
      name: 'Default Consultant',
      firstName: 'Default First',
      slug: '',
      type: 'consultant',
      email: 'default@example.com',
      telephone: '0000000000',
      active: true,
      audit: {},
      accountingCode: 'DEFAULT',
      ...overrides,
    };

    const response = await request.post(ConsultantApi.endpoint, { data: defaultPayload });
    if (!response.ok())
      throw new Error(`Failed to create consultant: ${response.status()} ${await response.text()}`);

    return await response.json();
  }

  /**
   * Safe create — only create if not already exists
   */
  static async safeCreateConsultant(
    request: APIRequestContext,
    overrides: Partial<ConsultantData> = {}
  ): Promise<ConsultantData> {
    const consultants = await ConsultantApi.getAll(request);
    const existing = consultants.find(c => c.name === (overrides.name || 'Default Consultant'));

    if (existing) {
      console.log(`Consultant '${existing.name}' already exists, skipping creation.`);
      return existing;
    }

    console.log(`Creating new consultant '${overrides.name ?? 'Default Consultant'}'`);
    return await ConsultantApi.create(request, overrides);
  }
}
