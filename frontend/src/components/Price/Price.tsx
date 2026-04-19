type PriceProps = {
  amount: number;
  currency?: string;
  period?: string;
  className?: string;
};

export default function Price({
  amount,
  currency = "kr",
  period = "/månad",
  className = "",
}: PriceProps) {
  const formattedAmount = new Intl.NumberFormat("sv-SE").format(amount);

  return (
    <p className={`price ${className}`.trim()}>
      {formattedAmount} {currency}
      {period ? <span className="price__period">{period}</span> : null}
    </p>
  );
}
