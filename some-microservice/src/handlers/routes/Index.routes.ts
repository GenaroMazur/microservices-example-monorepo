import { Router } from "express";
import { checkAlive } from "../controller/index.controller";
import { TokenMiddleware } from "../middlewares/Token.middleware";

const IndexRouter = Router();

IndexRouter.get("/", TokenMiddleware, checkAlive);

export default IndexRouter;
