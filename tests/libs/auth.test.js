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

    jest.unstable_mockModule("@/modules/general/libs/mongo", () => ({
      default: Promise.resolve(),
    }));
    jest.unstable_mockModule("@/modules/general/libs/env", () => ({ loadAppEnv: jest.fn() }));
    jest.unstable_mockModule("@/modules/general/libs/defaults", () => ({
      defaultSetting: {
        auth: {
          providers: ["google", "resend"],
          hasThemePages: true,
          hasThemeEmails: true,
        },
      },
    }));
    jest.unstable_mockModule("@/modules/general/libs/email", () => ({
      QuickLinkEmail: jest.fn(),
      sendEmail: jest.fn(),
    }));
    jest.unstable_mockModule("@/modules/general/libs/mongoose", () => ({ default: jest.fn() }));
    jest.unstable_mockModule("@/modules/general/libs/utils.server", () => ({
      validateEmail: jest.fn(),
    }));
    jest.unstable_mockModule("@/modules/general/models/User", () => ({
      default: { findOne: jest.fn() },
    }));

    await import("../../modules/auth/libs/auth");
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

  it("should validate email in signIn callback", async () => {
    const config = mockNextAuth.mock.calls[0][0];
    const { validateEmail } = await import("@/modules/general/libs/utils.server");

    validateEmail.mockReturnValue({ isValid: true });
    const result = await config.callbacks.signIn({
      user: { email: "test@example.com" },
    });
    expect(result).toBe(true);
  });

  it("should block invalid email in signIn callback", async () => {
    const config = mockNextAuth.mock.calls[0][0];
    const { validateEmail } = await import("@/modules/general/libs/utils.server");

    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    validateEmail.mockReturnValue({ isValid: false, error: "Invalid domain" });
    const result = await config.callbacks.signIn({
      user: { email: "test@invalid.com" },
    });
    expect(result).toContain("/auth/error?error=EmailValidation");
    consoleWarnSpy.mockRestore();
  });

  it("should allow signIn without email", async () => {
    const config = mockNextAuth.mock.calls[0][0];
    const result = await config.callbacks.signIn({ user: {} });
    expect(result).toBe(true);
  });

  it("should add user styling to session", async () => {
    const config = mockNextAuth.mock.calls[0][0];
    const session = { user: {} };
    const user = { styling: { theme: "dark" } };

    const result = await config.callbacks.session({ session, user });
    expect(result.user.styling).toEqual({ theme: "dark" });
  });

  it("should return session without styling if user has none", async () => {
    const config = mockNextAuth.mock.calls[0][0];
    const session = { user: {} };
    const user = {};

    const result = await config.callbacks.session({ session, user });
    expect(result.user.styling).toBeUndefined();
  });
});
