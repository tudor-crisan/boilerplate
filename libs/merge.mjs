/**
 * Deep merge two objects.
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
export function deepMerge(target, source) {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const targetValue = output[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      output[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });

  return output;
}

/**
 * Get merged configuration based on default/override pattern.
 * @param {string} configType - The prefix for the default key (e.g., 'setting' -> 'setting0')
 * @param {string|object} configValue - The configuration value (key or object with default/override)
 * @param {object} list - The list of available configurations
 * @returns {object} - The merged configuration
 */
export const getMergedConfig = (configType, configValue, list) => {
  let baseKey = `${configType}`;
  let overrideKey = null;

  if (typeof configValue === "string") {
    overrideKey = configValue;
  } else if (typeof configValue === "object") {
    baseKey = configValue.default || baseKey;
    overrideKey = configValue.override;
  }

  const base = list[baseKey] || {};
  const override = overrideKey ? list[overrideKey] : {};

  return deepMerge(base, override);
};

/**
 * Get merged configuration with support for modules.
 * Merges: Default -> Modules -> App Override
 * @param {string} configType - The prefix for the default key (e.g., 'setting')
 * @param {string|object} configValue - The configuration value
 * @param {object} list - The list of available configurations
 * @returns {object} - The merged configuration
 */
export const getMergedConfigWithModules = (configType, configValue, list) => {
  const baseKey = typeof configValue === 'object' ? (configValue.default || `${configType}`) : `${configType}`;
  const appSettingKey = typeof configValue === 'object' ? configValue.override : configValue;

  let mergedConfig = list[baseKey] || {};
  const appConfig = list[appSettingKey] || {};

  // Check for modules in both app config (priority) and base config
  const modules = appConfig.modules || mergedConfig.modules || [];

  if (Array.isArray(modules)) {
    modules.forEach(moduleName => {
      const moduleConfig = list[moduleName];
      if (moduleConfig) {
        mergedConfig = deepMerge(mergedConfig, moduleConfig);
      }
    });
  }

  return deepMerge(mergedConfig, appConfig);
};
