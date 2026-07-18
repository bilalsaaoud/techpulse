import { createApp } from "./app.js";
import { createPgStore, createMemoryStore } from "./store.js";

const PORT = process.env.PORT || 3002;

async function main() {
  let store;
  try {
    store = await createPgStore(
      process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/techpulse");
    console.log("✔ PostgreSQL connecté");
  } catch (e) {
    console.warn("PostgreSQL indisponible, store mémoire :", e.message);
    store = createMemoryStore();
  }
  createApp(store).listen(PORT, () => console.log(`TechPulse API sur :${PORT}`));
}

main();
