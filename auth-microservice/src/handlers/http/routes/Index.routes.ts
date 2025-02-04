import { Router } from "express";
import { checkAlive, jwksController } from "../controllers/index.controller";
import AuthRouter from "./Auth.routes";
import { AccessTokenMiddleware } from "../middleware/token.middleware";
import UserRouter from "./User.routes";

const IndexRouter = Router();

IndexRouter.get("/", checkAlive);

IndexRouter.get("/.well-known/jwks.json", jwksController);

IndexRouter.use("/auth", AuthRouter);

IndexRouter.use(AccessTokenMiddleware);

IndexRouter.use("/users", UserRouter);

export default IndexRouter;
