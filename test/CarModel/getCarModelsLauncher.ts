import { sortBy } from "lodash";
import { handler } from "../../src/infrastructure/web/routes/CarModel/handler";

const queryStringParameters = {
  page: "1",
  limit: "10",
  name: "A1",
  engineSize:"2",
  sortBy: "name",
  sortOrder: "asc",
};

handler(
  {
    httpMethod: "GET",
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    requestContext: {
      http: {
        method: "GET",
      },
    },
    queryStringParameters
  } as any,
  {} as any,
);
