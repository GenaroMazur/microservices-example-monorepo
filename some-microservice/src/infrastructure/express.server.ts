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
    if (!this.server) return this;

    return new Promise<this>((resolve, reject) => {
      this.server!.close((err) => {
        if (err) {
          logger.error("Error closing server");
          reject(this);
        }
        resolve(this);
        logger.warn("Http Server stopped");
      });
    });
  }
}
