class ToastManager {
  constructor() {
    this.listeners = [];
    this.toasts = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  create(message, type = "blank", options = {}) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = {
      id,
      message,
      type,
      ...options,
    };
    this.toasts = [toast, ...this.toasts];
    this.notify();

    if (options.duration !== Infinity) {
      setTimeout(() => {
        this.dismiss(id);
      }, options.duration || 4000);
    }
    return id;
  }

  dismiss(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(message, options) {
    return this.create(message, "success", options);
  }

  error(message, options) {
    return this.create(message, "error", options);
  }

  // mimic other react-hot-toast methods if needed
  custom(jsx, options) {
    return this.create(jsx, "custom", options);
  }
}

export const toast = new ToastManager();
