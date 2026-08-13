import { Router } from "express";

/**
 * Storefront endpoints. These stay stubs — nothing is charged or stored — but
 * they keep their original contracts so the cart and newsletter behave.
 */
export const commerceRouter = Router();

commerceRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    brand: "CHECKMATE — HAUTE PARFUMERIE",
    timestamp: new Date().toISOString(),
  });
});

commerceRouter.post("/checkout", (req, res) => {
  const { items, subtotal } = req.body ?? {};
  res.json({
    success: true,
    orderId: `CKMT-${Date.now().toString(36).toUpperCase()}`,
    message: "Haute order received. Preparing gold foil packaging and wax seal.",
    itemsCount: items?.length || 0,
    totalAmount: subtotal || 0,
  });
});

commerceRouter.post("/engraving/validate", (req, res) => {
  const { text } = req.body ?? {};
  if (!text || text.length > 18) {
    res.status(400).json({ error: "Inscription must be between 1 and 18 characters." });
    return;
  }
  res.json({ valid: true, text: text.trim().toUpperCase() });
});

commerceRouter.post("/newsletter", (req, res) => {
  const { email } = req.body ?? {};
  const looksLikeEmail = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!looksLikeEmail) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }
  // TODO: forward to the mailing provider. Nothing is stored yet — this only
  // validates and acknowledges, matching the other stubbed endpoints.
  res.json({ subscribed: true, email: email.trim().toLowerCase() });
});
