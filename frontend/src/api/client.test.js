import { fetchProperties, fetchPropertyDetail } from "./client";

beforeEach(() => {
  global.fetch = jest.fn();
});

test("fetchProperties calls the API with filters", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ results: [{ L_ListingID: "123" }], total: 1 }),
  });

  const data = await fetchProperties({ city: "Austin" });

  expect(global.fetch).toHaveBeenCalledWith("/api/properties?city=Austin");
  expect(data.results).toEqual([{ L_ListingID: "123" }]);
  expect(data.total).toBe(1);
});

test("fetchProperties works with no filters", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ results: [], total: 0 }),
  });

  const data = await fetchProperties();

  expect(global.fetch).toHaveBeenCalledWith("/api/properties");
  expect(data.results).toEqual([]);
});

test("fetchProperties throws an error when the response is not ok", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 404,
    json: async () => ({ error: "Property not found" }),
  });

  await expect(fetchProperties()).rejects.toThrow("Property not found");
});

test("fetchPropertyDetail calls the correct URL", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ L_ListingID: "123" }),
  });

  await fetchPropertyDetail("123");

  expect(global.fetch).toHaveBeenCalledWith("/api/properties/123");
});