import * as crypto from "crypto";

/**
 * Generate a hash for a given buffer or string.
 * @param data - The data to hash (Buffer or string).
 * @returns The generated hash as a hexadecimal string.
 */
export function generateHash(data: Buffer | string): string {
  const input = Buffer.isBuffer(data) ? new Uint8Array(data) : data;
  return crypto.createHash("sha256").update(input).digest("hex");
}
