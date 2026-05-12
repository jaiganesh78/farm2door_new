import { v4 as uuidv4 } from "uuid";

export const requestId = (req, res, next) => {
  const incoming =
    req.headers["x-request-id"] ||
    req.headers["x-correlation-id"];

  const id =
    typeof incoming === "string" && incoming.trim()
      ? incoming.trim()
      : uuidv4();

  req.requestId = id;

  res.setHeader("X-Request-Id", id);

  next();
};