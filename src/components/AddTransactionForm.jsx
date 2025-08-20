import React from "react";

function AddTransactionForm({ postTransaction }) {
  // Handles the submit of the form and builds the payload safely
  function submitForm(e) {
    e.preventDefault();

    // Always read values from the <form>, not from the clicked element
    const form = e.currentTarget;

    // FormData is robust in jsdom and browsers; it doesn't rely on form.date etc.
    const data = new FormData(form);

    const newTransaction = {
      // FormData#get returns a string or null; we normalize to string/number
      date: (data.get("date") || "").toString(),
      description: (data.get("description") || "").toString(),
      category: (data.get("category") || "").toString(),
      amount: Number(data.get("amount") || 0),
    };

    // Delegate the actual POST/state update to the parent via prop
    // In your app this likely does: fetch('/transactions', { method: 'POST', body: JSON.stringify(...) }) then updates state
    postTransaction(newTransaction);

    // Optional UX: clear the form after successful submit
    form.reset();
  }

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={submitForm}>
        <div className="inline fields">
          {/* 'name' attributes are important for FormData keys */}
          <input type="date" name="date" />
          <input type="text" name="description" placeholder="Description" />
          <input type="text" name="category" placeholder="Category" />
          <input type="number" name="amount" placeholder="Amount" step="0.01" />
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
