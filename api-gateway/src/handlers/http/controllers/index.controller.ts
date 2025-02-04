import { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { controllerBuilder } from "./../../../utils/catchAsync";
import { AppError } from "./../../../utils/exceptions";
import { Environments } from "./../../../enums/Environments.enum";
import { getEnvironments } from "./../../../utils/getEnvironments.utils";
import { endpointResponse } from "./../../../utils/success";
import { authService } from "../../../dependences";

export const checkAlive = controllerBuilder((req) => {
  req.statusMessage = "server is on!";

  return { authService: authService.status };
}, "checkAlive controller");

export const notFound = controllerBuilder(async (req) => {
  req.statusMessage = "URL invalida";
  req.statusCode = 404;
}, "notFound controller");

export const errorPage = (
  err: { [k: string]: unknown },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    logger.error(err);
    return next(err);
  }

  if (err instanceof AppError) {
    return endpointResponse({ res, message: err.message, code: err.httpCode });
  }
  if (err.status === 400 && err.type === "entity.parse.failed") {
    return endpointResponse({ res, message: "JSON invalido", code: 400 });
  }

  logger.error(err);
  req.statusMessage = "Error interno del servidor";
  req.statusCode = 500;

  const NODE_ENV = getEnvironments(Environments.NODE_ENV);

  const body =
    NODE_ENV === "development"
      ? { error: { message: err.message, stack: err.stack } }
      : { error: { message: "Error interno del servidor" } };

  endpointResponse({
    res,
    message: "Error interno del servidor",
    code: 500,
    body,
  });
};
