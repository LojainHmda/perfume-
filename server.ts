import "dotenv/config";
import { createServer as createViteServer } from "vite";
import { createApp, staticSpa } from "./server/app";
import { DIST_DIR } from "./server/lib/paths";

/**
 * Entry point. The API lives in server/ — this file only decides how it is
 * wrapped: Vite middleware in development, the built SPA in production.
 */
async function startServer() {
  const app = createApp();
  const port = Number(process.env.PORT ?? 3000);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    staticSpa(app, DIST_DIR);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`[Haute Server] Running on http://0.0.0.0:${port}`);
  });
}

startServer();
