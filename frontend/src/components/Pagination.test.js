import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

test("renders nothing when there is only one page", () => {
  const { container } = render(
    <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
  );
  expect(container.firstChild).toBeNull();
});

test("Previous is disabled on the first page", () => {
  render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
  expect(screen.getByText("Previous")).toBeDisabled();
});

test("Next is disabled on the last page", () => {
  render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
  expect(screen.getByText("Next")).toBeDisabled();
});

test("clicking a page number calls onPageChange with that page", () => {
  const onPageChange = jest.fn();
  render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

  fireEvent.click(screen.getByText("3"));

  expect(onPageChange).toHaveBeenCalledWith(3);
});

test("shows ellipsis for a middle page with a large page count", () => {
  render(<Pagination currentPage={12} totalPages={24} onPageChange={() => {}} />);

  const ellipses = screen.getAllByText("...");
  expect(ellipses.length).toBe(2);
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("24")).toBeInTheDocument();
});

test("does not show the last page number twice when near the end", () => {
  render(<Pagination currentPage={23} totalPages={24} onPageChange={() => {}} />);

  const lastPageButtons = screen.getAllByText("24");
  expect(lastPageButtons.length).toBe(1);
});