import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import { createMemoryStore } from "../src/store.js";

const article = {
  title: "React 19 est disponible",
  url: "https://react.dev/blog/react-19",
  source: "react.dev",
};

test("ingestion d'un article", async () => {
  const app = createApp(createMemoryStore());
  const res = await request(app).post("/api/articles").send(article);
  assert.equal(res.status, 201);
  assert.equal(res.body.title, article.title);
});

test("déduplication par URL", async () => {
  const app = createApp(createMemoryStore());
  await request(app).post("/api/articles").send(article);
  const res = await request(app).post("/api/articles").send(article);
  assert.equal(res.status, 200);
  assert.equal(res.body.deduplicated, true);
});

test("listing filtré par source", async () => {
  const app = createApp(createMemoryStore());
  await request(app).post("/api/articles").send(article);
  await request(app).post("/api/articles").send({
    title: "Node 22", url: "https://nodejs.org/22", source: "nodejs.org" });
  const res = await request(app).get("/api/articles?source=react.dev");
  assert.equal(res.body.length, 1);
  assert.equal(res.body[0].source, "react.dev");
});

test("payload invalide → 400", async () => {
  const app = createApp(createMemoryStore());
  const res = await request(app).post("/api/articles").send({ title: "x" });
  assert.equal(res.status, 400);
});
