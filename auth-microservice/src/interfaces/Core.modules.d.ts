export interface CoreModuleI {
  start(): Promise<this> | this;
  stop(): Promise<this> | this;
}
