/** @jest-environment node */
import { jest } from "@jest/globals";

describe("API: /api/user/update", () => {
  let POST;
  let UserMock;
  let generateLogoBase64Mock;
  let apiHandlerMock;

  const mockSession = { user: { email: "test@example.com", id: "123" } };
  const mockReq = {
    json: jest.fn(),
  };

  beforeAll(async () => {
    // Mock user model
    UserMock = {
      updateOne: jest.fn(),
    };
    jest.unstable_mockModule("@/models/User", () => ({ default: UserMock }));

    // Mock utils
    generateLogoBase64Mock = jest.fn();
    jest.unstable_mockModule("@/libs/utils.server", () => ({
      generateLogoBase64: generateLogoBase64Mock,
      responseSuccess: (msg, data, status) => ({
        message: msg,
        data,
        status,
        success: true,
      }),
      responseError: (msg, errors, status) => ({
        error: msg,
        errors,
        status,
        success: false,
      }),
    }));

    // Mock settings
    const settingMock = {
      forms: {
        general: {
          backend: {
            responses: { serverError: { message: "Error", status: 500 } },
          },
        },
        User: {
          backend: {
            responses: { profileUpdated: { message: "Updated", status: 200 } },
          },
        },
      },
    };
    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: settingMock,
    }));

    // Mock apiHandler to pass-through
    apiHandlerMock = {
      withApiHandler: (handler) => handler,
    };
    jest.unstable_mockModule("@/libs/apiHandler", () => apiHandlerMock);

    // Import the route
    const importedModule = await import("../../../app/api/user/update/route");
    POST = importedModule.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update user profile successfully", async () => {
    const body = {
      name: "New Name",
      image: "new.jpg",
      styling: { theme: "dark" },
      visualConfig: { logo: { shape: "star" } },
    };
    mockReq.json.mockResolvedValue(body);

    generateLogoBase64Mock.mockReturnValue("logo-base64");
    UserMock.updateOne.mockResolvedValue({ modifiedCount: 1 });

    const res = await POST(mockReq, { session: mockSession });

    expect(res.success).toBe(true);
    expect(res.message).toBe("Updated");
    expect(UserMock.updateOne).toHaveBeenCalledWith(
      { email: "test@example.com" },
      {
        $set: {
          name: "New Name",
          image: "new.jpg",
          styling: { theme: "dark", logo: "logo-base64" }, // logo merged
        },
      },
    );
  });

  it("should handle error during update", async () => {
    mockReq.json.mockRejectedValue(new Error("Fail"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const res = await POST(mockReq, { session: mockSession });

    expect(res.success).toBe(false);
    expect(res.status).toBe(500);

    consoleSpy.mockRestore();
  });
});
