import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints for Luxury Perfumery Backend
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", brand: "BORN TO STAND OUT — HAUTE PARFUMERIE", timestamp: new Date().toISOString() });
  });

  app.post("/api/checkout", (req, res) => {
    const { items, subtotal } = req.body;
    res.json({
      success: true,
      orderId: `BTSO-${Date.now().toString(36).toUpperCase()}`,
      message: "Haute order received. Preparing gold foil packaging and wax seal.",
      itemsCount: items?.length || 0,
      totalAmount: subtotal || 0,
    });
  });

  app.post("/api/engraving/validate", (req, res) => {
    const { text } = req.body;
    if (!text || text.length > 18) {
      res.status(400).json({ error: "Inscription must be between 1 and 18 characters." });
      return;
    }
    res.json({ valid: true, text: text.trim().toUpperCase() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Haute Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
