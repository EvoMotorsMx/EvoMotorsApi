import { handler } from "../../src/infrastructure/web/routes/Receipt/handler";
import * as FormData from "form-data";
import * as fs from "fs";
import { generateHash } from "../../src/shared/utils/generateHash";

async function formDataHandler() {
  const form = new FormData();

  form.append("installationEndDate", new Date().toISOString());
  form.append("installationStatus", "finished");
  form.append("tankStatus", 50);
  form.append("mileage", 17800);
  form.append("carId", "50be6810-1064-4cef-964b-ce2c99398829");
  form.append("cognitoId", "1c124b64-e4ae-4a5a-8305-437e9be818bc");
  form.append("damageStatusDescription", "Pequeños rayones");
  form.append("scannerDescription", "No se encontraron errores");
  form.append("errorCodes", JSON.stringify([]));
  form.append("witnesses", JSON.stringify([]));
  form.append(
    "productInstalled",
    JSON.stringify([["d0862f7f-fbef-4ff9-af86-c271014d906b"]]),
  );

  const fakeImageBuffer = Buffer.from("fakeImageData", "binary");

  const signImage = {
    buffer: fakeImageBuffer.toString("base64"), // Convertir el buffer a Base64
    filename: "signImage.png",
    contentType: "image/png",
    timestamp: new Date().toISOString(),
    hash: generateHash(fakeImageBuffer),
  };
  form.append("damageImage", JSON.stringify(signImage));

  const damageImage = {
    buffer: fakeImageBuffer.toString("base64"), // Convertir el buffer a Base64
    filename: "damage1.png",
    contentType: "image/png",
    timestamp: new Date().toISOString(),
    hash: generateHash(fakeImageBuffer),
  };
  form.append("damageImage", JSON.stringify(damageImage));

  // Convertir el form-data a un formato que el handler pueda procesar
  const headers = form.getHeaders();
  const body = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    form.on("data", (chunk) => chunks.push(chunk));
    form.on("end", () => resolve(Buffer.concat(chunks as Uint8Array[])));
    form.on("error", reject);
    form.pipe(fs.createWriteStream("/dev/null")); // Simula el flujo de datos
  });

  // Llamar al handler con el evento simulado
  handler(
    {
      requestContext: {
        http: {
          method: "POST",
        },
      },
      headers: {
        ...headers,
        idtoken: process.env.ID_TOKEN,
        Authorization: process.env.AUTHORIZATION,
      },
      body: body.toString("base64"), // El cuerpo debe estar en base64 para AWS Lambda
      isBase64Encoded: true,
    } as any,
    {} as any,
  );
}

formDataHandler();

/* const binaryImage = Buffer.from("fakeImageData", "binary").toString("binary");

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    body: JSON.stringify({
      installationEndDate: "",
      signImage: "base64EncodedImageString",
      installationStatus: "pending",
      tankStatus: 50,
      mileage: 17800,
      damageImages: [binaryImage, binaryImage],
      scannerDescriptionImages: [binaryImage, binaryImage],
      carId: "50be6810-1064-4cef-964b-ce2c99398829",
      cognitoId: "1c124b64-e4ae-4a5a-8305-437e9be818bc",
      damageStatusDescription: "Pequeños rayones",
      scannerDescription: "No se encontraron errores",
      errorCodes: [],
      witnesses: [],
      productInstalled: ["d0862f7f-fbef-4ff9-af86-c271014d906b"],
    }),
  } as any,
  {} as any,
);
 */
