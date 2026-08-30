import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropertyCard from "./PropertyCard";

const mockProperty = {
  L_ListingID: "123",
  L_Address: "456 Oak Ave",
  L_City: "Portland",
  L_State: "OR",
  L_SystemPrice: 500000,
  L_Keyword2: 3,
  LM_Dec_3: 2,
  LM_Int2_3: 1500,
  L_Photos: JSON.stringify(["https://example.com/photo1.jpg"]),
};

test("renders property data correctly", () => {
  render(
    <MemoryRouter>
      <PropertyCard property={mockProperty} />
    </MemoryRouter>
  );

  expect(screen.getByText("$500,000")).toBeInTheDocument();
  expect(screen.getByText("456 Oak Ave")).toBeInTheDocument();
  expect(screen.getByText("Portland, OR")).toBeInTheDocument();
});

test("card links to the correct property detail page", () => {
  render(
    <MemoryRouter>
      <PropertyCard property={mockProperty} />
    </MemoryRouter>
  );

  const link = screen.getByRole("link");
  expect(link).toHaveAttribute("href", "/property/123");
});

test("shows 'Price not available' when price is missing", () => {
  const propertyWithoutPrice = { ...mockProperty, L_SystemPrice: null };

  render(
    <MemoryRouter>
      <PropertyCard property={propertyWithoutPrice} />
    </MemoryRouter>
  );

  expect(screen.getByText("Price not available")).toBeInTheDocument();
});