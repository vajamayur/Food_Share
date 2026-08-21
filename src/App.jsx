import { Component } from "react";
import pages from "./pages.json";
import "./styles.css";
import { pageRegistry } from "./pageRegistry";
import { FoodSharePage } from "./components/LegacyPage";

const routeAliases = {
  "/": "index.html",
  "/index.html": "index.html",
};

function pageFromPath() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (routeAliases[path]) return routeAliases[path];
  const name = path.split("/").pop();
  return pages[name] ? name : null;
}

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

class PageErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("FoodShare page error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="not-found" id="main">
          <div className="container-narrow">
            <p className="eyebrow">Something went wrong</p>
            <h1>We couldn't load this page</h1>
            <p>Please refresh the page or return to the home page.</p>
            <a className="btn btn-primary" href="/">Back to FoodShare</a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  // Render React pages if registered in pageRegistry
  const route = pageRegistry.find((r) => r.path === path);
  if (route && route.component) {
    const PageComponent = route.component;
    return (
      <PageErrorBoundary>
        <PageComponent />
      </PageErrorBoundary>
    );
  }

  const page = pageFromPath();
  const config = pages[page];
  return (
    <PageErrorBoundary>
      {config ? <FoodSharePage config={config} /> : <NotFound />}
    </PageErrorBoundary>
  );
}
