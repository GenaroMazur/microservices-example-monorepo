import { closeProgram } from "./utils/closeProgram.util";

//En caso de exception no cacheada cerrará la aplicación de forma segura
process.on("uncaughtException", closeProgram);
process.on("unhandledRejection", closeProgram);

//En caso de interrupción del programa (CTRL + C o SIGINT) cerrará la aplicación de forma segura
process.on("SIGINT", closeProgram);
process.on("SIGTERM", closeProgram);

import { Environments } from "./enums/Environments.enum";
import Core from "./infrastructure/Core";
import ExpressServer from "./infrastructure/express.server";
import { getEnvironments } from "./utils/getEnvironments.utils";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { helmetOptions } from "./utils/helmet.options";
import { logger } from "./utils/logger";

const PORT = Number(getEnvironments(Environments.AUTH_MICROSERVICE_PORT));
if (Number.isNaN(PORT) || PORT < 1 || PORT > 65535)
  throw new Error("Invalid port");

const expressServer = new ExpressServer(PORT);

const NODE_ENV = getEnvironments(Environments.NODE_ENV);
expressServer.app.use(
  cors({ origin: "*" }),
  express.urlencoded({ extended: true }),
  express.json(),
  helmet(helmetOptions),
  morgan(NODE_ENV === "production" ? "common" : "dev", {
    stream: { write: (message) => logger.http(message.replace("\n", "")) },
  }),
);

const core = Core.getInstance();

core.expressServer = expressServer;

core.start();
