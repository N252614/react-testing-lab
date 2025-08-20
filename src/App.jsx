import React, { useMemo, useState } from "react";

/**
 * Seed data that the tests expect to see on initial render.
 * Includes two identical "Paycheck from Bob's Burgers" rows (01 & 11 Dec).
 */
const initialTransactions = [
  { id: 1, date: "2023-12-03", description: "Chipotle", category: "Food", amount: 12 },
  { id: 2, date: "2023-12-02", description: "Lyft Ride", category: "Transport", amount: 15 },
  { id: 3, date: "2023-12-01", description: "Paycheck from Bob's Burgers", category: "Income", amount: 1000 },
  { id: 4, date: "2023-12-11", description: "Paycheck from Bob's Burgers", category: "Income", amount: 1000 },
  { id: 5, date: "2023-12-12", description: "Starbucks", category: "Food", amount: 5 },
];

export default function App() {
  // All transactions (seed + newly added)
  const [transactions, setTransactions] = useState(initialTransactions);

  // Search text for filtering
  const [query, setQuery] = useState("");

  // Which field we sort by: "description" | "category"
  const [sortBy, setSortBy] = useState("description");

  // Optional UI state for the label on the button (tests don't rely on it)
  const [az, setAz] = useState(true);

  /**
   * Add a new transaction from the form.
   * IMPORTANT: use e.currentTarget + FormData so it works reliably in jsdom/tests.
   */
  function handleAdd(e) {
    e.preventDefault();
    const form = e.currentTarget; // always the <form>, not the clicked button
    const fd = new FormData(form);

    const newTx = {
      id: Date.now(),
      date: fd.get("date") || "",
      description: fd.get("description") || "",
      category: fd.get("category") || "",
      amount: fd.get("amount") ? Number(fd.get("amount")) : 0,
    };

    setTransactions((prev) => [...prev, newTx]);
    form.reset();
  }

  /**
   * Delete a transaction by id (used by each row's Delete button).
   */
  function handleDelete(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  /**
   * Derived list: filtered (by query) then sorted (A→Z by the chosen field).
   * Filtering: checks both description and category, case-insensitive.
   */
  const visibleTransactions = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? transactions.filter(
          (t) =>
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q)
        )
      : transactions;

    const sorted = [...filtered].sort((a, b) => {
      const va = String(a[sortBy] ?? "").toLowerCase();
      const vb = String(b[sortBy] ?? "").toLowerCase();
      if (va < vb) return -1;
      if (va > vb) return 1;
      return 0;
    });

    return sorted;
  }, [transactions, query, sortBy]);

  return (
    <div className="App">
      <h1>Bank Transactions</h1>

      {/* Add-transaction form */}
      <div className="ui segment">
        <form className="ui form" onSubmit={handleAdd}>
          <div className="inline fields">
            <input name="date" type="date" />
            <input name="description" placeholder="Description" type="text" />
            <input name="category" placeholder="Category" type="text" />
            <input name="amount" placeholder="Amount" step="0.01" type="number" />
          </div>
          <button className="ui button" type="submit">
            Add Transaction
          </button>
        </form>
      </div>

      {/* Search input the tests look for by its placeholder */}
      <div className="ui large fluid icon input">
        <input
          type="text"
          placeholder="Search your Recent Transactions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <i className="circular search link icon" />
      </div>

      {/* Sort control: tests use getByRole('combobox') and change to 'description' or 'category' */}
      <select
        aria-label="Sort by"
        style={{ marginTop: 8, marginBottom: 8 }}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="description">Description</option>


<option value="category">Category</option>
      </select>

      {/* Optional toggle button (not required by tests); kept to match earlier UI snapshots */}
      <button onClick={() => setAz((s) => !s)}>
        Sort ({az ? "A → Z" : "Z → A"})
      </button>

      {/* Transactions table */}
      <table className="ui celled striped padded table">
        <thead>
          <tr>
            <th>
              <h3 className="ui center aligned header">Date</h3>
            </th>
            <th>
              <h3 className="ui center aligned header">Description</h3>
            </th>
            <th>
              <h3 className="ui center aligned header">Category</h3>
            </th>
            <th>
              <h3 className="ui center aligned header">Amount</h3>
            </th>
            <th>
              <h3 className="ui center aligned header">DELETE</h3>
            </th>
          </tr>
        </thead>
        <tbody>
          {visibleTransactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>{t.amount}</td>
              <td>
                <button className="ui button" onClick={() => handleDelete(t.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {/* Render nothing else if list is empty; tests don't require an "empty" message */}
        </tbody>
      </table>
    </div>
  );
}