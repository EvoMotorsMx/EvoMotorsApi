import { handler } from "../../src/infrastructure/web/routes/Company/handler";

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
      name: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      email: "",
      users: [""],
    }),
  } as any,
  {} as any,
);
