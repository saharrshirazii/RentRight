import React from "react";

interface StatItem {
  title: string;
  value: string;
  meta: string;
  tone: string;
}

interface HostDashboardProps {
  stats?: StatItem[];
}


const defaultStats: StatItem[] = [
  { title: "Totalt intjäning", value: "127 500 kr", meta: "+12% sedan förra månaden", tone: "green" },
  { title: "Antal bokningar", value: "24", meta: "+3 nya denna månad", tone: "blue" },
  { title: "Genomsnittligt betyg", value: "4.8", meta: "Baserat på 83 recensioner", tone: "orange" },
  { title: "Beläggningsgrad", value: "78%", meta: "+5% sedan förra månaden", tone: "cyan" },
];

const HostDashboard: React.FC<HostDashboardProps> = ({ stats = defaultStats }) => {
  return (
    <div style={{ padding: "20px" }}>
      <section className="page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "4px" }}>
            Värd Dashboard
          </h1>
          <p style={{ color: "#6b7280" }}>Hantera dina boenden, bokningar och gäster</p>
        </div>
      </section>

    
      <section className="stats-grid" aria-label="Host statistics" style={{ marginBottom: "32px" }}>
        {stats.map((stat) => (
          <article key={stat.title} className={`stat-card stat-card--${stat.tone}`}>
            <span className="stat-card__title">{stat.title}</span>
            <strong className="stat-card__value">{stat.value}</strong>
            <span className="stat-card__meta">{stat.meta}</span>
          </article>
        ))}
      </section>
    </div>
  );
};

export default HostDashboard;