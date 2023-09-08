export function throwInvalidErrorPath(errorMessage: string): never {
  throw new Error(`invalid path: ${errorMessage}`);
}
