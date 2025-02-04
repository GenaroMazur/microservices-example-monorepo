import { Router } from "express";
import {
  LoginController,
  logoutController,
  refreshTokenController,
} from "../controllers/Auht.controller";

const AuthRouter = Router();

AuthRouter.post("/login", LoginController);

AuthRouter.post("/logout", logoutController);

AuthRouter.post("/refresh-token", refreshTokenController);

export default AuthRouter;
