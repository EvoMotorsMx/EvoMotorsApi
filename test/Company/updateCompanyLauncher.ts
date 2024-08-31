import { handler } from "../../src/infrastructure/web/routes/Company/handler";

handler(
  {
    pathParameters: {
      companyId: "",
    },
    headers: {
      idtoken: "",
      Authorization: "",
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
