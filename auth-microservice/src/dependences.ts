import AuthApplication from "./application/Auth.application";
import PasswordEncoderApplication from "./application/PasswordEncoder.application";
import TokenApplication from "./application/Token.application";
import User from "./domain/entity/User";
import { Environments } from "./enums/Environments.enum";
import Core from "./infrastructure/Core";
import { generatePairKeys } from "./utils/generatePairKeys.utils";
import { getEnvironments } from "./utils/getEnvironments.utils";
import { readFileSync } from "fs";

//#region RSA Keys

let PRIVATE_KEY: string;
let PUBLIC_KEY: string;

const NODE_ENV = getEnvironments(Environments.NODE_ENV);

if (NODE_ENV === "production") {
  const certDir = __dirname + "/../../cert";
  PRIVATE_KEY = readFileSync(certDir + "/private_key.pem", "utf8");
  PUBLIC_KEY = readFileSync(certDir + "/public_key.pem", "utf8");

  if (!PRIVATE_KEY || !PUBLIC_KEY) {
    throw new Error("Error al leer las claves");
  }
} else {
  const { privateKey, publicKey } = generatePairKeys();

  PRIVATE_KEY = privateKey;
  PUBLIC_KEY = publicKey;
}

//#endregion RSA Keys

const REFRESH_TOKEN_EXPIRATION = getEnvironments(
  Environments.REFRESH_TOKEN_EXPIRATION,
);
const ACCESS_TOKEN_EXPIRATION = getEnvironments(
  Environments.ACCESS_TOKEN_EXPIRATION,
);

export const tokenApplication = new TokenApplication(
  PRIVATE_KEY,
  PUBLIC_KEY,
  REFRESH_TOKEN_EXPIRATION,
  ACCESS_TOKEN_EXPIRATION,
);

let SALT: number;

if (NODE_ENV === "production") {
  SALT = 12;
} else {
  SALT = 5;
}

const bcryptPasswordEncoder = new PasswordEncoderApplication(SALT);

const userRepository = Core.getInstance().dataSources!.getRepository(User);

export const authApplication = new AuthApplication(
  tokenApplication,
  userRepository,
  bcryptPasswordEncoder,
);
