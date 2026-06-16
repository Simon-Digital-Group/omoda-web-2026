#!/usr/bin/env node
/**
 * Upload hero videos (or any large assets) to Vercel Blob and print their
 * public URLs, so they can be pasted into the Contentful `backgroundVideoUrl`
 * / `heroVideoUrl` fields — keeping video off Contentful's asset bandwidth.
 *
 * Setup:
 *   1. Get a Blob token: Vercel → Storage → your Blob store → ".env.local" tab,
 *      or run `vercel blob` once. Copy BLOB_READ_WRITE_TOKEN.
 *   2. Add it to .env.local (this script reads it from there or the env):
 *        BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
 *
 * Usage:
 *   # Upload every video in a folder (default: ./videos-to-upload)
 *   node scripts/upload-videos-to-blob.mjs
 *   node scripts/upload-videos-to-blob.mjs ./my-videos
 *
 *   # Or upload specific files
 *   node scripts/upload-videos-to-blob.mjs hero-omoda5.mp4 hero-j7.mp4
 *
 * Notes:
 *   - Uploads use multipart + public access, with the original filename as the
 *     pathname (no random suffix) so URLs are clean and stable.
 *   - Re-uploading the same filename overwrites it (allowOverwrite).
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import process from "node:process";
import { put } from "@vercel/blob";

const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);

/** Clean a filename into a tidy, URL-safe blob pathname (keeps the extension). */
function slugifyName(filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, path.extname(filename));
  const slug = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
  return `${slug || "video"}${ext}`;
}
const MIME = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/mp4",
};

// Minimal .env.local loader (no extra deps) — only fills missing vars.
async function loadEnvLocal() {
  try {
    const raw = await readFile(path.resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* no .env.local — rely on the real environment */
  }
}

async function resolveFiles(args) {
  // No args → scan the default folder.
  if (args.length === 0) args = ["./videos-to-upload"];

  // Single existing directory → all video files inside it.
  if (args.length === 1) {
    try {
      const s = await stat(args[0]);
      if (s.isDirectory()) {
        const names = await readdir(args[0]);
        return names
          .filter((n) => VIDEO_EXT.has(path.extname(n).toLowerCase()))
          .map((n) => path.join(args[0], n));
      }
    } catch {
      /* not a dir — fall through to treating args as file paths */
    }
  }
  return args;
}

async function main() {
  await loadEnvLocal();
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error(
      "✗ Missing BLOB_READ_WRITE_TOKEN. Add it to .env.local or your environment.\n" +
        "  Get it from Vercel → Storage → your Blob store."
    );
    process.exit(1);
  }

  const files = await resolveFiles(process.argv.slice(2));
  if (files.length === 0) {
    console.error(
      "✗ No video files found. Put .mp4/.webm files in ./videos-to-upload " +
        "or pass file paths as arguments."
    );
    process.exit(1);
  }

  console.log(`Uploading ${files.length} file(s) to Vercel Blob…\n`);
  const results = [];

  for (const file of files) {
    const name = path.basename(file);
    const blobName = slugifyName(name);
    const ext = path.extname(name).toLowerCase();
    try {
      const size = (await stat(file)).size;
      process.stdout.write(`  ↑ ${name} → ${blobName} (${(size / 1e6).toFixed(1)} MB) … `);
      const blob = await put(blobName, createReadStream(file), {
        access: "public",
        token,
        multipart: true,
        allowOverwrite: true,
        contentType: MIME[ext] || "application/octet-stream",
      });
      console.log("done");
      results.push({ name, url: blob.url });
    } catch (err) {
      console.log("FAILED");
      console.error(`    ${err?.message || err}`);
    }
  }

  if (results.length) {
    console.log("\n✓ Uploaded. Paste these URLs into Contentful:\n");
    for (const r of results) console.log(`  ${r.name}\n    ${r.url}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
