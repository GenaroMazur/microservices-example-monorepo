import { Router } from "express";
import { checkAlive } from "../controllers/index.controller";
import AuthRouter from "./Auth.routes";

const IndexRouter = Router();

IndexRouter.get("/", checkAlive);

IndexRouter.use("/auth", AuthRouter);

export default IndexRouter;
