import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../lib/auth";
import { UPLOADS_DIR, UPLOADS_URL_PREFIX, ensureDirs } from "../lib/paths";

/**
 * Admin media uploads.
 *
 * Files land on disk under public/uploads and the client only ever stores the
 * returned URL. Nothing is base64'd into the catalogue — a handful of 4K reels
 * would otherwise blow past the browser's storage quota and bloat every page
 * payload with the video inline.
 */
const ACCEPTED = /^(image|video)\//;
const MAX_BYTES = 256 * 1024 * 1024; // 256 MB — comfortably fits a short 4K reel.

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDirs();
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 12) || "";
    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "asset";
    cb(null, `${base}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED.test(file.mimetype)) {
      cb(new Error("Only image and video files can be uploaded."));
      return;
    }
    cb(null, true);
  },
});

export const uploadsRouter = Router();

uploadsRouter.post("/", requireAdmin, (req, res) => {
  upload.single("file")(req, res, (error: unknown) => {
    if (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      res.status(400).json({ error: message });
      return;
    }

    const file = (req as typeof req & { file?: Express.Multer.File }).file;
    if (!file) {
      res.status(400).json({ error: "No file received." });
      return;
    }

    res.status(201).json({
      url: `${UPLOADS_URL_PREFIX}/${file.filename}`,
      kind: file.mimetype.startsWith("video/") ? "video" : "image",
      mimeType: file.mimetype,
      size: file.size,
      originalName: file.originalname,
    });
  });
});

/** Housekeeping: let the panel drop a file it just replaced. */
uploadsRouter.delete("/:filename", requireAdmin, (req, res) => {
  const filename = path.basename(req.params.filename);
  const target = path.join(UPLOADS_DIR, filename);

  if (!target.startsWith(UPLOADS_DIR) || !fs.existsSync(target)) {
    res.status(404).json({ error: "No such upload." });
    return;
  }

  fs.unlinkSync(target);
  res.json({ ok: true });
});

uploadsRouter.get("/", requireAdmin, (_req, res) => {
  ensureDirs();
  const files = fs
    .readdirSync(UPLOADS_DIR)
    .filter((name) => !name.startsWith("."))
    .map((name) => {
      const stat = fs.statSync(path.join(UPLOADS_DIR, name));
      return {
        url: `${UPLOADS_URL_PREFIX}/${name}`,
        name,
        size: stat.size,
        modifiedAt: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));

  res.json({ files });
});
