import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: process.env.AWS_REGION! });

export class S3Service {
  static async uploadImage(
    file: Buffer | string, // Puede ser un Buffer o una cadena Base64
    folder = "uploads",
    bucketName = "",
    key?: string,
    contentType?: string, // Opcional: Permite especificar el tipo de contenido
  ) {
    let buffer: Buffer;
    let finalContentType: string;

    if (typeof file === "string") {
      // Si es una cadena Base64, conviértela a Buffer
      buffer = Buffer.from(
        file.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      );
      finalContentType =
        contentType || file.match(/data:(.*);base64/)?.[1] || "image/png";
    } else {
      // Si es un Buffer, úsalo directamente
      buffer = file;
      finalContentType = contentType || "application/octet-stream"; // Tipo genérico si no se especifica
    }

    const finalKey = key ?? `${folder}/${uuidv4()}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: finalKey,
      Body: buffer,
      ContentType: finalContentType,
    });

    await s3.send(command);
    return `https://${bucketName}.s3.amazonaws.com/${finalKey}`;
  }

  static async deleteImageFromS3(key: string, bucketName = "") {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await s3.send(command);
  }
}
