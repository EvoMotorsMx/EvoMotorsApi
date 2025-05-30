import { handler } from "../../src/infrastructure/web/routes/Company/handler";

handler(
  {
    pathParameters: {
      companyId: "",
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    requestContext: {
      http: {
        method: "PATCH",
      },
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
