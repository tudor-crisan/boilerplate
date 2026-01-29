import { jest } from "@jest/globals";

describe("libs/toast", () => {
  let toast;

  beforeAll(async () => {
    jest.useFakeTimers();
    const importedModule = await import("../../modules/general/libs/toast");
    toast = importedModule.toast;
  });

  afterEach(() => {
    // Clear listeners and toasts
    toast.listeners = [];
    toast.toasts = [];
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should subscribe listeners", () => {
    const listener = jest.fn();
    const unsubscribe = toast.subscribe(listener);

    expect(toast.listeners).toContain(listener);

    unsubscribe();
    expect(toast.listeners).not.toContain(listener);
  });

  it("should notify listeners on creation", () => {
    const listener = jest.fn();
    toast.subscribe(listener);

    toast.success("Success");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ message: "Success", type: "success" }),
      ]),
    );
  });

  it("should create error toast", () => {
    const id = toast.error("Error");
    expect(toast.toasts[0]).toMatchObject({
      id,
      message: "Error",
      type: "error",
    });
  });

  it("should auto-dismiss after duration", () => {
    toast.create("Auto dismiss", "blank", { duration: 1000 });
    expect(toast.toasts).toHaveLength(1);

    jest.advanceTimersByTime(1000);

    expect(toast.toasts).toHaveLength(0);
  });

  it("should not auto-dismiss if duration Infinity", () => {
    toast.create("Forever", "blank", { duration: Infinity });
    jest.advanceTimersByTime(50000);
    expect(toast.toasts).toHaveLength(1);
  });

  it("should dismiss manually", () => {
    const id = toast.create("Manual");
    toast.dismiss(id);
    expect(toast.toasts).toHaveLength(0);
  });

  it("should handle promise success", async () => {
    const promise = Promise.resolve("Data");
    const msgs = {
      loading: "Loading...",
      success: "Loaded!",
      error: "Failed",
    };

    const listener = jest.fn();
    toast.subscribe(listener);

    await toast.promise(promise, msgs);

    // Should have loading then success
    // Since promise resolves microtask, needed await.

    // Check final state
    expect(toast.toasts[0].message).toBe("Loaded!");
    expect(toast.toasts[0].type).toBe("success");
  });

  it("should handle promise failure", async () => {
    const promise = Promise.reject("Err");
    const msgs = {
      loading: "Loading...",
      success: "Loaded!",
      error: "Failed",
    };

    try {
      await toast.promise(promise, msgs);
    } catch {
      // ignore
    }

    // Wait for microtasks/library handlers to finish
    await Promise.resolve();
    await Promise.resolve();

    expect(toast.toasts[0].message).toBe("Failed");
    expect(toast.toasts[0].type).toBe("error");
  });

  it("should create custom toast", () => {
    const customJsx = { type: "custom", content: "Custom" };
    const id = toast.custom(customJsx);
    expect(toast.toasts[0]).toMatchObject({
      id,
      message: customJsx,
      type: "custom",
    });
  });

  it("should handle promise with function messages", async () => {
    const promise = Promise.resolve("Data");
    const msgs = {
      loading: "Loading...",
      success: (data) => `Loaded ${data}!`,
      error: (err) => `Failed: ${err}`,
    };

    await toast.promise(promise, msgs);
    await Promise.resolve();

    expect(toast.toasts[0].message).toBe("Loaded Data!");
  });

  it("should handle promise with function error messages", async () => {
    const promise = Promise.reject("Error");
    const msgs = {
      loading: "Loading...",
      success: "Success",
      error: (err) => `Failed: ${err}`,
    };

    try {
      await toast.promise(promise, msgs);
    } catch {}

    await Promise.resolve();
    await Promise.resolve();

    expect(toast.toasts[0].message).toBe("Failed: Error");
  });
});
