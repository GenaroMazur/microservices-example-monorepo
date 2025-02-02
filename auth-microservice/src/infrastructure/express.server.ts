import { Server } from "node:http";
import { CoreModuleI } from "../interfaces/Core.modules";
import { Application } from "express";
import express from "express";
import { logger } from "../utils/logger";

export default class ExpressServer implements CoreModuleI {
  public server: Server | null = null;
  public readonly port: number;
  public readonly app: Application;

  constructor(port: number) {
    logger.info("Creating Express Server");
    this.port = port;
    this.app = express();
  }

  start(): this | Promise<this> {
    this.server = this.app.listen(this.port, () => {
      logger.info(`Server running on port ${this.port}`);
    });
    return this;
  }

  stop(): this | Promise<this> {
    if (this.server) {
      this.server.close(() => {
        logger.warn("Server stopped");
      });
    }
    return this;
  }
}
