import { Router } from "express";
import { checkAlive, jwksController } from "../controllers/index.controller";
import { LoginController } from "../controllers/auth.controller";

const IndexRouter = Router();

IndexRouter.get("/", checkAlive);

IndexRouter.get("/.well-known/jwks.json", jwksController);

IndexRouter.post("/auth/login", LoginController);

export default IndexRouter;
