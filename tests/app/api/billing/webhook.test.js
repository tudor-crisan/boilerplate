import { jest } from "@jest/globals";

describe("api/billing/webhook", () => {
  let POST;
  let mockStripe;
  let mockUserModel;

  beforeEach(async () => {
    jest.resetModules();
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_123";

    const mockConstructEvent = jest.fn();
    const stripeMockObject = {
      webhooks: { constructEvent: mockConstructEvent },
    };
    mockStripe = jest.fn(() => stripeMockObject);

    mockUserModel = {
      findById: jest.fn(),
      findOne: jest.fn(),
    };

    jest.unstable_mockModule("stripe", () => ({ default: mockStripe }));
    jest.unstable_mockModule("next/headers", () => ({
      headers: jest.fn().mockResolvedValue({ get: () => "sig" }),
    }));
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: { json: (data, opts) => ({ ...data, ...opts }) },
    }));
    jest.unstable_mockModule("@/modules/general/libs/mongoose", () => ({ default: jest.fn() }));
    jest.unstable_mockModule("@/modules/general/models/User", () => ({
      default: mockUserModel,
    }));

    const mod = await import("../../../../app/api/modules/billing/webhook/route");
    POST = mod.POST;

    jest.spyOn(console, "log").mockImplementation(() => {});
    // We already spy on error in the specific fail test, but let's suppress it here too if needed
    // Actually, sprying on it here might conflict with the specific test.
    // Let's just suppress log here.
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should handle checkout.session.completed and grant access", async () => {
    const stripeMockObject = mockStripe();
    stripeMockObject.webhooks.constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: "user_123",
          customer: "cus_123",
        },
      },
    });

    const mockUser = { _id: "user_123", save: jest.fn() };
    mockUserModel.findById.mockResolvedValue(mockUser);

    const req = { text: jest.fn().mockResolvedValue("{}") };
    const res = await POST(req);

    expect(mockUserModel.findById).toHaveBeenCalledWith("user_123");
    expect(mockUser.hasAccess).toBe(true);
    expect(mockUser.customerId).toBe("cus_123");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.received).toBe(true);
  });

  it("should handle customer.subscription.deleted and revoke access", async () => {
    const stripeMockObject = mockStripe();
    stripeMockObject.webhooks.constructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: {
        object: {
          customer: "cus_123",
        },
      },
    });

    const mockUser = { _id: "user_123", save: jest.fn() };
    mockUserModel.findOne.mockResolvedValue(mockUser);

    const req = { text: jest.fn().mockResolvedValue("{}") };
    const res = await POST(req);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      customerId: "cus_123",
    });
    expect(mockUser.hasAccess).toBe(false);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.received).toBe(true);
  });

  it("should return 400 if signature verification fails", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const stripeMockObject = mockStripe();
    stripeMockObject.webhooks.constructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const req = { text: jest.fn().mockResolvedValue("{}") };
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res.error).toContain("Webhook Error");
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
