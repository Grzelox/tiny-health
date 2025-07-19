import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: "Error",
    isDev: process.env.NODE_ENV === "development",
    // handleDaemonPromise: "await",
  },
});
