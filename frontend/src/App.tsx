import { useState } from "react";

type TabId =
  | "boende"
  | "bokningar"
  | "tillganglighet"
  | "prissattning"
  | "recensioner"
  | "statistik";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "boende", label: "Boende" },
  { id: "bokningar", label: "Bokningar" },
  { id: "tillganglighet", label: "Tillganglighet" },
  { id: "prissattning", label: "Prissattning" },
  { id: "recensioner", label: "Recensioner" },
  { id: "statistik", label: "Statistik" },
];

const stats = [
  { title: "Totalt intjaning", value: "127 500 kr", meta: "+12% sedan forra manaden", tone: "green" },
  { title: "Antal bokningar", value: "24", meta: "+3 nya denna manad", tone: "blue" },
  { title: "Genomsnittligt betyg", value: "4.8", meta: "Baserat pa 83 recensioner", tone: "orange" },
  { title: "Belaggningsgrad", value: "78%", meta: "+5% sedan forra manaden", tone: "cyan" },
];

const listings = [
  {
    title: "Mysig lagenhet i centrum",
    location: "Goteborg, Sverige",
    description:
      "Ljus och rymlig lagenhet i hjartat av stan med balkong och utsikt over staden. Perfekt for par eller sma familjer.",
    meta: ["4.8", "60 m2", "2 sovrum", "1 badrum"],
    tag: "Lagenhet",
    price: "1 450 kr",
  },
  {
    title: "Mysig lagenhet i centrum",
    location: "Goteborg, Sverige",
    description:
      "Ljus och rymlig lagenhet i hjartat av stan med balkong och utsikt over staden. Perfekt for par eller sma familjer.",
    meta: ["4.8", "60 m2", "2 sovrum", "1 badrum"],
    tag: "Lagenhet",
    price: "1 450 kr",
  },
  {
    title: "Mysig lagenhet i centrum",
    location: "Goteborg, Sverige",
    description:
      "Ljus och rymlig lagenhet i hjartat av stan med balkong och utsikt over staden. Perfekt for par eller sma familjer.",
    meta: ["4.8", "60 m2", "2 sovrum", "1 badrum"],
    tag: "Lagenhet",
    price: "1 450 kr",
  },
];

const bookings = [
  {
    title: "Mysig lagenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 natter",
    guests: "2 Gaster",
    total: "6 000 kr",
    status: "Bekraftad",
    statusTone: "blue",
    action: "Bekrafta igen",
  },
  {
    title: "Mysig lagenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 natter",
    guests: "2 Gaster",
    total: "6 000 kr",
    status: "Vantar",
    statusTone: "yellow",
    action: "Godkann",
  },
  {
    title: "Mysig lagenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 natter",
    guests: "2 Gaster",
    total: "6 000 kr",
    status: "Bekraftad",
    statusTone: "blue",
    action: "Reservera sjalv",
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("boende");

  return (
    <main className="host-shell">
      <section className="host-frame">
        <header className="topbar">
          <div className="brand">RentRight</div>

          <nav className="quick-nav" aria-label="Main navigation">
            <button type="button" className="quick-nav__icon" aria-label="Theme toggle">
              ◔
            </button>
            <button type="button" className="quick-nav__item">
              Utforska
            </button>
            <button type="button" className="quick-nav__item quick-nav__item--active">
              Mina boenden
            </button>
            <button type="button" className="quick-nav__item">
              Profil
            </button>
          </nav>

          <div className="topbar__actions">
            <span className="user-name">Anna Andersson</span>
            <button type="button" className="logout-button">
              Logga ut
            </button>
          </div>
        </header>

        <section className="page-header">
          <div>
            <h1>Vard Dashboard</h1>
            <p>Hantera dina boenden, bokningar och gaster</p>
          </div>

          <button type="button" className="primary-button">
            + Lagg till boende
          </button>
        </section>

        <section className="stats-grid" aria-label="Host statistics">
          {stats.map((stat) => (
            <article key={stat.title} className={`stat-card stat-card--${stat.tone}`}>
              <span className="stat-card__title">{stat.title}</span>
              <strong className="stat-card__value">{stat.value}</strong>
              <span className="stat-card__meta">{stat.meta}</span>
            </article>
          ))}
        </section>

        <section className="tabs-panel" aria-label="Host sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={tab.id === activeTab ? "tab-button is-active" : "tab-button"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </section>

        <section className="content-panel">
          {activeTab === "boende" ? <ListingsView /> : null}
          {activeTab === "bokningar" ? <BookingsView /> : null}
          {activeTab !== "boende" && activeTab !== "bokningar" ? (
            <PlaceholderView label={tabs.find((tab) => tab.id === activeTab)?.label ?? ""} />
          ) : null}
        </section>
      </section>
    </main>
  );
}

function ListingsView() {
  return (
    <div className="stack">
      {listings.map((listing, index) => (
        <article key={`${listing.title}-${index}`} className="listing-card">
          <div className="listing-card__image" aria-hidden="true" />

          <div className="listing-card__body">
            <div className="listing-card__top">
              <div>
                <div className="listing-card__title-row">
                  <h2>{listing.title}</h2>
                  <span className="listing-badge">{listing.tag}</span>
                </div>
                <p className="listing-card__location">{listing.location}</p>
              </div>

              <div className="listing-card__price">{listing.price}</div>
            </div>

            <p className="listing-card__description">{listing.description}</p>

            <div className="listing-card__meta">
              {listing.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="listing-card__actions">
              <button type="button" className="ghost-button">
                Visa
              </button>
              <button type="button" className="ghost-button">
                Redigera
              </button>
              <button type="button" className="ghost-button ghost-button--danger">
                Ta bort
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function BookingsView() {
  return (
    <div className="bookings-panel">
      <div className="section-heading">
        <div className="section-heading__icon">▣</div>
        <div>
          <h2>Alla bokningar</h2>
          <p>Hantera och folj upp dina bokningar</p>
        </div>
      </div>

      <div className="stack">
        {bookings.map((booking, index) => (
          <article key={`${booking.title}-${index}`} className="booking-card">
            <div className="booking-avatar" aria-hidden="true" />

            <div className="booking-card__body">
              <div>
                <h3>{booking.title}</h3>
                <p>{booking.nights}</p>
                <p>{booking.range}</p>
                <p>{booking.guests}</p>
              </div>

              <div className="booking-card__summary">
                <strong>{booking.total}</strong>
                <span className={`status-pill status-pill--${booking.statusTone}`}>
                  {booking.status}
                </span>
                <button
                  type="button"
                  className={
                    booking.statusTone === "yellow"
                      ? "mini-action mini-action--green"
                      : "mini-action"
                  }
                >
                  {booking.action}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PlaceholderView({ label }: { label: string }) {
  return (
    <div className="placeholder-card">
      <h2>{label}</h2>
      <p>Den har designvyn ar inte byggd nu. Just nu finns bara layouten for Boende och Bokningar enligt referensen.</p>
    </div>
  );
}

export default App;
