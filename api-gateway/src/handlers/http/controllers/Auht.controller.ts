import { getEnvironments } from "./../../../utils/getEnvironments.utils";
import { authService } from "./../../../dependences";
import { controllerBuilder } from "./../../../utils/catchAsync";
import { Environments } from "./../../../enums/Environments.enum";

const NODE_ENV = getEnvironments(Environments.NODE_ENV);

export const LoginController = controllerBuilder(async (req, res) => {
  const result = await authService.login(req.body.username, req.body.password);

  req.statusMessage = result.message;
  req.statusCode = result.code;

  if (result.code === 200) {
    res.cookie("x-refresh-token", result.body.refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      signed: true,
      sameSite: "none",
    });

    return result.body.accessToken;
  }

  return result.body;
});

export const logoutController = controllerBuilder(async (req, res) => {
  res.clearCookie("x-refresh-token");

  req.statusMessage = "Success logout";
  req.statusCode = 200;
});

export const refreshTokenController = controllerBuilder(async (req) => {
  const refreshToken = req.signedCookies["x-refresh-token"];

  const result = await authService.refreshToken(refreshToken);

  req.statusMessage = result.message;
  req.statusCode = result.code;

  return result.body;
});
