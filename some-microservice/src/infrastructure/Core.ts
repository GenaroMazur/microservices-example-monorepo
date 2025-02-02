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

  async start(): Promise<this> {
    await this.expressServer?.start();

    return this;
  }
  async stop(): Promise<this> {
    await this.expressServer?.stop();

    return this;
  }
}
