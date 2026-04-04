import { randomUUID } from "node:crypto";

export const requestContext = (req, res, next) => {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.locals.requestId = requestId;
  next();
};
