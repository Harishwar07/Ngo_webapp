export const pickAllowedFields = (data, allowed) => {
  const cleaned = {};
  allowed.forEach(key => {
    if (data[key] !== undefined) cleaned[key] = data[key];
  });
  return cleaned;
};
