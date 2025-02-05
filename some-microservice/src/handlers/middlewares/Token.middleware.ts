import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { getEnvironments } from "./../../utils/getEnvironments.utils";
import { Environments } from "./../../enums/Environments.enum";
import { controllerBuilder } from "./../../utils/catchAsync";
import { ForbiddenException } from "./../../utils/exceptions";

const AUTH_MICROSERVICE_URL = getEnvironments(
  Environments.AUTH_MICROSERVICE_URL,
);

const client = jwksClient({
  jwksUri: `${AUTH_MICROSERVICE_URL}/.well-known/jwks.json`,
  cacheMaxAge: 1000 * 60,
});

async function getKey() {
  return (await client.getSigningKey()).getPublicKey();
}

async function verifyToken(token: string) {
  return jwt.verify(token, await getKey(), { algorithms: ["RS256"] });
}

export const TokenMiddleware = controllerBuilder(async (req, res, next) => {
  const token = req.headers["x-access-token"] as string;

  if (!token) throw new ForbiddenException("Token not provided");

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    throw new ForbiddenException("Invalid token");
  }
  res.locals.token = payload;
  next();
});
