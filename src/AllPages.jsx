import React from "react";
import pages from "./pages.json";

function labelFromKey(key) {
  if (!key) return key;
  const name = key.replace(/\.html$/, "");
  if (name === "index") return "Home";
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AllPages() {
  const entries = Object.keys(pages || {}).map((k) => {
    const name = labelFromKey(k);
    const path = k === "index.html" ? "/" : `/${k.replace(/\.html$/, "")}`;
    return { name, path };
  });

  return (
    <section className="all-pages-page">
      <h1>FoodShare — All Pages</h1>
      <p>Open any FoodShare page:</p>
      <div className="all-pages-grid">
        {entries.map(({ name, path }) => (
          <a className="all-page-card" href={path} key={path}>
            <strong>{name}</strong>
            <span>{path}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
