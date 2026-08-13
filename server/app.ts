import express, { type Express } from "express";
import path from "path";
import { UPLOADS_DIR, UPLOADS_URL_PREFIX, ensureDirs } from "./lib/paths";
import { authRouter } from "./routes/auth";
import { catalogRouter } from "./routes/catalog";
import { commerceRouter } from "./routes/commerce";
import { settingsRouter } from "./routes/settings";
import { uploadsRouter } from "./routes/uploads";

/**
 * The API surface, assembled without any knowledge of how it is served. The
 * dev entry mounts Vite around this; production mounts the built SPA.
 */
export const createApp = (): Express => {
  ensureDirs();

  const app = express();

  // Catalogue payloads carry long editorial copy for every fragrance, so the
  // default 100kb JSON ceiling is too tight. Media never travels as JSON —
  // it goes through the multipart upload route.
  app.use(express.json({ limit: "8mb" }));

  // Admin media, served straight off disk and cached hard: filenames carry a
  // random suffix, so a URL never points at different bytes later.
  app.use(
    UPLOADS_URL_PREFIX,
    express.static(UPLOADS_DIR, {
      maxAge: "365d",
      immutable: true,
      fallthrough: true,
    })
  );

  app.use("/api", commerceRouter);
  app.use("/api/admin", authRouter);
  app.use("/api/catalog", catalogRouter);
  app.use("/api/settings", settingsRouter);
  app.use("/api/uploads", uploadsRouter);

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Unknown API route." });
  });

  return app;
};

export const staticSpa = (app: Express, distDir: string): void => {
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
};
