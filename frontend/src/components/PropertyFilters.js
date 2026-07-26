import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <input name="city" placeholder="City" value={filters.city} onChange={handleChange} />
      <input name="zipcode" placeholder="ZIP code" value={filters.zipcode} onChange={handleChange} />
      <input name="minPrice" placeholder="Min price" value={filters.minPrice} onChange={handleChange} />
      <input name="maxPrice" placeholder="Max price" value={filters.maxPrice} onChange={handleChange} />

      <select name="beds" value={filters.beds} onChange={handleChange}>
        <option value="">Beds</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
        <option value="5">5+</option>
      </select>

      <select name="baths" value={filters.baths} onChange={handleChange}>
        <option value="">Baths</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>

      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>Clear Filters</button>
    </form>
  );
}

export default PropertyFilters;