import { useEffect, useState } from "react";
import pages from "../pages.json";

function NotFound() {
  return (
    <main className="not-found" id="main">
      <div className="container-narrow">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist or may have moved.</p>
        <a className="btn btn-primary" href="/">Back to FoodShare</a>
      </div>
    </main>
  );
}

/**
 * Renders a page body straight from pages.json and then executes that
 * page's associated <script> tags (in order), exactly the way a static
 * HTML page would have. This is required for anything with a form
 * submit handler, tab/filter binding, or dashboard data render, since
 * dangerouslySetInnerHTML alone never executes embedded scripts.
 */
export function FoodSharePage({ config }) {
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    document.title = config.title || "FoodShare";
    document.documentElement.lang = "en";
    const scripts = [];
    let cancelled = false;

    const loadScript = (script) => new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.async = false;
      if (script.src) {
        element.src = script.src;
      } else {
        // Page snippets are build-time content from pages.json, never user input.
        // Appending a script node avoids evaluating strings in the application runtime.
        element.text = script.inline;
      }
      element.onload = resolve;
      element.onerror = reject;
      document.body.appendChild(element);
      scripts.push(element);
      if (!script.src) resolve();
    });

    const runScripts = async () => {
      try {
        for (const script of config.scripts || []) {
          if (cancelled) return;
          await loadScript(script);
        }
        if (!cancelled) document.dispatchEvent(new Event("DOMContentLoaded"));
      } catch (error) {
        console.error("FoodShare script error:", error);
        if (!cancelled) setScriptError(true);
      }
    };

    runScripts();
    return () => {
      cancelled = true;
      scripts.forEach((script) => script.remove());
    };
  }, [config]);

  if (scriptError) {
    return <NotFound />;
  }

  return <div dangerouslySetInnerHTML={{ __html: config.body }} />;
}

/**
 * Convenience wrapper: look up a pages.json entry by key (e.g. "login.html")
 * and render it with FoodSharePage. Use this from src/pages/*.jsx instead of
 * hand-rolling dangerouslySetInnerHTML, eval(), or a separate mock component,
 * so every route gets the real content, real scripts, and real data.
 */
export default function LegacyPage({ pageKey }) {
  const config = pages[pageKey];
  if (!config) return <NotFound />;
  return <FoodSharePage config={config} />;
}
