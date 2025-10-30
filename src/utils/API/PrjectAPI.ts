import { APIRequestContext } from "@playwright/test";
import { UserApi } from "./UserAPI";
import { ConsultantApi } from "./ConsultantApi ";
import { KlantApi } from "./KlantApi";

export type ProjectData = {
  _id?: string;
  accountManager?: string;
  consultantId?: string;
  startDate?: string;
  client?: {
    clientId?: string;
    defaultInvoiceLines?: Array<{
      desc?: string;
      price?: number;
      amount?: number;
      tax?: number;
      type?: string;
      sort?: number;
    }>;
    advancedInvoicing?: boolean;
  };
  projectMonthConfig?: {
    changingOrderNr?: boolean;
    proforma?: string;
    timesheetCheck?: boolean;
    inboundInvoice?: boolean;
  };
  contract?: {
    status?: string;
    notes?: string;
  };
  audit?: Record<string, any>;
  forEndCustomer?: boolean;
  endCustomer?: string | null;
  comments?: any[];
};

export class ProjectApi {
  private static endpoint = `${process.env.BASE_URL_API}/api/projects`;

  /**
   * Get all projects
   */
  static async getAll(request: APIRequestContext): Promise<ProjectData[]> {
    const response = await request.get(ProjectApi.endpoint);

    if (!response.ok()) {
      throw new Error(
        `Failed to fetch projects: ${response.status()} ${await response.text()}`
      );
    }

    const contentType = response.headers()["content-type"] || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(
        `Expected JSON but got ${contentType}\nResponse:\n${text}`
      );
    }

    return await response.json();
  }

  /**
   * Create a project
   */
  static async create(
    request: APIRequestContext,
    {
      accountManagerName,
      consultantName,
      clientName,
      ...overrides
    }: {
      accountManagerName: string;
      consultantName: string;
      clientName: string;
    } & Partial<ProjectData>
  ): Promise<ProjectData> {
    // --- Lookups ---
    const users = await UserApi.getAll(request);
    const consultants = await ConsultantApi.getAll(request);
    const clients = await KlantApi.getAll(request);

    const accountManager = users.find((u) => u.name === accountManagerName);
    const consultant = consultants.find((c) => c.name === consultantName);
    const klant = clients.find((k) => k.name === clientName);

    if (!accountManager)
      throw new Error(`Account manager '${accountManagerName}' not found`);
    if (!consultant)
      throw new Error(`Consultant '${consultantName}' not found`);
    if (!klant) throw new Error(`Client '${clientName}' not found`);

    // --- Payload ---
    const defaultPayload: ProjectData = {
      _id: "",
      accountManager: accountManager._id,
      consultantId: consultant._id,
      startDate: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
      client: {
        clientId: klant._id,
        defaultInvoiceLines: [
          { desc: "", price: 0, amount: 0, tax: 21, type: "daily", sort: 0 },
        ],
        advancedInvoicing: false,
      },
      projectMonthConfig: {
        changingOrderNr: false,
        proforma: "no",
        timesheetCheck: true,
        inboundInvoice: false,
      },
      contract: { status: "NoContract", notes: "" },
      audit: {},
      forEndCustomer: false,
      endCustomer: null,
      comments: [],
      ...overrides,
    };

    // --- API Call ---
    const response = await request.post(ProjectApi.endpoint, {
      data: defaultPayload,
    });
    if (!response.ok())
      throw new Error(
        `Failed to create project: ${response.status()} ${await response.text()}`
      );

    return await response.json();
  }

  /**
   * Safe create — skip creation if project already exists (same consultant + client)
   */
  static async safeCreate(
    request: APIRequestContext,
    params: {
      accountManagerName: string;
      consultantName: string;
      clientName: string;
    } & Partial<ProjectData>
  ): Promise<ProjectData> {
    const { accountManagerName, consultantName, clientName } = params;

    // Lookup dependencies first
    const users = await UserApi.getAll(request);
    const consultants = await ConsultantApi.getAll(request);
    const clients = await KlantApi.getAll(request);

    const accountManager = users.find((u) => u.name === accountManagerName);
    const consultant = consultants.find((c) => c.name === consultantName);
    const klant = clients.find((k) => k.name === clientName);

    if (!accountManager || !consultant || !klant) {
      throw new Error(
        `Cannot safely create project: one of the required records is missing.\n` +
          `AccountManager: ${!!accountManager}, Consultant: ${!!consultant}, Client: ${!!klant}`
      );
    }

    const projects = await ProjectApi.getAll(request);
    const existing = projects.find(
      (p) =>
        p.accountManager === accountManager._id &&
        p.consultantId === consultant._id &&
        p.client?.clientId === klant._id
    );

    if (existing) {
      console.log(
        `Project already exists for ${consultant.name} → ${klant.name}`
      );
      return existing;
    }

    console.log(`Creating new project for ${consultant.name} → ${klant.name}`);
    return await ProjectApi.create(request, params);
  }
}
