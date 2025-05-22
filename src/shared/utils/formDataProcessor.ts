import Busboy from "busboy";

import { APIGatewayProxyEventV2 } from "aws-lambda";

export async function processFormData(event: APIGatewayProxyEventV2) {
  const fields: Record<string, string> = {};
  const files: {
    fieldname: string;
    filename: string;
    contentType: string;
    buffer: Buffer;
  }[] = [];

  return new Promise<{ fields: Record<string, string>; files: typeof files }>(
    (resolve, reject) => {
      const busboy = Busboy({
        headers: { "content-type": event.headers["content-type"] },
      });

      busboy.on("field", (fieldname, value) => {
        fields[fieldname] = value;
      });

      interface FileData {
        fieldname: string;
        filename: string;
        contentType: string;
        buffer: Buffer;
      }

      busboy.on(
        "file",
        (
          fieldname: string,
          file: NodeJS.ReadableStream,
          filename: string,
          encoding: string,
          mimetype: string,
        ) => {
          const chunks: Buffer[] = [];
          file.on("data", (chunk: Buffer) => chunks.push(chunk));
          file.on("end", () => {
            files.push({
              fieldname,
              filename,
              contentType: mimetype,
              buffer: Buffer.concat(chunks as Uint8Array[]),
            } as FileData);
          });
        },
      );

      busboy.on("finish", () => resolve({ fields, files }));
      busboy.on("error", reject);

      busboy.end(Buffer.from(event.body || "", "base64"));
    },
  );
}
