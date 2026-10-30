import { formatPrice } from "@/lib/plans/selectors";

type BasePriceProps = {
  price: number | null;
  currency: string;
};

// Always pairs a base price with its usage-charge qualifier.
const BasePrice = ({ price, currency }: BasePriceProps) => (
  <span className="plans-base-price">
    <strong>{formatPrice(price, currency)}</strong>
    {price ? <span className="per">/ month</span> : null}
    <span className="plus-usage">+ usage charges</span>
  </span>
);

export default BasePrice;
