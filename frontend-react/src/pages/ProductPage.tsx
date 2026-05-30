import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/entity.css";

type ProductDTO = {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
};

const API_BASE = "http://localhost:8080/products";

const emptyForm = { name: "", description: "", category: "", stockQuantity: 0 };

function centsToDisplay(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProductPage() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [priceCents, setPriceCents] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get<ProductDTO[]>(API_BASE);
      setProducts(resp.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const isEdit = editId !== null;
    const url = isEdit ? `${API_BASE}/${editId}` : API_BASE;
    const payload = { ...form, price: priceCents / 100 };
    try {
      const resp = isEdit
        ? await axios.put<ProductDTO>(url, payload)
        : await axios.post<ProductDTO>(url, payload);
      if (isEdit) {
        setProducts((prev) => prev.map((p) => (p.id === editId ? resp.data : p)));
        alert("Produto atualizado!");
      } else {
        setProducts((prev) => [...prev, resp.data]);
        alert("Produto cadastrado!");
      }
      setForm(emptyForm);
      setPriceCents(0);
      setEditId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  function startEdit(p: ProductDTO) {
    if (p.id == null) { setError("Backend não retornou 'id'."); return; }
    setEditId(p.id);
    setForm({ name: p.name, description: p.description, category: p.category, stockQuantity: p.stockQuantity });
    setPriceCents(Math.round(p.price * 100));
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setPriceCents(0);
  }

  async function remove(p: ProductDTO) {
    if (p.id == null) { setError("Backend não retornou 'id'."); return; }
    setError(null);
    try {
      await axios.delete(`${API_BASE}/${p.id}`);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  return (
    <div className="entity-page">
      <h1>Produtos</h1>

      <div className="entity-layout">
        <aside className="entity-sidebar">
          <form onSubmit={handleSubmit} className="entity-form">
            <input
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
            <input
              placeholder="Categoria"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            />
            <label style={{ fontSize: "0.85em", opacity: 0.7, marginBottom: -4 }}>Preço (R$)</label>
            <input
              type="text"
              inputMode="numeric"
              value={centsToDisplay(priceCents)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setPriceCents(parseInt(digits || "0", 10));
              }}
              required
            />
            <label style={{ fontSize: "0.85em", opacity: 0.7, marginBottom: -4 }}>Quantidade em estoque</label>
            <input
              type="number"
              min={0}
              value={form.stockQuantity}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setForm((p) => ({ ...p, stockQuantity: parseInt(e.target.value) || 0 }))}
              required
            />

            <div className="entity-form-actions">
              <button type="submit">{editId !== null ? "Salvar" : "Cadastrar"}</button>
              {editId !== null && <button type="button" onClick={cancelEdit}>Cancelar</button>}
              <button type="button" onClick={load}>Recarregar</button>
            </div>
          </form>

          {loading && <p className="entity-loading">Carregando...</p>}
          {error && <p className="entity-error">{error}</p>}
        </aside>

        <div className="entity-content">
          <ul className="entity-list">
            {products.map((p) => (
              <li key={p.id} className="entity-list-item">
                <strong>{p.name}</strong>
                {p.category && <p className="entity-meta">Categoria: {p.category}</p>}
                {p.description && <p className="entity-meta">{p.description}</p>}
                <p className="entity-meta">
                  Preço: R$ {Number(p.price).toFixed(2)} | Estoque: {p.stockQuantity}
                </p>
                <div className="entity-item-actions">
                  <button type="button" onClick={() => startEdit(p)}>Editar</button>
                  <button type="button" onClick={() => remove(p)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
