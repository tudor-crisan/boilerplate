import { jest } from "@jest/globals";

describe("api/resend/webhook", () => {
  let POST;
  let mockWebhook;
  let mockResend;
  let mockEmail;

  beforeEach(async () => {
    jest.resetModules();
    process.env.RESEND_WEBHOOK_SECRET = "whsec_123";
    process.env.RESEND_API_KEY = "re_123";

    const mockVerify = jest.fn().mockReturnValue({
      type: "email.received",
      data: {
        email_id: "em_123",
        subject: "Hello",
        from: "sender@other.com",
        to: ["alias@mydomain.com"],
        message_id: "msg_123",
      },
    });
    const webhookMockObject = {
      verify: mockVerify,
    };
    mockWebhook = jest.fn(() => webhookMockObject);

    mockResend = jest.fn().mockImplementation(() => ({
      emails: {
        receiving: {
          get: jest
            .fn()
            .mockResolvedValue({
              data: { html: "<p>Body</p>", text: "Body" },
              error: null,
            }),
        },
      },
    }));

    mockEmail = {
      sendEmail: jest.fn().mockResolvedValue({}),
    };

    jest.unstable_mockModule("svix", () => ({ Webhook: mockWebhook }));
    jest.unstable_mockModule("resend", () => ({ Resend: mockResend }));
    jest.unstable_mockModule("@/libs/email", () => mockEmail);
    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: { business: { incoming_email: "forward@test.com" } },
    }));
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: { json: (data, opts) => ({ ...data, ...opts }) },
    }));

    const mod = await import("../../../../app/api/resend/webhook/route");
    POST = mod.POST;

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should forward received email", async () => {
    const webhookMockObject = mockWebhook();
    const req = {
      json: jest.fn().mockResolvedValue({}),
      headers: {
        get: jest.fn((key) => {
          if (key === "svix-id") return "id";
          if (key === "svix-timestamp") return "ts";
          if (key === "svix-signature") return "sig";
          return null;
        }),
      },
    };

    const res = await POST(req);

    expect(mockEmail.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "forward@test.com",
        subject: "FW: Hello",
        html: expect.stringContaining("Body"),
      }),
    );
    expect(res.message).toBe("Email forwarded");
  });

  it("should return 400 if svix headers missing", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({}),
      headers: { get: jest.fn().mockReturnValue(null) },
    };

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res.message).toContain("no svix headers");
  });

  it("should return 400 if verification fails", async () => {
    const webhookMockObject = mockWebhook();
    webhookMockObject.verify.mockImplementation(() => {
      throw new Error("Fail");
    });

    const req = {
      json: jest.fn().mockResolvedValue({}),
      headers: { get: jest.fn().mockReturnValue("val") },
    };

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
