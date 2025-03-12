import { Buffer } from "buffer";

/**
 * Convierte una imagen en formato binario a una cadena base64.
 * @param {string} binaryData - La imagen en formato binario.
 * @returns {string} - La imagen convertida a base64.
 */
export function convertToBase64(binaryData: string): string {
  return Buffer.from(binaryData, "binary").toString("base64");
}
