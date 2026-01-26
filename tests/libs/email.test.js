import { jest } from "@jest/globals";

describe("libs/email", () => {
  let sendEmail;
  let QuickLinkEmail;
  let fetchMock;

  beforeAll(async () => {
    // Mock fetch
    fetchMock = jest.fn();
    global.fetch = fetchMock;

    // Mock environment
    process.env.RESEND_API_KEY = "test-key";

    // Mock emailTemplates (dependencies) if complex, but assuming simple
    // Mocking react-dom/server might be needed if not available in environment,
    // but JSDOM usually handles it or we mock it to avoid React rendering complexity.

    jest.unstable_mockModule("react-dom/server", () => ({
      default: {
        renderToStaticMarkup: (element) =>
          `<html>${JSON.stringify(element.props)}</html>`,
      },
    }));

    jest.unstable_mockModule("@/lists/emailTemplates", () => ({
      default: {
        QuickLinkTemplate: (props) => ({ type: "QuickLinkTemplate", props }),
        WeeklyDigestTemplate: (props) => ({
          type: "WeeklyDigestTemplate",
          props,
        }),
      },
    }));

    jest.unstable_mockModule("@/components/emails/email-theme", () => ({
      getEmailBranding: () => ({ appName: "TestApp" }),
    }));

    const importedModule = await import("../../libs/email");
    sendEmail = importedModule.sendEmail;
    QuickLinkEmail = importedModule.QuickLinkEmail;
    WeeklyDigestEmail = importedModule.WeeklyDigestEmail;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send email successfully", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

    await sendEmail({
      from: "me@test.com",
      email: "you@test.com",
      subject: "Subject",
      html: "<p>Body</p>",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/emails"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
        body: expect.stringContaining('"to":"you@test.com"'),
      }),
    );
  });

  it("should throw error on failure", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Error" }),
    });

    await expect(sendEmail({ email: "test" })).rejects.toThrow();
  });

  it("should generate QuickLinkEmail content", async () => {
    const result = await QuickLinkEmail({
      host: "test.com",
      url: "http://test.com/login",
      styling: {},
    });

    expect(result.subject).toContain("Sign in to TestApp");
    expect(result.html).toContain("<!DOCTYPE html><html>");
    expect(result.text).toContain("Sign in to TestApp");
  });

  it("should generate QuickLinkEmail with isTest flag", async () => {
    const result = await QuickLinkEmail({
      host: "test.com",
      url: "http://test.com/login",
      styling: {},
      isTest: true,
    });

    expect(result.subject).toContain("[TEST");
  });

  it("should generate WeeklyDigestEmail content", async () => {
    const result = await WeeklyDigestEmail({
      baseUrl: "http://test.com",
      userName: "John",
      boards: [],
      styling: {},
    });

    expect(result.subject).toContain("Weekly Board Stats");
    expect(result.html).toContain("<!DOCTYPE html><html>");
    expect(result.text).toContain("John");
  });

  it("should generate WeeklyDigestEmail with isTest flag", async () => {
    const result = await WeeklyDigestEmail({
      baseUrl: "http://test.com",
      userName: "John",
      boards: [],
      styling: {},
      isTest: true,
    });

    expect(result.subject).toContain("[TEST");
  });

  it("should handle URL with trailing slash", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

    await sendEmail({
      apiUrl: "https://api.resend.com/",
      from: "me@test.com",
      email: "you@test.com",
      subject: "Subject",
      html: "<p>Body</p>",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.any(Object),
    );
  });

  it("should handle apiPath without leading slash", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

    await sendEmail({
      apiPath: "emails",
      from: "me@test.com",
      email: "you@test.com",
      subject: "Subject",
      html: "<p>Body</p>",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/emails"),
      expect.any(Object),
    );
  });

  // WeeklyDigestEmail test similar structure
});
