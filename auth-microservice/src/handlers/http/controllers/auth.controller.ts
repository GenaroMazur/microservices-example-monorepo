import GenerateAccessTokenDto from "./../../../application/dto/GenerateAccessToken.dto";
import { authApplication, tokenApplication } from "../../../dependences";
import { controllerBuilder } from "./../../../utils/catchAsync";

export const LoginController = controllerBuilder(async (req) => {
  const { username, password } = req.body;

  const result = await authApplication.login(username, password);

  return result;
});

export const RefreshTokenController = controllerBuilder(
  async (_, { locals: { refreshToken } }) => {
    return tokenApplication.generateAccessToken(
      new GenerateAccessTokenDto(refreshToken!),
    );
  },
);
