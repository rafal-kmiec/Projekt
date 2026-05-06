import React from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle2, ShoppingCart, UserRound } from "lucide-react";
import "./styles.css";

const products = [
  { id: "backpack", name: "QA Backpack", price: "$49.99" },
  { id: "lamp", name: "Debug Lamp", price: "$19.99" },
  { id: "notebook", name: "Test Notebook", price: "$9.99" }
];

function App() {
  const path = window.location.pathname;

  if (path === "/health") {
    return <pre data-testid="health-status">ok</pre>;
  }

  return (
    <main className="app-shell" data-testid="app-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <a href="/" className="brand" data-testid="brand-link">QA Shop</a>
        <div className="nav-links">
          <a href="/login" data-testid="login-link"><UserRound size={18} /> Login</a>
          <a href="/products" data-testid="products-link"><ShoppingCart size={18} /> Products</a>
        </div>
      </nav>
      {path === "/products" ? <ProductsPage /> : path === "/login" ? <LoginPage /> : <HomePage />}
    </main>
  );
}

function HomePage() {
  return (
    <section className="hero" data-testid="home-page">
      <p className="eyebrow">Dockerized automation target</p>
      <h1>QA Shop</h1>
      <p className="summary">
        A controlled demo app for Selenium and Playwright examples, designed with stable selectors and predictable flows.
      </p>
      <a className="primary-action" href="/products" data-testid="start-shopping-link">Open products</a>
    </section>
  );
}

function LoginPage() {
  return (
    <section className="panel" data-testid="login-page">
      <h1>Login</h1>
      <form className="form" data-testid="login-form">
        <label>
          Username
          <input data-testid="username-input" name="username" defaultValue="standard_user" />
        </label>
        <label>
          Password
          <input data-testid="password-input" name="password" type="password" defaultValue="secret_sauce" />
        </label>
        <button data-testid="login-submit" type="button">Sign in</button>
      </form>
    </section>
  );
}

function ProductsPage() {
  return (
    <section className="panel" data-testid="products-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Products</h1>
        </div>
        <span className="status"><CheckCircle2 size={18} /> Ready for tests</span>
      </div>
      <div className="product-grid" data-testid="product-grid">
        {products.map((product) => (
          <article className="product-card" data-testid="product-card" key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.price}</p>
            <button data-testid={`add-to-cart-${product.id}`} type="button">Add to cart</button>
          </article>
        ))}
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
