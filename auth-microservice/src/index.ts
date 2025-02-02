import "reflect-metadata";
import { closeProgram } from "./utils/closeProgram.util";

//En caso de exception no cacheada cerrará la aplicación de forma segura
process.on("uncaughtException", closeProgram);
process.on("unhandledRejection", closeProgram);

//En caso de interrupción del programa (CTRL + C o SIGINT) cerrará la aplicación de forma segura
process.on("SIGINT", closeProgram);
process.on("SIGTERM", closeProgram);

import Core from "./infrastructure/Core";
import { AppDataSource } from "./infrastructure/data-source";

const core = Core.getInstance();
core.dataSources = AppDataSource;

import { getEnvironments } from "./utils/getEnvironments.utils";
import { Environments } from "./enums/Environments.enum";
const PORT = Number(getEnvironments(Environments.AUTH_MICROSERVICE_PORT));
if (Number.isNaN(PORT) || PORT < 1 || PORT > 65535)
  throw new Error("Invalid port");

import ExpressServer from "./infrastructure/express.server";
const expressServer = new ExpressServer(PORT);

import express from "express";
import { logger } from "./utils/logger";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { helmetOptions } from "./utils/helmet.options";
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

import IndexRouter from "./handlers/http/routes/Index.routes";
import {
  errorPage,
  notFound,
} from "./handlers/http/controllers/index.controller";
import { userApplication } from "./dependences";
expressServer.app.use("/", IndexRouter);
expressServer.app.use(notFound);
expressServer.app.use(errorPage);

core.expressServer = expressServer;

core.start().then(async () => {
  await userApplication.createAdminIfNotExists();
});
