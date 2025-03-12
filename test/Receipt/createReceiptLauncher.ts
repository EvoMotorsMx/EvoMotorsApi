import { handler } from "../../src/infrastructure/web/routes/Receipt/handler";

const binaryImage = Buffer.from("fakeImageData", "binary").toString("binary");

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
