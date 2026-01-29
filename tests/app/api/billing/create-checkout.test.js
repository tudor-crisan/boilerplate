import { jest } from "@jest/globals";

describe("api/billing/create-checkout", () => {
  let POST;
  let mockStripe;
  let mockUser;
  let mockResponseSuccess;
  let mockResponseError;

  beforeEach(async () => {
    jest.resetModules();
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    process.env.STRIPE_PRICE_ID = "price_monthly";
    process.env.STRIPE_PRICE_ID_LIFETIME = "price_lifetime";

    mockUser = { _id: "user_123", email: "test@example.com" };

    const mockSessionsCreate = jest
      .fn()
      .mockResolvedValue({ url: "https://stripe.com/checkout" });
    mockStripe = jest.fn(() => ({
      checkout: { sessions: { create: mockSessionsCreate } },
    }));

    mockResponseSuccess = jest.fn((msg, data) => ({ msg, data, status: 200 }));
    mockResponseError = jest.fn((msg, data, status) => ({ msg, data, status }));

    jest.unstable_mockModule("stripe", () => ({ default: mockStripe }));
    jest.unstable_mockModule("@/modules/general/libs/apiHandler", () => ({
      withApiHandler: (handler) => async (req) =>
        handler(req, { user: mockUser }),
    }));
    jest.unstable_mockModule("@/modules/general/libs/utils.server", () => ({
      getBaseUrl: () => "http://localhost:3000",
      responseSuccess: mockResponseSuccess,
      responseError: mockResponseError,
    }));
    jest.unstable_mockModule("@/modules/general/libs/defaults", () => ({
      defaultSetting: {
        forms: {
          general: {
            backend: {
              responses: { serverError: { message: "Error", status: 500 } },
            },
          },
          Billing: {
            backend: {
              responses: {
                checkoutCreated: { message: "Created", status: 200 },
              },
            },
          },
        },
        paths: {
          billingSuccess: { source: "/success" },
          dashboard: { source: "/dashboard" },
        },
      },
    }));

    const mod =
      await import("../../../../app/api/modules/billing/create-checkout/route");
    POST = mod.POST;
  });

  it("should create a subscription checkout session for monthly type", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ type: "monthly" }),
    };

    const res = await POST(req);

    expect(mockStripe).toHaveBeenCalledWith("sk_test_123");
    const stripeInstance = mockStripe.mock.results[0].value;
    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_monthly", quantity: 1 }],
        client_reference_id: "user_123",
        customer_email: "test@example.com",
      }),
    );
    expect(res.data.url).toBe("https://stripe.com/checkout");
  });

  it("should create a payment checkout session for lifetime type", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ type: "lifetime" }),
    };

    await POST(req);

    const stripeInstance = mockStripe.mock.results[0].value;
    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_lifetime", quantity: 1 }],
      }),
    );
  });

  it("should use customer ID if user already has one", async () => {
    mockUser.customerId = "cus_123";
    const req = {
      json: jest.fn().mockResolvedValue({ type: "monthly" }),
    };

    await POST(req);

    const stripeInstance = mockStripe.mock.results[0].value;
    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_123",
      }),
    );
    expect(
      stripeInstance.checkout.sessions.create.mock.calls[0][0].customer_email,
    ).toBeUndefined();
  });

  it("should return error if STRIPE_SECRET_KEY is missing", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.STRIPE_SECRET_KEY;
    const req = {
      json: jest.fn().mockResolvedValue({ type: "monthly" }),
    };

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(res.msg).toBe("Error");
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
