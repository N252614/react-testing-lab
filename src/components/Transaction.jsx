import React from "react";

function Transaction({ transaction }) {
  return (
    <tr>
      <td>{transaction.date}</td>
      <td>{transaction.description}</td>
      <td>{transaction.category}</td>
      <td>{transaction.amount}</td>
      <td>
        <button className="ui button red">Delete</button>
      </td>
    </tr>
  );
}

export default Transaction;
