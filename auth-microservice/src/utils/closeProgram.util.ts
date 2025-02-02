import Core from "../infrastructure/Core";
import { logger } from "./logger";

/**
 * @description Cierra el programa de forma segura, cerrando el servidor http, luego las bases de datos
 *
 * @param err En caso de error imprime el error
 */
export const closeProgram = async (err?: unknown) => {
  if (err instanceof Error) logger.error(err);
  else logger.warn(`Programa cerrado de forma segura - ${err}`);

  try {
    await Core.getInstance().stop();
  } catch (error) {
    logger.error("error al cerrar el core");
    logger.error(error);
  }
  logger.warn("process exit");
  process.exit(err instanceof Error ? 1 : 0);
};
