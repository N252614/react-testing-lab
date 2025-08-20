import React from "react";
import Transaction from "./Transaction";

/**
 * Renders the table header and delegates each data row
 * to the <Transaction /> row component.
 */
function TransactionsList({ transactions }) {
  return (
    <table className="ui celled striped padded table">
      <thead>
        <tr>
          <th><h3 className="ui center aligned header">Date</h3></th>
          <th><h3 className="ui center aligned header">Description</h3></th>
          <th><h3 className="ui center aligned header">Category</h3></th>
          <th><h3 className="ui center aligned header">Amount</h3></th>
          <th><h3 className="ui center aligned header">DELETE</h3></th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((t, idx) => (
          // Use a stable key if the item has an id; otherwise fall back to a composite
          <Transaction
            key={t.id ?? `${t.date}-${t.description}-${idx}`}
            transaction={t}
          />
        ))}
      </tbody>
    </table>
  );
}

export default TransactionsList;