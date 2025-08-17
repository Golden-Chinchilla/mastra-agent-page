import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
    // https://hello-mastra.gaojieli2020.workers.dev/
    // baseUrl: "http://localhost:4111", 
    baseUrl: "https://hello-mastra.gaojieli2020.workers.dev",
    retries: 3,
});