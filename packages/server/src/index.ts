import { ApolloServer } from "@apollo/server";
import { handler as vercelHandler } from "@as-integrations/vercel";
import {
  typeDefs,
  resolvers,
  type AppContext
} from "@delivery-tracker/api";
import { initLogger } from "./logger";
import { DefaultCarrierRegistry } from "@delivery-tracker/core";

initLogger();

const serverRootLogger = /* Your existing logger setup */;

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers.resolvers,
  formatError: (formattedError, error) => {
    // Your existing error formatting logic
    /* ... */
    return {
      ...formattedError,
      // Modified message as per your logic
    };
  }
});

// Initialize Carrier Registry and Context
const carrierRegistry = new DefaultCarrierRegistry();

async function buildContext({ request, response }): Promise<AppContext> {
  await carrierRegistry.init();
  return { carrierRegistry };
}

// Export the Vercel-compatible handler
export default vercelHandler(server, {
  context: buildContext,
  onHealthCheck: async () => {
    // Optional: Implement health check logic
  }
});
