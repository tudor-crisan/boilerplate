import { deepMerge } from "../libs/merge.js";

const defaults = {
  a: 1,
  b: {
    c: 2,
    d: 3
  },
  e: [1, 2, 3]
};

const overrides = {
  b: {
    c: 4
  },
  e: [4, 5],
  f: 6
};

const expected = {
  a: 1,
  b: {
    c: 4,
    d: 3
  },
  e: [4, 5],
  f: 6
};

const result = deepMerge(defaults, overrides);

console.log("Result:", JSON.stringify(result, null, 2));

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
};

assert(result.a === 1, "Preserves default top-level");
assert(result.b.c === 4, "Overrides nested value");
assert(result.b.d === 3, "Preserves nested default");
assert(result.e.length === 2 && result.e[0] === 4, "Overwrites arrays");
assert(result.f === 6, "Adds new keys");

console.log("All tests passed!");
