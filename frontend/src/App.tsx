import Price from "./components/Price/Price";
import Subtitle from "./components/Subtitle/Subtitle";
import Title from "./components/Title/Title";

function StatIcon({ icon, value }: { icon: string; value: number }) {
  return (
    <div className="stat-icon">
      <span className="stat-icon__emoji" aria-hidden="true">
        {icon}
      </span>
      <span className="stat-icon__value">{value}</span>
    </div>
  );
}

export default function App() {
  return (
    <main className="page-shell">
      <section className="listing-card">
        <div className="listing-card__content">
          <Subtitle>Superhost i Stockholm</Subtitle>
          <Title as="h1">Mysig stuga vid vattnet</Title>
          <Subtitle>Nära natur, bad och lugna kvällar</Subtitle>
          <Price amount={1200} period="/natt" />

          <div className="listing-card__stats" aria-label="Boendedetaljer">
            <StatIcon icon="🛏️" value={1} />
            <StatIcon icon="🛁" value={1} />
            <StatIcon icon="👥" value={2} />
          </div>
        </div>
      </section>
    </main>

    
  );
}
