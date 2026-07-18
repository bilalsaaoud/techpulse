import express from "express";
import cors from "cors";

export function createApp(store) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  // Ingestion — appelé par le workflow n8n
  app.post("/api/articles", async (req, res) => {
    const { title, url, source } = req.body || {};
    if (!title || !url || !source)
      return res.status(400).json({ error: "title, url et source requis" });
    const article = await store.insert(req.body);
    if (!article) return res.status(200).json({ deduplicated: true });
    res.status(201).json(article);
  });

  app.get("/api/articles", async (req, res) => {
    res.json(await store.list({
      source: req.query.source,
      limit: Math.min(Number(req.query.limit) || 50, 200),
    }));
  });

  app.get("/api/sources", async (_req, res) => res.json(await store.sources()));

  return app;
}
