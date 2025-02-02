import {
  LoginController,
  RefreshTokenController,
} from "../controllers/auth.controller";
import { RefreshTokenMiddleware } from "../middleware/token.middleware";
import { MethodNotAllowedException } from "./../../../utils/exceptions";
import { Router } from "express";

const AuthRouter = Router();

AuthRouter.get("*", (_, __, next) => next(new MethodNotAllowedException()));

AuthRouter.post("/login", LoginController);

AuthRouter.post(
  "/refresh-token",
  RefreshTokenMiddleware,
  RefreshTokenController,
);

export default AuthRouter;
