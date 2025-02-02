import { Router } from "express";
import { checkAlive, jwksController } from "../controllers/index.controller";
import AuthRouter from "./Auth.routes";

const IndexRouter = Router();

IndexRouter.get("/", checkAlive);

IndexRouter.get("/.well-known/jwks.json", jwksController);

IndexRouter.use("/auth", AuthRouter);

export default IndexRouter;
