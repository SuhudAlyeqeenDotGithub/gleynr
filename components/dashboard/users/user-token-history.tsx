import { Receipt } from "lucide-react";
import type { UserTokenPurchase } from "@/lib/users/use-users-store";
import { useLocalPage } from "@/lib/pagination/use-local-page";
import Pagination from "../shared/pagination";

type UserTokenHistoryProps = {
  purchases: UserTokenPurchase[];
};

const formatPounds = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

const UserTokenHistory = ({ purchases }: UserTokenHistoryProps) => {
  const { rows, pagination } = useLocalPage(purchases, "user-token-history");
  return (
  <section className="panel user-token-history-panel">
    <div className="panel-head">
      <div>
        <h2>User Token purchases</h2>
        <p>Simulated purchases recorded in this session.</p>
      </div>
      <Receipt size={16} aria-hidden="true" />
    </div>
    {purchases.length ? (
      <div className="user-token-history-scroll">
        <div
          className="user-token-history-table"
          role="table"
          aria-label="User Token purchases"
        >
          <div className="user-token-history-row history-heading" role="row">
            <span role="columnheader">Reference</span>
            <span role="columnheader">User type</span>
            <span role="columnheader">Date</span>
            <span role="columnheader">Tokens</span>
            <span role="columnheader">Monthly total</span>
          </div>
          {rows.map((purchase) => (
            <div
              className="user-token-history-row"
              role="row"
              key={purchase.id}
            >
              <span role="cell">
                <strong>{purchase.reference}</strong>
                <small>{formatPounds(purchase.pricePerToken)} per token</small>
              </span>
              <span role="cell">{purchase.type}</span>
              <span role="cell">{formatDate(purchase.purchasedAt)}</span>
              <span role="cell">+{purchase.quantity}</span>
              <span role="cell">{formatPounds(purchase.total)}</span>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="user-token-history-empty">
        <Receipt size={19} />
        <strong>No User Token purchases yet</strong>
        <span>Confirmed simulated purchases will appear here.</span>
      </div>
    )}
    <Pagination controls={pagination} label="purchases" />
  </section>
  );
};

export default UserTokenHistory;
