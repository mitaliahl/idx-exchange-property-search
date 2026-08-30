const request = require("supertest");
const express = require("express");

jest.mock("../db/pool");
const pool = require("../db/pool");

const propertiesRouter = require("./properties");

const app = express();
app.use("/api/properties", propertiesRouter);

describe("GET /api/properties", () => {
  test("returns properties with default pagination", async () => {
    pool.query
      .mockResolvedValueOnce([[{ L_ListingID: "1", L_Address: "123 Main St" }]])
      .mockResolvedValueOnce([[{ total: 1 }]]);

    const response = await request(app).get("/api/properties");

    expect(response.status).toBe(200);
    expect(response.body.results).toHaveLength(1);
    expect(response.body.total).toBe(1);
    expect(response.body.limit).toBe(20);
    expect(response.body.offset).toBe(0);
  });

  test("applies custom limit and offset", async () => {
    pool.query
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([[{ total: 30 }]]);

    const response = await request(app).get("/api/properties?limit=10&offset=20");

    expect(response.status).toBe(200);
    expect(response.body.limit).toBe(10);
    expect(response.body.offset).toBe(20);
  });

  test("filters by city", async () => {
    pool.query
      .mockResolvedValueOnce([[{ L_ListingID: "1", L_City: "Portland" }]])
      .mockResolvedValueOnce([[{ total: 1 }]]);

    const response = await request(app).get("/api/properties?city=Portland");

    expect(response.status).toBe(200);
    expect(response.body.results[0].L_City).toBe("Portland");
  });

  test("rejects invalid limit with 400", async () => {
    const response = await request(app).get("/api/properties?limit=0");

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("rejects non-numeric minPrice with 400", async () => {
    const response = await request(app).get("/api/properties?minPrice=abc");

    expect(response.status).toBe(400);
  });

  test("returns 500 if the database query fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("Database connection lost"));

    const response = await request(app).get("/api/properties");

    expect(response.status).toBe(500);
  });
});

describe("GET /api/properties/:id", () => {
  test("returns a single property", async () => {
    pool.query.mockResolvedValueOnce([[{ L_ListingID: "123", L_Address: "456 Oak Ave" }]]);

    const response = await request(app).get("/api/properties/123");

    expect(response.status).toBe(200);
    expect(response.body.L_ListingID).toBe("123");
  });

  test("returns 404 for an unknown id", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const response = await request(app).get("/api/properties/999999999");

    expect(response.status).toBe(404);
  });

  test("returns 400 for a malformed id", async () => {
    const response = await request(app).get("/api/properties/abc123");

    expect(response.status).toBe(400);
  });
});

describe("GET /api/properties/:id/openhouses", () => {
  test("returns open houses for an existing property", async () => {
    pool.query
      .mockResolvedValueOnce([[{ L_ListingID: "123" }]])
      .mockResolvedValueOnce([[{ OpenHouseDate: "2026-06-20", OH_StartTime: "14:00:00" }]]);

    const response = await request(app).get("/api/properties/123/openhouses");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("returns an empty array when a property has no open houses", async () => {
    pool.query
      .mockResolvedValueOnce([[{ L_ListingID: "123" }]])
      .mockResolvedValueOnce([[]]);

    const response = await request(app).get("/api/properties/123/openhouses");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("returns 404 when the property doesn't exist", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const response = await request(app).get("/api/properties/999999999/openhouses");

    expect(response.status).toBe(404);
  });
});