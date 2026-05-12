const firstZodMessage = (zodError) => {
  const issue = zodError.issues[0];
  return issue?.message ?? "Validation failed";
};

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const err = new Error(firstZodMessage(result.error));
    err.statusCode = 400;
    return next(err);
  }

  const data = result.data;

  if (data.body !== undefined) {
    req.body = data.body;
  }
  if (data.params !== undefined) {
    req.params = data.params;
  }
  if (data.query !== undefined) {
    req.query = data.query;
  }

  next();
};
