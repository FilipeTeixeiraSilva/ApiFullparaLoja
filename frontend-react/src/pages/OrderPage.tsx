import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/entity.css";

type CustomerDTO = { id?: number; name: string };
type ServiceDTO  = { id?: number; name: string; price: number };
type ProductDTO  = { id?: number; name: string; price: number; stockQuantity: number };
type OrderItemInput = { productId: number; quantity: number };

type OrderDTO = {
  id?: number;
  customerId: number;
  customerName?: string;
  servicesIds: number[];
  items: OrderItemInput[];
  status?: string;
  orderDate?: string;
  completedDate?: string;
  totalValue?: number;
};

const STATUS_OPTIONS = ["PENDENTE", "PROCESSANDO", "CONCLUIDO", "CANCELADO"];

const ORDERS_API    = "http://localhost:8080/orders";
const CUSTOMERS_API = "http://localhost:8080/customers";
const SERVICES_API  = "http://localhost:8080/services";
const PRODUCTS_API  = "http://localhost:8080/products";

const emptyForm: Pick<OrderDTO, "customerId" | "servicesIds" | "items"> = {
  customerId: 0,
  servicesIds: [],
  items: [],
};

function formatDate(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("pt-BR");
}

export default function OrderPage() {
  const [orders, setOrders]         = useState<OrderDTO[]>([]);
  const [customers, setCustomers]   = useState<CustomerDTO[]>([]);
  const [servicesList, setServicesList] = useState<ServiceDTO[]>([]);
  const [productsList, setProductsList] = useState<ProductDTO[]>([]);
  const [form, setForm]             = useState(emptyForm);
  const [editId, setEditId]         = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("PENDENTE");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get<OrderDTO[]>(ORDERS_API);
      setOrders(resp.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    Promise.all([
      axios.get<CustomerDTO[]>(CUSTOMERS_API),
      axios.get<ServiceDTO[]>(SERVICES_API),
      axios.get<ProductDTO[]>(PRODUCTS_API),
    ])
      .then(([c, s, p]) => {
        setCustomers(c.data);
        setServicesList(s.data);
        setProductsList(p.data);
      })
      .catch(() => {});
  }, []);

  function toggleService(id: number) {
    setForm((prev) => {
      const ids = prev.servicesIds;
      return { ...prev, servicesIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] };
    });
  }

  function toggleProduct(id: number) {
    setForm((prev) => {
      const exists = prev.items.find((i) => i.productId === id);
      return {
        ...prev,
        items: exists
          ? prev.items.filter((i) => i.productId !== id)
          : [...prev.items, { productId: id, quantity: 1 }],
      };
    });
  }

  function setItemQty(id: number, quantity: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.productId === id ? { ...i, quantity } : i)),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editId !== null) {
        const resp = await axios.put<OrderDTO>(`${ORDERS_API}/${editId}/status`, { status: editStatus });
        setOrders((prev) => prev.map((o) => (o.id === editId ? resp.data : o)));
        alert("Status atualizado!");
        setEditId(null);
      } else {
        const resp = await axios.post<OrderDTO>(ORDERS_API, form);
        setOrders((prev) => [...prev, resp.data]);
        alert("Pedido criado!");
        setForm(emptyForm);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  function startEdit(o: OrderDTO) {
    if (o.id == null) { setError("Backend não retornou 'id'."); return; }
    setEditId(o.id);
    setEditStatus(o.status ?? "PENDENTE");
  }

  function cancelEdit() {
    setEditId(null);
  }

  async function remove(o: OrderDTO) {
    if (o.id == null) { setError("Backend não retornou 'id'."); return; }
    setError(null);
    try {
      await axios.delete(`${ORDERS_API}/${o.id}`);
      setOrders((prev) => prev.filter((x) => x.id !== o.id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  return (
    <div className="entity-page">
      <h1>Pedidos</h1>

      <div className="entity-layout">
        <aside className="entity-sidebar">
          <form onSubmit={handleSubmit} className="entity-form">
            {editId !== null ? (
              <>
                <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9em" }}>Editando Pedido #{editId}</p>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  required
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <select
                  value={form.customerId}
                  onChange={(e) => setForm((p) => ({ ...p, customerId: Number(e.target.value) }))}
                  required
                >
                  <option value={0} disabled>Selecione o cliente</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {servicesList.length > 0 && (
                  <fieldset style={{ border: "1px solid #ccc", borderRadius: 6, padding: "6px 10px" }}>
                    <legend style={{ fontSize: "0.85em", opacity: 0.7 }}>Serviços (opcional)</legend>
                    <div style={{ maxHeight: 120, overflowY: "auto" }}>
                      {servicesList.map((s) => (
                        <label
                          key={s.id}
                          style={{ display: "flex", gap: 6, alignItems: "center", fontSize: "0.9em", padding: "2px 0" }}
                        >
                          <input
                            type="checkbox"
                            checked={form.servicesIds.includes(s.id!)}
                            onChange={() => toggleService(s.id!)}
                          />
                          {s.name} — R$ {Number(s.price).toFixed(2)}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {productsList.length > 0 && (
                  <fieldset style={{ border: "1px solid #ccc", borderRadius: 6, padding: "6px 10px" }}>
                    <legend style={{ fontSize: "0.85em", opacity: 0.7 }}>Produtos</legend>
                    <div style={{ maxHeight: 150, overflowY: "auto" }}>
                      {productsList.map((p) => {
                        const selected = form.items.find((i) => i.productId === p.id!);
                        return (
                          <div
                            key={p.id}
                            style={{ display: "flex", gap: 6, alignItems: "center", fontSize: "0.9em", padding: "3px 0" }}
                          >
                            <input
                              type="checkbox"
                              checked={!!selected}
                              onChange={() => toggleProduct(p.id!)}
                            />
                            <span style={{ flex: 1 }}>
                              {p.name} — R$ {Number(p.price).toFixed(2)}
                              <span style={{ opacity: 0.5, fontSize: "0.85em" }}> (estoque: {p.stockQuantity})</span>
                            </span>
                            {selected && (
                              <input
                                type="number"
                                min={1}
                                max={p.stockQuantity}
                                value={selected.quantity}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setItemQty(p.id!, parseInt(e.target.value) || 1)}
                                style={{ width: 50 }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                )}
              </>
            )}

            <div className="entity-form-actions">
              <button type="submit">{editId !== null ? "Salvar Status" : "Criar Pedido"}</button>
              {editId !== null && <button type="button" onClick={cancelEdit}>Cancelar</button>}
              <button type="button" onClick={loadOrders}>Recarregar</button>
            </div>
          </form>

          {loading && <p className="entity-loading">Carregando...</p>}
          {error && <p className="entity-error">{error}</p>}
        </aside>

        <div className="entity-content">
          <ul className="entity-list">
            {orders.map((o) => (
              <li key={o.id} className="entity-list-item">
                <strong>Pedido #{o.id} — {o.customerName ?? `Cliente #${o.customerId}`}</strong>
                <p className="entity-meta">Status: {o.status}</p>
                <p className="entity-meta">Data: {formatDate(o.orderDate)}</p>
                {o.completedDate && (
                  <p className="entity-meta">Concluído: {formatDate(o.completedDate)}</p>
                )}
                <p className="entity-meta">
                  Total: R$ {o.totalValue != null ? Number(o.totalValue).toFixed(2) : "—"}
                </p>
                <div className="entity-item-actions">
                  <button type="button" onClick={() => startEdit(o)}>Editar Status</button>
                  <button type="button" onClick={() => remove(o)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
