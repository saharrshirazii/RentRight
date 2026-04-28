import Price from "./components/Price/Price";
import Subtitle from "./components/Subtitle/Subtitle";
import Title from "./components/Title/Title";
import { useState } from "react";
import Dropdown from "./components/Dropdown/Dropdown";
import Input from "./components/Input/Input";
import Navbar from "./components/Navbar/Navbar";

//Dropdow category
const categoryOptions = [
  { label: "Select All", value: "select_all" },
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Home & Garden", value: "home_garden" },
];

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
  //dropdown select category
  const [selectedCategory, setSelectedCategory] = useState<string>("Select a Category");

  //handle select function to show an option when we select it.
  const handleSelect = (option: { label: string; value: string | number }) => {
    setSelectedCategory(option.label);
  };

  return (
    <main className="page-shell">
      <Navbar/>
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
      <Dropdown
        label={selectedCategory}
        options={categoryOptions}
        onSelect={handleSelect}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        onChange={(e) => console.log(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        error="Password must be 8 characters" // Example of an error state
      />
    </main>

    
  );
}
