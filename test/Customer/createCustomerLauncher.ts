import { handler } from "../../src/infrastructure/web/routes/Customer/handler";

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
      name: "Amílcar Alejandro",
      lastName: "Sánchez Soltero",
      city: "Guadalajara",
      state: "Jalisco",
      country: "México",
      phone: "523313612735",
      email: "amilcaralex97@gmail.com",
      rfc: "SASA970328U20",
      razonSocial: "AMILCAR ALEJANDRO SANCHEZ SOLTERO",
      contacto: "CLIENTE",
      company: "",
    }),
  } as any,
  {} as any,
);
