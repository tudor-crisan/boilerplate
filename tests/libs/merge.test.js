import {
  deepMerge,
  getMergedConfig,
  getMergedConfigWithModules,
} from "@/libs/merge.mjs";

describe("libs/merge", () => {
  describe("deepMerge", () => {
    it("should return source if not objects", () => {
      expect(deepMerge(1, 2)).toBe(2);
      expect(deepMerge({ a: 1 }, 2)).toBe(2);
    });

    it("should deep merge objects", () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 }, e: 4 };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it("should replace arrays", () => {
      const target = { a: [1, 2] };
      const source = { a: [3, 4] };
      const result = deepMerge(target, source);

      expect(result.a).toEqual([3, 4]);
    });
  });

  describe("getMergedConfig", () => {
    const list = {
      base: { key: "value" },
      override: { key: "new-value" },
      base0: { key: "default" },
    };

    it("should merge string override", () => {
      const res = getMergedConfig("base", "override", list);
      expect(res.key).toBe("new-value");
    });

    it("should merge object override", () => {
      const res = getMergedConfig(
        "setting",
        { default: "base", override: "override" },
        list,
      );
      expect(res.key).toBe("new-value");
    });

    it("should use base0 if only configType provided", () => {
      // If configValue is undefined/null, deepMerge logic handles it?
      // Actually looking at code: baseKey = configType.
      // If configValue is object it logic applies.
      // Wait, if configValue passed as undefined, it crashes? No, checked code.
      // Line 43: typeof configValue === 'string'.
      // If not string or object, baseKey is used?
      // Actually, verify logic:
      // let baseKey = `${configType}`;
      // if string -> overrideKey = val
      // if object -> baseKey = default || baseKey, overrideKey = override

      const res = getMergedConfig("base", null, list);
      expect(res.key).toBe("value");
    });
  });

  describe("getMergedConfigWithModules", () => {
    const list = {
      app: { modules: ["mod1"], val: 1 },
      base: { val: 0 },
      mod1: { val: 2, extra: 3 },
      override: { val: 4 },
    };

    it("should merge modules into base", () => {
      // configValue as string -> appSettingKey
      // baseKey = configType
      const res = getMergedConfigWithModules("base", "app", list);
      // base (0) < mod1 (2) < app (1)
      // Wait, logic: mergedConfig = base.
      // Loop modules (mod1). mergedConfig = merge(base, mod1) -> { val: 2, extra: 3 }
      // Then merge(mergedConfig, appConfig) -> { val: 1, extra: 3, modules... }

      expect(res.val).toBe(1);
      expect(res.extra).toBe(3);
    });
  });
});
