import { graphqlServer, type RootResolver } from "@hono/graphql-server";
import { serve } from "@hono/node-server";
import { buildSchema } from "graphql";
import { Hono } from "hono";

const app = new Hono();

const schema = buildSchema(`
type Query {
  hello: String
}
`);

const rootResolver: RootResolver = (c) => {
  return {
    hello: () => "Hello Hono!",
  };
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
