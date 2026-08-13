import { Router } from "express";
import type { Fragrance } from "../../src/types/fragrance";
import { requireAdmin } from "../lib/auth";
import { mutateStore, readStore, resetStore } from "../lib/db";

export const catalogRouter = Router();

const isFragrance = (value: unknown): value is Fragrance =>
  typeof value === "object" && value !== null && typeof (value as Fragrance).id === "string";

/** Everything the storefront needs in one round trip. */
catalogRouter.get("/", (_req, res) => {
  const store = readStore();
  res.json({ products: store.products, settings: store.settings, updatedAt: store.updatedAt });
});

/**
 * First-run seed. Open on purpose but idempotent-by-refusal: once the store
 * holds a catalogue it can only be changed through the authenticated routes.
 */
catalogRouter.post("/seed", (req, res) => {
  const store = readStore();
  if (store.products !== null) {
    res.status(409).json({ error: "Catalogue already seeded.", products: store.products });
    return;
  }

  const incoming = req.body?.products;
  if (!Array.isArray(incoming) || !incoming.every(isFragrance)) {
    res.status(400).json({ error: "A products array is required to seed." });
    return;
  }

  const next = mutateStore((draft) => {
    draft.products = incoming;
  });
  res.status(201).json({ products: next.products });
});

/** Replace the whole catalogue — used by bulk operations in the panel. */
catalogRouter.put("/products", requireAdmin, (req, res) => {
  const incoming = req.body?.products;
  if (!Array.isArray(incoming) || !incoming.every(isFragrance)) {
    res.status(400).json({ error: "A products array is required." });
    return;
  }

  const next = mutateStore((draft) => {
    draft.products = incoming;
  });
  res.json({ products: next.products });
});

catalogRouter.post("/products", requireAdmin, (req, res) => {
  const product = req.body?.product;
  if (!isFragrance(product)) {
    res.status(400).json({ error: "A product object with an id is required." });
    return;
  }

  const store = readStore();
  if ((store.products ?? []).some((p) => p.id === product.id)) {
    res.status(409).json({ error: `A product with id "${product.id}" already exists.` });
    return;
  }

  const next = mutateStore((draft) => {
    draft.products = [product, ...(draft.products ?? [])];
  });
  res.status(201).json({ products: next.products });
});

catalogRouter.patch("/products/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const patch = req.body?.product;
  if (typeof patch !== "object" || patch === null) {
    res.status(400).json({ error: "A product patch object is required." });
    return;
  }

  const store = readStore();
  if (!(store.products ?? []).some((p) => p.id === id)) {
    res.status(404).json({ error: `No product with id "${id}".` });
    return;
  }

  const next = mutateStore((draft) => {
    draft.products = (draft.products ?? []).map((p) =>
      p.id === id ? ({ ...p, ...patch, id: p.id } as Fragrance) : p
    );
  });
  res.json({ products: next.products });
});

catalogRouter.delete("/products/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const store = readStore();
  if (!(store.products ?? []).some((p) => p.id === id)) {
    res.status(404).json({ error: `No product with id "${id}".` });
    return;
  }

  const next = mutateStore((draft) => {
    draft.products = (draft.products ?? []).filter((p) => p.id !== id);
  });
  res.json({ products: next.products });
});

/** Drop every override — catalogue and settings go back to what ships. */
catalogRouter.post("/reset", requireAdmin, (_req, res) => {
  const next = resetStore();
  res.json({ products: next.products, settings: next.settings });
});
