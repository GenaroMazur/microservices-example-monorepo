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
import IndexRouter from "./handlers/routes/Index.routes";
import { errorPage, notFound } from "./handlers/controller/index.controller";

const PORT = Number(getEnvironments(Environments.SOME_MICROSERVICE_PORT));
if (Number.isNaN(PORT) || PORT < 1 || PORT > 65535)
  throw new Error("Invalid port");

const expressServer = new ExpressServer(PORT);

const core = Core.getInstance();

expressServer.app.use("/", IndexRouter);
expressServer.app.use(notFound);
expressServer.app.use(errorPage);

core.expressServer = expressServer;

core.start();
