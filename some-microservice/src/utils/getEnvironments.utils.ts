import { config } from "dotenv";
config();

import { Environments } from "../enums/Environments.enum";

export function getEnvironments(env: Environments) {
  const value = process.env[env];

  if (!value) {
    throw new Error(`Environment variable ${env} is not defined`);
  }

  return value;
}
