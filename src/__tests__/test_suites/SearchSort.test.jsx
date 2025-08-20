import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// Import App from the correct path in your project structure
import App from "../../App";

describe("Search & Sort", () => {
  it("updates the list when search input changes", async () => {
    // Render the full app so we exercise the real integration pipeline
    render(<App />);
    const user = userEvent.setup();

    // Ensure initial data is loaded before interacting with the UI
    expect(await screen.findByText("Lyft Ride")).toBeInTheDocument();
    expect(await screen.findByText("Chipotle")).toBeInTheDocument();

    // Find the search input by its placeholder text
    const search = screen.getByPlaceholderText("Search your Recent Transactions");

    // Type a query that should keep 'Lyft Ride' and filter out unrelated rows
    await user.clear(search);
    await user.type(search, "Lyft");

    // Wait for the UI to update (state change / filtered render)
    await waitFor(() => {
      // 'Chipotle' should be filtered out
      expect(screen.queryByText("Chipotle")).toBeNull();
    });

    // 'Lyft Ride' should remain visible
    expect(screen.getByText("Lyft Ride")).toBeInTheDocument();

    // Partial, case-insensitive search should also work
    await user.clear(search);
    await user.type(search, "ly");
    expect(await screen.findByText("Lyft Ride")).toBeInTheDocument();
  });

  it("sorts rows by Description when the select is set to 'Description'", async () => {
    render(<App />);

    // Wait for the table to be present
    const table = await screen.findByRole("table");

    // Helper to read the Description column (2nd column) from all data rows
    const getDescriptions = () => {
      // Get all rows, skip the header row
      const rows = within(table).getAllByRole("row").slice(1);
      // Extract the 2nd cell (index 1) which is the Description column
      return rows.map((row) => within(row).getAllByRole("cell")[1].textContent?.trim() || "");
    };

    const before = getDescriptions();

    // Change the sort dropdown to "Description"
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "description" } });

    const after = getDescriptions();

    // Compare against a sorted copy (localeCompare for stable alphabetical order)
    const sorted = [...before].sort((a, b) => a.localeCompare(b));
    expect(after).toEqual(sorted);
  });

  it("sorts rows by Category when the select is set to 'Category'", async () => {
    render(<App />);

    const table = await screen.findByRole("table");

    // Helper to read the Category column (3rd column) from all data rows
    const getCategories = () => {
      const rows = within(table).getAllByRole("row").slice(1);
      // 3rd cell (index 2) is the Category column
      return rows.map((row) => within(row).getAllByRole("cell")[2].textContent?.trim() || "");
    };

    const before = getCategories();

    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "category" } });

    const after = getCategories();

    const sorted = [...before].sort((a, b) => a.localeCompare(b));
    expect(after).toEqual(sorted);
  });
});