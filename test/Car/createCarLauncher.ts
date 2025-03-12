import { handler } from "../../src/infrastructure/web/routes/Car/handler";

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
      mileage: 16800,
      tankStatus: 1,
      damageImageUrl: [""],
      damageStatusDescription: "Minor scratches on the left door",
      scannerDescription: "No issues detected",
      vin: "JM1BPDMY7R1711343",
      plates: "JM1BPDMY7R1711343",
      carModelId: "89bbf601-bc0a-432e-9e62-75ef67b7fb6f",
      customerId: "78121081-67d9-4b2f-885d-44f9606f9828",
      certificateId: "",
      remissions: [],
      witnesses: [],
      errorCodes: [],
      files: [],
    }),
  } as any,
  {} as any,
);
