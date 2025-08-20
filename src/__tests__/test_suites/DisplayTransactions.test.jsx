import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../../App";

describe("Display Transactions", () => {
  it("should display transactions from the server when the app loads", async () => {
    // Render the App so it fetches and displays transactions
    render(<App />);

    // There are TWO rows with this description in the seed data (01 & 11 Dec)
    const paychecks = await screen.findAllByText("Paycheck from Bob's Burgers");
    expect(paychecks).toHaveLength(2);

    // Use role-based queries to avoid matching the <option> "Description"
    expect(
      screen.getByRole("columnheader", { name: /Description/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Amount/i })
    ).toBeInTheDocument();

    // Optional: verify table and at least N data rows exist
    const table = screen.getByRole("table");
    // Grab all rows inside the table body (one header row + many data rows)
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBeGreaterThan(5);

    // Check another unique transaction for sanity
    expect(await screen.findByText("Lyft Ride")).toBeInTheDocument();
  });
});