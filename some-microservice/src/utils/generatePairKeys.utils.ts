import { generateKeyPairSync } from "crypto";
import { logger } from "./logger";

/**
 * ONLY FOR TESTING PURPOSES
 *
 * @returns { privateKey: string, publicKey: string }
 */
export function generatePairKeys(): { privateKey: string; publicKey: string } {
  logger.warn(
    "Generating new pair of keys for testing purposes - DO NOT USE IN PRODUCTION",
  );

  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  logger.debug("Private key: " + privateKey);
  logger.debug("Public key: " + publicKey);

  return { privateKey, publicKey };
}
