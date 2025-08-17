import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
    // https://hello-mastra.gaojieli2020.workers.dev/
    baseUrl: "http://localhost:4111", // Default Mastra development server port
    retries: 3,
});