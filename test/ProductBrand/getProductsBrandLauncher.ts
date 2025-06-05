import { handler } from "../../src/infrastructure/web/routes/ProductBrand/handler";

const queryStringParameters = {
  page: "1",
  limit: "10",
  name: "",
  sortBy: "name",
  sortOrder: "asc",
};

handler(
  {
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    requestContext: {
      http: {
        method: "GET",
      },
    },
    queryStringParameters,
  } as any,
  {} as any,
);
