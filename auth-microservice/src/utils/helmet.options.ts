import { HelmetOptions } from "helmet";

export const helmetOptions: HelmetOptions = {
  hidePoweredBy: true,
  contentSecurityPolicy: true,
  noSniff: true,
  frameguard: true,
  xssFilter: true,
};
