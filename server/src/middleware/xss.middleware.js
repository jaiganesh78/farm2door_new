import xss from "xss";

const sanitize = (value, depth = 0) => {
  if (depth > 20) return value;

  if (typeof value === "string") {
    return xss(value);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v) => sanitize(v, depth + 1));
  }

  const out = {};

  for (const [k, v] of Object.entries(value)) {
    out[k] = sanitize(v, depth + 1);
  }

  return out;
};

export const xssClean = (req, _res, next) => {
  try {
    if (req.body) {
      req.body = sanitize(req.body);
    }

    // DO NOT mutate req.query or req.params
    // Modern Express treats them as readonly getters

    next();
  } catch (err) {
    next();
  }
};