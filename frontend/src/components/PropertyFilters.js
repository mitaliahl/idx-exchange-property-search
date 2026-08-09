import { useState } from "react";
import "./PropertyFilters.css";

function PropertyFilters({ onSearch, onClear }) {
  const [filters, setFilters] = useState({
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(filters);
  }

  function handleClear() {
    const emptyFilters = {
      city: "",
      zipcode: "",
      minPrice: "",
      maxPrice: "",
      beds: "",
      baths: "",
    };
    setFilters(emptyFilters);
    onClear();
  }

  return (
    <form onSubmit={handleSubmit} className="filters-bar">
      <div className="filter-field">
        <label htmlFor="city">City</label>
        <input id="city" name="city" placeholder="e.g. Portland" value={filters.city} onChange={handleChange} />
      </div>

      <div className="filter-field">
        <label htmlFor="zipcode">ZIP code</label>
        <input id="zipcode" name="zipcode" placeholder="e.g. 90210" value={filters.zipcode} onChange={handleChange} />
      </div>

      <div className="filter-field filter-field-price">
        <label>Price range</label>
        <div className="price-inputs">
          <input name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} />
          <span className="price-separator">–</span>
          <input name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} />
        </div>
      </div>

      <div className="filter-field">
        <label htmlFor="beds">Beds</label>
        <select id="beds" name="beds" value={filters.beds} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="baths">Baths</label>
        <select id="baths" name="baths" value={filters.baths} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="filter-buttons">
        <button type="submit" className="btn-primary">Search</button>
        <button type="button" onClick={handleClear} className="btn-secondary">Clear</button>
      </div>
    </form>
  );
}

export default PropertyFilters;