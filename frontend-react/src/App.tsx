import { useState } from "react";
import CustomerPage from "./pages/CustomerPage";
import ProductPage from "./pages/ProductPage";
import ServicePage from "./pages/ServicePage";
import OrderPage from "./pages/OrderPage";
import FinancialPage from "./pages/FinancialPage";

type Page = "customers" | "products" | "services" | "orders" | "financial";

const NAV: { key: Page; label: string }[] = [
  { key: "customers", label: "Clientes" },
  { key: "products",  label: "Produtos" },
  { key: "services",  label: "Serviços" },
  { key: "orders",    label: "Pedidos" },
  { key: "financial", label: "Financeiro" },
];

export default function App() {
  const [page, setPage] = useState<Page>("customers");

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #ccc",
          flexWrap: "wrap",
        }}
      >
        {NAV.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            style={{ fontWeight: page === key ? "bold" : "normal" }}
          >
            {label}
          </button>
        ))}
      </nav>

      {page === "customers" && <CustomerPage />}
      {page === "products"  && <ProductPage />}
      {page === "services"  && <ServicePage />}
      {page === "orders"    && <OrderPage />}
      {page === "financial" && <FinancialPage />}
    </div>
  );
}
