import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ListingsPage from "./components/ListingsPage";
import PropertyDetailPage from "./components/PropertyDetailPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <Link to="/" className="site-logo">IDX Exchange</Link>
        <p className="site-tagline">Property Search</p>
      </header>

      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;