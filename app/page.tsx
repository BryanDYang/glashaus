import { FeatureCard } from "@/components/feature-card";
import { capabilities, workflowStages } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Glashaus</p>
          <h1>Structured deal coordination for real estate teams.</h1>
          <p className="lede">
            A workflow-first workspace for buyer and seller transactions,
            with AI-assisted guidance layered on top of durable state,
            document control, and human review.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/api/health">
              Health check
            </a>
            <a className="button button-secondary" href="#capabilities">
              View capabilities
            </a>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="panel-label">Core stack</p>
          <ul className="stack-list">
            <li>Next.js + TypeScript</li>
            <li>Supabase Postgres + Storage</li>
            <li>LangGraph workflow orchestration</li>
          </ul>
        </aside>
      </section>

      <section className="stats-grid" aria-label="Project focus areas">
        {workflowStages.map((stage) => (
          <article className="stat-card" key={stage.label}>
            <p className="stat-label">{stage.label}</p>
            <p className="stat-value">{stage.value}</p>
          </article>
        ))}
      </section>

      <section id="capabilities" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Capabilities</p>
          <h2>Where the app starts.</h2>
        </div>
        <div className="feature-grid">
          {capabilities.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
}
