import Core from "../infrastructure/Core";
import { logger } from "./logger";

/**
 * @description Close the program safely
 *
 * @param err In case of error print the error
 */
export const closeProgram = async (err?: unknown) => {
  if (err instanceof Error) logger.error(err);
  else logger.warn(`Secure Close server  - ${err}`);

  try {
    await Core.getInstance().stop();
  } catch (error) {
    logger.error("Server close error");
    logger.error(error);
  }
  logger.warn("process exit");
  process.exit(err instanceof Error ? 1 : 0);
};
