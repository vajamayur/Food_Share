import { useEffect, useState } from "react";

import { foodApi } from "../api/services";

function formatDate(value) {
  if (!value) return "Expiry not provided";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ApiDemo() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFoods() {
    setLoading(true);
    setError("");
    try {
      setFoods(await foodApi.getAvailable());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <main className="api-demo-page container">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Live backend test</p>
          <h1>Available food</h1>
          <p className="api-demo-intro">This list comes live from the FoodShare Spring Boot API.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={loadFoods} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && <p className="api-status">Food listings are loading...</p>}
      {!loading && error && <p className="api-status error" role="alert">{error}</p>}
      {!loading && !error && foods.length === 0 && <p className="api-status">There are no available food listings at the moment.</p>}
      {!loading && !error && foods.length > 0 && (
        <div className="api-food-grid">
          {foods.map((food) => (
            <article className="api-food-card" key={food.id}>
              <p className="eyebrow">{food.category || "Food"}</p>
              <h2>{food.foodName}</h2>
              <p>{food.description || "No description provided."}</p>
              <div className="api-food-meta">
                <strong>{food.quantity} {food.unit}</strong>
                <span>Expires {formatDate(food.expiryTime)}</span>
              </div>
              <small>{food.pickupAddress || "Pickup address not provided"}</small>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}