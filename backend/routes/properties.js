// Handles requests to the /api/properties route.
// Supports pagination, filtering and returns a total count for the frontend.

const express = require('express'); // Imports Express
const router = express.Router(); // A router is needed so server.js can use this file as a route
const pool = require('../db/pool'); // Imports the MySQL connection pool

// A distinct error type so we can tell apart 400 and 500
class ValidationError extends Error {}


//Two validation functions here to make sure the input number makes sense.


// Checks that a value is a whole number within an optional max, and returns it as a Number.
// Throws ValidationError if the value is missing, not a number, not an integer, <= 0 or too big.
function parsePositiveInt(value, fieldName, max = null) {
  if (value === undefined) return null; // Not provided — caller treats this as "no filter"

  const number = Number(value);

  if (!Number.isInteger(number) || number <= 0) {
    throw new ValidationError(`${fieldName} must be a positive whole number`);
  }
  if (max !== null && number > max) {
    throw new ValidationError(`${fieldName} cannot be greater than ${max}`);
  }

  return number;
}

// Checks that a value is a number >= 0. Used for prices and offset which can be 0.
function parseNonNegativeNumber(value, fieldName) {
  if (value === undefined) return null;

  const number = Number(value);

  if (Number.isNaN(number) || number < 0) {
    throw new ValidationError(`${fieldName} must be a non-negative number`);
  }

  return number;
}

router.get('/', async (req, res) => {
  try {
    // Pagination: default to 20 results per page, starting at the first row.
    // Max limit of 100 stops from unreasonably large request
    const limit = parsePositiveInt(req.query.limit ?? "20", "limit", 100);
    const offset = parseNonNegativeNumber(req.query.offset ?? "0", "offset");

    // Validate numeric filters up front
    const minPrice = parseNonNegativeNumber(req.query.minPrice, "minPrice");
    const maxPrice = parseNonNegativeNumber(req.query.maxPrice, "maxPrice");
    const beds = parsePositiveInt(req.query.beds, "beds");
    const baths = parsePositiveInt(req.query.baths, "baths");

    let sql = "SELECT * FROM rets_property WHERE 1=1";
    let sqlCount = "SELECT COUNT(*) AS total FROM rets_property WHERE 1=1";
    let params = [];
    let paramsCount = [];

    // Adds a filter condition to both queries and pushes its value into both params arrays
    // Keeping conditions and values added together (in the same call) is what keeps the "?" placeholders lined up correctly with their values.
    function addFilter(column, operator, value) {
      if (value !== undefined && value !== null) {
        sql += ` AND ${column} ${operator} ?`;
        sqlCount += ` AND ${column} ${operator} ?`;
        params.push(value);
        paramsCount.push(value);
      }
    }

    // city_normalized is a generated column for LOWER(TRIM(L_City))
    //  Only normalize the input if a city was actually provided.

    if (req.query.city !== undefined) {
      const normalizedCity = req.query.city.toLowerCase().trim();
      addFilter("city_normalized", "=", normalizedCity);
    }

    addFilter("L_Zip", "=", req.query.zipcode);
    addFilter("L_SystemPrice", ">=", minPrice);
    addFilter("L_SystemPrice", "<=", maxPrice);
    addFilter("L_Keyword2", ">=", beds);
    addFilter("LM_Dec_3", ">=", baths);

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Execute both queries and return the results and total count.
    const [rows] = await pool.query(sql, params);
    const [countRows] = await pool.query(sqlCount, paramsCount);
    const total = countRows[0].total;

    return res.json({
      total,
      limit,
      offset,
      results: rows
    });

  } catch (err) {
    if (err instanceof ValidationError) {
      // The user's fault bad input 400
      return res.status(400).json({ error: err.message });
    }
    // Not the user's fault DB down, unexpected bug... 500
    console.error("GET /api/properties failed:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;