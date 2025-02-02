import { authApplication } from "../../../dependences";
import { controllerBuilder } from "./../../../utils/catchAsync";

export const LoginController = controllerBuilder(async (req) => {
  const { username, password } = req.body;

  const result = await authApplication.login(username, password);

  return result;
});
