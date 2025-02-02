import { Router } from "express";
import { jwksController } from "../controllers/index.controller";

const IndexRouter = Router();

IndexRouter.get("/.well-known/jwks.json", jwksController);

export default IndexRouter;
