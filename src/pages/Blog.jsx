import { useEffect, useState } from "react";

const awarenessArticles = [
  {
    icon: "🍱",
    title: "Why Should We Reduce Food Waste?",
    body: "Food waste is not only about throwing away food. It also means wasting the water, energy, land, transportation, and effort used to produce that food. By planning meals, storing food properly, using leftovers, and donating safe surplus food, we can reduce unnecessary waste.",
  },
  {
    icon: "🌱",
    title: "Simple Ways to Reduce Food Waste at Home",
    body: "Small changes in our daily habits can make a big difference.",
    list: ["Plan your meals before shopping.", "Buy only what you need.", "Store food properly.", "Use leftovers creatively.", "Check food before throwing it away.", "Donate safe surplus food."],
  },
  {
    icon: "♻️",
    title: "Sustainable Food Practices",
    body: "Sustainable food practices help us use food and natural resources responsibly. Choosing local food, reducing unnecessary packaging, avoiding over-purchasing, and using food efficiently can contribute to a healthier environment. FoodShare encourages everyone to make responsible food choices and reduce avoidable waste.",
  },
  {
    icon: "🤝",
    title: "From Surplus Food to Community Support",
    body: "A restaurant, hotel, supermarket, event, or household may have safe surplus food that they no longer need. Instead of throwing it away, that food can be shared through FoodShare.",
    flow: "Donor → FoodShare → NGO → Volunteer → Community",
  },
];

const latestNews = [
  ["📢", "FoodShare Awareness Campaign", "Join our food-waste awareness initiative and learn simple ways to prevent food from becoming waste."],
  ["🏫", "Community Food Awareness Drive", "Schools, colleges, organizations, and communities can participate in awareness activities and promote responsible food practices."],
  ["🍽️", "Food Donation Drive", "Help connect safe surplus food with organizations and communities that can benefit from it."],
];

export default function Blog() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    document.title = "Blog & News — FoodShare";
    document.documentElement.lang = "en";
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container site-nav">
          <a className="brand" href="/">FoodShare</a>
          <button className="nav-toggle" type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <ul className={`nav-links${menuOpen ? " open" : ""}`}>
            <li><a href="/#how">How it works</a></li>
            <li><a href="/about">About us</a></li>
            <li><a className="active" href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <div className="nav-actions">
            <a className="btn btn-ghost btn-sm" href="/login">Log in</a>
            <a className="btn btn-primary btn-sm" href="/signup">Sign up free</a>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="blog-intro section">
          <div className="container">
            <p className="eyebrow">FoodShare journal</p>
            <h1 className="blog-title-fade">Blog &amp; News</h1>
            <p>Discover useful information, practical tips, and community stories that can help us reduce food waste and build a more sustainable future.</p>
          </div>
        </section>

        <section className="section-tight" aria-labelledby="awareness-title">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Food waste awareness</p>
              <h2 id="awareness-title">Small choices. Shared impact.</h2>
            </div>
            <div className="blog-article-grid">
              {awarenessArticles.map((article) => (
                <article className={`blog-article${selectedArticle === article.title ? " blog-article-selected" : ""}`} key={article.title}>
                  <span className="blog-icon" aria-hidden="true">{article.icon}</span>
                  <h3>{article.title}</h3>
                  <p>{article.body}</p>
                  {article.list && <ul>{article.list.map((item) => <li key={item}>{item}</li>)}</ul>}
                  {article.flow && <p className="blog-flow">{article.flow}</p>}
                  <button className="blog-read-more" type="button" aria-pressed={selectedArticle === article.title} onClick={() => setSelectedArticle((current) => current === article.title ? null : article.title)}>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="blog-callout section-tight">
          <div className="container">
            <p className="eyebrow">Every meal matters</p>
            <h2>Share Food. Reduce Waste. Support Communities.</h2>
            <p>Reducing food waste starts with awareness. When individuals, businesses, NGOs, and volunteers work together, even small actions can create a positive impact.</p>
          </div>
        </section>

        <section className="section" id="latest-news" aria-labelledby="latest-news-title">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Stay connected</p>
              <h2 id="latest-news-title">Latest Awareness News</h2>
            </div>
            <div className="news-grid">
              {latestNews.map(([icon, title, body]) => (
                <article className="news-item" key={title}>
                  <span className="blog-icon" aria-hidden="true">{icon}</span>
                  <div><h3>{title}</h3><p>{body}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand">FoodShare</div>
              <p style={{ maxWidth: "32ch", marginTop: "1rem" }}>A platform connecting donors and NGOs to rescue surplus food before it goes to waste.</p>
              <div className="footer-social" aria-label="Social media links">
                <a className="footer-social-link" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V7.6c0-.9.3-1.5 1.7-1.5H17V3.2c-.3 0-1.4-.2-2.7-.2-2.7 0-4.5 1.6-4.5 4.7V11H7v3h2.8v8h3.7z" /></svg></a>
                <a className="footer-social-link" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm5.25-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 0 0 1 1.25-1.25z" /></svg></a>
                <a className="footer-social-link" href="https://wa.me/#" target="_blank" rel="noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.58 15.12L2.2 22l5.01-1.32A9.95 9.95 0 1 0 12.04 2zm5.76 14.12c-.25.7-1.47 1.32-2.1 1.38-.52.06-1.18.08-3.8-.8-3.22-1.16-5.29-4.05-5.45-4.24-.16-.19-1.3-1.73-1.3-3.31 0-1.58.83-2.35 1.12-2.67.29-.31.64-.39.85-.39h.61c.2 0 .47.01.72.53.3.63.96 2.17.98 2.32.02.15.02.35-.1.57-.1.22-.18.31-.34.5-.17.19-.36.42-.51.56-.17.16-.34.33-.15.66.18.32.81 1.35 1.74 2.18 1.2 1.06 2.2 1.39 2.52 1.55.32.16.5.13.68-.08.18-.2.77-.88.98-1.18.2-.31.41-.26.7-.16.29.11 1.86 0 1.86 0z" /></svg></a>
              </div>
            </div>
            <div><h4>Platform</h4><ul><li><a href="/#how">How it works</a></li><li><a href="/#board">Live board</a></li><li><a href="/signup">Sign up</a></li></ul></div>
            <div><h4>Account</h4><ul><li><a href="/login">Log in</a></li><li><a href="/signup?role=donor">Donor sign up</a></li><li><a href="/signup?role=ngo">NGO sign up</a></li></ul></div>
            <div><h4>Team</h4><ul><li><a href="/admin-login">Admin login</a></li><li><a href="/volunteer-login">Volunteer login</a></li></ul></div>
          </div>
        </div>
      </footer>
    </>
  );
}