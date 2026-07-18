import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3002";

interface Article {
  id: number;
  title: string;
  url: string;
  source: string;
  published_at: string;
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = filter ? `?source=${encodeURIComponent(filter)}` : "";
    fetch(`${API}/api/articles${q}`).then((r) => r.json()).then(setArticles);
    fetch(`${API}/api/sources`).then((r) => r.json()).then(setSources);
  }, [filter]);

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui", padding: "0 1rem" }}>
      <h1>📡 TechPulse</h1>
      <p style={{ color: "#64748b" }}>
        Veille technologique agrégée automatiquement par n8n toutes les 6 heures.
      </p>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}
              style={{ padding: ".4rem", margin: "1rem 0" }}>
        <option value="">Toutes les sources</option>
        {sources.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {articles.length === 0 && <p>Aucun article — activez le workflow n8n.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {articles.map((a) => (
          <li key={a.id} style={{ background: "#fff", border: "1px solid #e2e8f0",
                                  borderRadius: 10, padding: "0.8rem 1rem", marginBottom: 8 }}>
            <a href={a.url} target="_blank" rel="noreferrer"
               style={{ fontWeight: 600, color: "#1d4ed8", textDecoration: "none" }}>
              {a.title}
            </a>
            <div style={{ fontSize: ".8rem", color: "#64748b" }}>
              {a.source} — {new Date(a.published_at).toLocaleString("fr-FR")}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
