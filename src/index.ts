import { graphqlServer, type RootResolver } from "@hono/graphql-server";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import resolvers from "./graphql/resolvers.js";
import schema from "./graphql/schema.js";

const app = new Hono();

const rootResolver: RootResolver = (c) => {
  console.log("RootResolver called");
  return { ...resolvers.Query };
};

app.use(
  "/graphql",
  graphqlServer({
    schema,
    rootResolver,
    graphiql: true, // if `true`, presents GraphiQL when the GraphQL endpoint is loaded in a browser.
  })
);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
