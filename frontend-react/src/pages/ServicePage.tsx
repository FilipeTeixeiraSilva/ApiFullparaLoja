import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/entity.css";

type ServiceDTO = {
  id?: number;
  name: string;
  description: string;
  price: number;
};

const API_BASE = "http://localhost:8080/services";

const emptyForm = { name: "", description: "" };

function centsToDisplay(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ServicePage() {
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [priceCents, setPriceCents] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get<ServiceDTO[]>(API_BASE);
      setServices(resp.data);
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
        ? await axios.put<ServiceDTO>(url, payload)
        : await axios.post<ServiceDTO>(url, payload);
      if (isEdit) {
        setServices((prev) => prev.map((s) => (s.id === editId ? resp.data : s)));
        alert("Serviço atualizado!");
      } else {
        setServices((prev) => [...prev, resp.data]);
        alert("Serviço cadastrado!");
      }
      setForm(emptyForm);
      setPriceCents(0);
      setEditId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  function startEdit(s: ServiceDTO) {
    if (s.id == null) { setError("Backend não retornou 'id'."); return; }
    setEditId(s.id);
    setForm({ name: s.name, description: s.description });
    setPriceCents(Math.round(s.price * 100));
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setPriceCents(0);
  }

  async function remove(s: ServiceDTO) {
    if (s.id == null) { setError("Backend não retornou 'id'."); return; }
    setError(null);
    try {
      await axios.delete(`${API_BASE}/${s.id}`);
      setServices((prev) => prev.filter((x) => x.id !== s.id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  return (
    <div className="entity-page">
      <h1>Serviços</h1>

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
            {services.map((s) => (
              <li key={s.id} className="entity-list-item">
                <strong>{s.name}</strong>
                {s.description && <p className="entity-meta">{s.description}</p>}
                <p className="entity-meta">R$ {Number(s.price).toFixed(2)}</p>
                <div className="entity-item-actions">
                  <button type="button" onClick={() => startEdit(s)}>Editar</button>
                  <button type="button" onClick={() => remove(s)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
