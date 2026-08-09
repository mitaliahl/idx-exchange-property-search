// Base function for making requests to the backend and handling errors
async function request(path) {
  const response = await fetch(path);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Fetches a paginated list of properties
export function fetchProperties(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/api/properties${query ? `?${query}` : ""}`);
}

// Fetches a single property by id
export function fetchPropertyDetail(id) {
  return request(`/api/properties/${id}`);
}

export function fetchOpenHouses(id) {
  return request(`/api/properties/${id}/openhouses`);
}