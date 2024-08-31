import { handler } from "../../src/infrastructure/web/routes/Company/handler";

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      idtoken: "",
      Authorization: "",
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
