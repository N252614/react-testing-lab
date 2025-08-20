import React from "react";

export default function Search({ value, onChange }) {
  // Controlled input to keep UI & tests in sync
  return (
    <div className="ui large fluid icon input">
      <input
        placeholder="Search your Recent Transactions"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <i className="circular search link icon" />
    </div>
  );
}
