import { getRandomCryptoString } from "../deps/crypto-random-string/mod.ts";

export function createBuildId() {
  return getRandomCryptoString({
    length: 6,
    type: "alphanumeric",
  });
}
