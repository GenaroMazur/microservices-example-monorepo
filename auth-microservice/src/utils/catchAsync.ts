import { NextFunction, Request, Response } from "express";
import { endpointResponse } from "./success";
import { logger } from "./logger";

/**
 *
 * @param fn funcion a ejecutar en el controlador
 * @param nameController nombre del controlador
 * @returns controlador con manejo de errores y respuesta
 */
export const controllerBuilder = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown> | unknown,
  nameController?: string,
) => {
  logger.debug("controller builder called | " + (nameController || ""));
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let nextActioned = false;
      const result = await fn(req, res, (err?: unknown) => {
        nextActioned = true;
        next(err);
      });

      if (nextActioned) return;
      if (res.headersSent) return;
      endpointResponse({
        res,
        message: req.statusMessage || "OK",
        code: req.statusCode,
        body: result,
      });
    } catch (error) {
      next(error);
    }
  };
};
