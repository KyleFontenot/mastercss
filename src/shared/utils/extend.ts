function deepClone(target) {
  if (target === null || typeof target !== 'object') {
    return target;
  }

  if (target instanceof Date) return new Date(target.getTime());
  if (target instanceof RegExp) return new RegExp(target);
  if (Array.isArray(target)) return target.map(item => deepClone(item));

  const clone = {};
  for (const key in target) {
    if (key === '__proto__') continue; // Security check
    clone[key] = deepClone(target[key]);
  }

  return clone;
}

function extend(...objects) {
  const result = {};

  for (const obj of objects) {
    if (!obj || typeof obj !== 'object') continue;

    for (const key in obj) {
      if (key === '__proto__') continue;
      const value = obj[key];

      // If the value is an object, merge it recursively
      if (value && typeof value === 'object') {
        result[key] = result[key] && typeof result[key] === 'object'
          ? extend(result[key], value)
          : deepClone(value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

export default extend;