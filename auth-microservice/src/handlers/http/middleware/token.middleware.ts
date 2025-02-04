import { ForbiddenException } from "./../../../utils/exceptions";
import { controllerBuilder } from "./../../../utils/catchAsync";
import { tokenApplication } from "./../../../dependences";

export const AccessTokenMiddleware = controllerBuilder((req, res, next) => {
  const accessToken = req.headers["x-access-token"];

  if (!accessToken) {
    throw new ForbiddenException("No token provided");
  }

  if (typeof accessToken !== "string") {
    throw new ForbiddenException("Invalid token provided");
  }

  const token = tokenApplication.validateAccessToken(accessToken);
  if (token.type !== "ACCESS")
    throw new ForbiddenException("Invalid token provided");

  res.locals.accessToken = token;
  next();
}, "AccessTokenMiddleware");

export const RefreshTokenMiddleware = controllerBuilder((req, res, next) => {
  const refreshToken = req.headers["x-refresh-token"];

  if (!refreshToken) {
    throw new ForbiddenException("No token provided");
  }

  if (typeof refreshToken !== "string") {
    throw new ForbiddenException("Invalid token provided");
  }

  const token = tokenApplication.validateRefreshToken(refreshToken);
  if (token.type !== "REFRESH")
    throw new ForbiddenException("Invalid token provided");

  res.locals.refreshToken = token;
  next();
});
