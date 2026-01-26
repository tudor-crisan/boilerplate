import { jest } from "@jest/globals";

describe("libs/auth", () => {
  let mockNextAuth;
  let mockGoogle;
  let mockResend;
  let mockMongoAdapter;

  beforeEach(async () => {
    jest.resetModules();
    process.env.RESEND_API_KEY = "resend-key";
    process.env.GOOGLE_CLIENT_ID = "google-id";

    mockNextAuth = jest.fn(() => ({
      handlers: {},
      signIn: {},
      signOut: {},
      auth: {},
    }));
    mockGoogle = jest.fn(() => ({ id: "google" }));
    mockResend = jest.fn(() => ({ id: "resend" }));
    mockMongoAdapter = jest.fn(() => "adapter");

    jest.unstable_mockModule("next-auth", () => ({ default: mockNextAuth }));
    jest.unstable_mockModule("next-auth/providers/google", () => ({
      default: mockGoogle,
    }));
    jest.unstable_mockModule("next-auth/providers/resend", () => ({
      default: mockResend,
    }));
    jest.unstable_mockModule("@auth/mongodb-adapter", () => ({
      MongoDBAdapter: mockMongoAdapter,
    }));

    jest.unstable_mockModule("@/libs/mongo", () => ({
      default: Promise.resolve(),
    }));
    jest.unstable_mockModule("@/libs/env", () => ({ loadAppEnv: jest.fn() }));
    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: {
        auth: {
          providers: ["google", "resend"],
          hasThemePages: true,
          hasThemeEmails: true,
        },
      },
    }));
    jest.unstable_mockModule("@/libs/email", () => ({
      QuickLinkEmail: jest.fn(),
      sendEmail: jest.fn(),
    }));
    jest.unstable_mockModule("@/libs/mongoose", () => ({ default: jest.fn() }));
    jest.unstable_mockModule("@/libs/utils.server", () => ({
      validateEmail: jest.fn(),
    }));
    jest.unstable_mockModule("@/models/User", () => ({
      default: { findOne: jest.fn() },
    }));

    await import("../../libs/auth");
  });

  it("should initialize NextAuth with correct providers", () => {
    expect(mockNextAuth).toHaveBeenCalled();
    const config = mockNextAuth.mock.calls[0][0];

    expect(config.providers).toHaveLength(2);
    expect(mockGoogle).toHaveBeenCalled();
    expect(mockResend).toHaveBeenCalled();
  });

  it("should configure adapter", () => {
    const config = mockNextAuth.mock.calls[0][0];
    expect(config.adapter).toBe("adapter");
  });

  it("should set custom pages", () => {
    const config = mockNextAuth.mock.calls[0][0];
    expect(config.pages).toEqual({
      signIn: "/auth/signin",
      verifyRequest: "/auth/verify-request",
      error: "/auth/error",
    });
  });
});
