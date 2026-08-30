# IDX Exchange Property Search Application

A Zillow/Redfin-style property search app built with React, Express, and MySQL.

## Tech Stack

- Frontend: React 19 (Create React App), React Router 6
- Backend: Node.js, Express
- Database: MySQL 8 (via Docker)
- Testing: Jest, React Testing Library, Supertest

## Local Setup

1. Clone the repo:
   ```
   git clone <repo-url>
   cd idx-exchange-property-search
   ```

2. Start MySQL in Docker:
   ```
   docker run --name idx-mysql-local -e MYSQL_ROOT_PASSWORD=yourpassword -e MYSQL_DATABASE=rets -p 3306:3306 -d mysql:8
   ```

3. Import the provided SQL files:
   ```
   docker exec -i idx-mysql-local mysql -uroot -pyourpassword rets < rets_property.sql
   docker exec -i idx-mysql-local mysql -uroot -pyourpassword rets < rets_openhouse.sql
   ```

4. Backend setup:
   ```
   cd backend
   npm install
   ```
   Create a `.env` file in `backend/`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=rets
   PORT=5000
   ```
   Start the server:
   ```
   npm run dev
   ```

5. Frontend setup (in a new terminal):
   ```
   cd frontend
   npm install
   ```
   Create a `.env` file in `frontend/`:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
   ```
   Start the app:
   ```
   npm start
   ```

6. Visit `http://localhost:3000`.

## Running Tests

Backend:
```
cd backend
npx jest --coverage
```

Frontend:
```
cd frontend
npm test -- --coverage
```

## API Reference

### GET /api/health
Returns server/database connection status.
```
Response: { "status": "ok", "database": "connected" }
```

### GET /api/properties
Returns a paginated, filterable list of properties.

Query params: `limit`, `offset`, `city`, `zipcode`, `minPrice`, `maxPrice`, `beds`, `baths`

Example:
```
GET /api/properties?city=Portland&minPrice=300000&beds=3&limit=20&offset=0
```
```
Response shape: { "total": <number>, "limit": <number>, "offset": <number>, "results": [...] }
```

### GET /api/properties/:id
Returns a single property object, or 404 if the ID doesn't exist.

### GET /api/properties/:id/openhouses
Returns an array of open house events for a property (empty array if none scheduled).

## Features

- Searchable, filterable property listings with pagination
- Property detail pages with photo gallery, map, and open house schedule
- Favorites - save properties locally, view them in a dedicated page
- Responsive filter bar with city, ZIP, price range, beds, and baths

## Database Schema

- **rets_property**-- property listings. Key columns: `L_ListingID`, `L_Address`, `L_City`, `L_State`, `L_SystemPrice` (price), `L_Keyword2` (beds), `LM_Dec_3` (baths), `LM_Int2_3` (sqft), `L_Photos` (JSON array of URLs), `LMD_MP_Latitude`, `LMD_MP_Longitude`, `L_Remarks`, `YearBuilt`, `LotSizeAcres`
- **rets_openhouse**-- open house events. Key columns: `L_ListingID` (foreign key to rets_property), `OpenHouseDate`, `OH_StartTime`, `OH_EndTime`, `all_data` (JSON blob containing `OpenHouseRemarks` and other fields)

Indexes: `idx_property_city_norm`, `idx_property_beds`, `idx_city_price`, `idx_price_beds` on `rets_property` for common filter combinations.

## Known Issues

- Property photo URLs can expire over time since they're tied to external listing services; if images appear broken, request fresh data tables
- `L_Photos` is not always valid JSON; handled defensively with try/catch in the frontend
- City names have inconsistent casing in the source data; normalized with `LOWER(TRIM())` in backend queries
- `react-router-dom` is pinned to v6 rather than v7, since v7's module structure currently has resolution issues with Create React App's bundled Jest setup

## Future Improvements

- Add sorting by price, date listed, or square footage
- Add a natural language search option
- Deploy to production (Render + PlanetScale + Vercel)