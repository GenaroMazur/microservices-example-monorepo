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

const PORT = Number(getEnvironments(Environments.AUTH_MICROSERVICE_PORT));
if (Number.isNaN(PORT) || PORT < 1 || PORT > 65535)
  throw new Error("Invalid port");

const expressServer = new ExpressServer(PORT);

const core = Core.getInstance();

core.expressServer = expressServer;

core.start();
