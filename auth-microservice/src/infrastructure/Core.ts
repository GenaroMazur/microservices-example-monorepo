import { DataSource } from "typeorm";
import { CoreModuleI } from "../interfaces/Core.modules";
import ExpressServer from "./express.server";

export default class Core implements CoreModuleI {
  //singleton
  private static instance: Core;
  public static getInstance(): Core {
    if (!Core.instance) {
      Core.instance = new Core();
    }
    return Core.instance;
  }
  private constructor() {}

  public expressServer: ExpressServer | null = null;
  public dataSources: DataSource | null = null;

  async start(): Promise<this> {
    await this.expressServer?.start();
    await this.dataSources?.initialize();

    return this;
  }
  async stop(): Promise<this> {
    await this.expressServer?.stop();
    await this.dataSources?.destroy();

    return this;
  }
}
