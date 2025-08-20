import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import App from "../../App";

describe("Add Transactions", () => {
  it("should add a new transaction and display it in the table", async () => {
    // Render the app
    const { container } = render(<App />);
    const user = userEvent.setup();

    // ---- Date input (no placeholder/label) ----
    // Grab the <input type="date" name="date"> directly from the DOM
    const dateInput = container.querySelector('input[name="date"][type="date"]');
    // JSDOM doesn't fully support typing into date inputs, so we set value via change event
    fireEvent.change(dateInput, { target: { value: "2025-08-20" } });

    // ---- Other inputs (have placeholders) ----
    const descriptionInput = screen.getByPlaceholderText("Description");
    const categoryInput = screen.getByPlaceholderText("Category");
    const amountInput = screen.getByPlaceholderText("Amount");

    await user.type(descriptionInput, "Test Transaction");
    await user.type(categoryInput, "Test Category");
    await user.type(amountInput, "123");

    // ---- Submit the form ----
    const addButton = screen.getByRole("button", { name: /Add Transaction/i });
    await user.click(addButton);

    // ---- Assert the new row appears in the table ----
    // findByText waits for async UI updates after POST/refetch/state update
    expect(await screen.findByText("Test Transaction")).toBeInTheDocument();
    expect(await screen.findByText("Test Category")).toBeInTheDocument();
    expect(await screen.findByText("123")).toBeInTheDocument();
  });
});