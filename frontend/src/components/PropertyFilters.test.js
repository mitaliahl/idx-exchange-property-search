import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilters from "./PropertyFilters";

test("renders all six filter inputs", () => {
  render(<PropertyFilters onSearch={() => {}} onClear={() => {}} />);

  expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("ZIP code")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Min price")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Max price")).toBeInTheDocument();
  expect(screen.getByText("Beds")).toBeInTheDocument();
  expect(screen.getByText("Baths")).toBeInTheDocument();
});

test("submitting the form calls onSearch with entered values", () => {
  const onSearch = jest.fn();
  render(<PropertyFilters onSearch={onSearch} onClear={() => {}} />);

  fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Austin" } });
  fireEvent.click(screen.getByText("Search"));

  expect(onSearch).toHaveBeenCalledWith({
    city: "Austin",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  });
});

test("clear button resets the form and calls onClear", () => {
  const onClear = jest.fn();
  render(<PropertyFilters onSearch={() => {}} onClear={onClear} />);

  const cityInput = screen.getByPlaceholderText("City");
  fireEvent.change(cityInput, { target: { value: "Austin" } });
  fireEvent.click(screen.getByText("Clear Filters"));

  expect(cityInput.value).toBe("");
  expect(onClear).toHaveBeenCalled();
});