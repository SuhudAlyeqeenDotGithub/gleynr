import { Receipt } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/sites/selectors";
import type { TokenTransaction } from "@/lib/sites/types";
import { useLocalPage } from "@/lib/pagination/use-local-page";
import Pagination from "../../shared/pagination";

type TokenHistoryProps = {
  transactions: TokenTransaction[];
};

const TokenHistory = ({ transactions }: TokenHistoryProps) => {
  const { rows, pagination } = useLocalPage(transactions, "token-history");
  return (
  <section className="panel">
    <div className="panel-head">
      <div>
        <h2>Token purchases</h2>
        <p>Simulated transactions recorded in this session</p>
      </div>
      <Receipt size={16} />
    </div>
    <div className="table token-table">
      <div className="table-row table-header">
        <span>Reference</span>
        <span>Date</span>
        <span>Tokens</span>
        <span>Total</span>
      </div>
      {rows.map((item) => (
        <div className="table-row" key={item.id}>
          <span>
            <strong>{item.reference}</strong>
            <small>{formatCurrency(item.pricePerToken)} per token</small>
          </span>
          <span>{formatDate(item.purchasedAt)}</span>
          <span>+{item.quantity}</span>
          <span>{formatCurrency(item.total)}</span>
        </div>
      ))}
    </div>
    <Pagination controls={pagination} label="purchases" />
  </section>
  );
};

export default TokenHistory;
