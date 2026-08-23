import pages from "../pages.json";
import { FoodSharePage } from "../components/LegacyPage";

const missionVisionSection = `
<!-- Mission and vision -->
<section class="section-tight" style="background: var(--surface-sunken);">
<div class="container">
<div class="section-head">
<div class="eyebrow">Our Mission &amp; Vision</div>
<h2>Making surplus food a shared resource</h2>
</div>
<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
<div class="card card-pad reveal">
<h3>Mission</h3>
<p style="color: var(--text-muted); margin: 0;">To reduce food waste and alleviate hunger by creating an efficient system that connects excess food from events with people in need.</p>
</div>
<div class="card card-pad reveal" style="transition-delay: 0.08s;">
<h3>Vision</h3>
<p style="color: var(--text-muted); margin: 0;">We strive to reduce food waste, fight hunger, and make sharing surplus a normal, everyday act of kindness.</p>
</div>
</div>
</div>
</section>
`;

export default function About() {
  const config = pages["about.html"];
  const body = config.body.replace("<!-- Mission / Values -->", `${missionVisionSection}\n<!-- Mission / Values -->`);

  return <FoodSharePage config={{ ...config, body }} />;
}
