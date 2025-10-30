import { APIRequestContext } from '@playwright/test';
import { AlphaNumericHelper } from '../helpers/AlphaNumericHelper';

const klantName = "Test API klant"
const klantbtw = AlphaNumericHelper.randomBtw();

export type KlantData = {
  _id?: string;
  slug?: string;
  active?: boolean;
  name?: string;
  types?: string[];
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  telephone?: string;
  btw?: string;
  invoiceFileName?: string;
  hoursInDay?: number;
  defaultInvoiceLines?: any[];
  attachments?: any[];
  notes?: string;
  comments?: any[];
  defaultInvoiceDateStrategy?: string;
  defaultChangingOrderNr?: boolean;
  email?: {
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    body?: string;
    attachments?: any[];
    combineAttachments?: boolean;
  };
  language?: string;
  frameworkAgreement?: { status?: string; notes?: string };
  audit?: Record<string, any>;
};

export class KlantApi {
  private static endpoint = `${process.env.BASE_URL_API}/api/clients`;

  /**
   * Get all clients
   */
  static async getAll(request: APIRequestContext): Promise<KlantData[]> {
    const response = await request.get(KlantApi.endpoint);
    if (!response.ok()) throw new Error(`Failed to fetch clients: ${response.status()} ${await response.text()}`);

    const contentType = response.headers()['content-type'] || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got ${contentType}\nResponse:\n${text}`);
    }

    return await response.json();
  }

  /**
   * Create a client
   */
  static async create(request: APIRequestContext, overrides: Partial<KlantData> = {}) {
    const defaultPayload: KlantData = {
      _id: '',
      slug: '',
      active: true,
      name: klantName,
      types: ['endCustomer'],
      address: '',
      city: '',
      postalCode: '',
      country: '',
      telephone: '',
      btw: klantbtw,
      invoiceFileName: '',
      hoursInDay: 8,
      defaultInvoiceLines: [],
      attachments: [],
      notes: '',
      comments: [],
      defaultInvoiceDateStrategy: 'prev-month-last-day',
      defaultChangingOrderNr: false,
      email: {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        attachments: [],
        combineAttachments: false,
      },
      language: 'en',
      frameworkAgreement: { status: 'NoContract', notes: '' },
      audit: {},
      ...overrides,
    };

    const response = await request.post(KlantApi.endpoint, { data: defaultPayload });
    if (!response.ok()) throw new Error(`Failed to create client: ${response.status()} ${await response.text()}`);

    return await response.json();
  }

  /**
   * Safe create — only create if not already exists
   */
  static async safeCreateKlant(request: APIRequestContext, overrides: Partial<KlantData> = {}): Promise<KlantData> {
    const clients = await KlantApi.getAll(request);
    const existing = clients.find(c => c.name === (overrides.name || klantName));

    if (existing) {
      console.log(`Client '${existing.name}' already exists, skipping creation.`);
      return existing;
    }

    console.log(`Creating new client '${overrides.name ?? 'Test API klant'}'`);
    return await KlantApi.create(request, overrides);
  }
}