import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/entity.css";

type FinancialType = "RECEITA" | "DESPESA";

type FinancialDTO = {
  id?: number;
  type: FinancialType;
  value: number;
  description: string;
  date?: string;
  referenceOrderId?: number | null;
};

const API_BASE = "http://localhost:8080/financial";

const emptyForm = { type: "RECEITA" as FinancialType, description: "", referenceOrderId: null as number | null };

function centsToDisplay(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("pt-BR");
}

export default function FinancialPage() {
  const [records, setRecords] = useState<FinancialDTO[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [valueCents, setValueCents] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get<FinancialDTO[]>(API_BASE);
      setRecords(resp.data);
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
    const payload = { ...form, value: valueCents / 100 };
    try {
      const resp = isEdit
        ? await axios.put<FinancialDTO>(url, payload)
        : await axios.post<FinancialDTO>(url, payload);
      if (isEdit) {
        setRecords((prev) => prev.map((r) => (r.id === editId ? resp.data : r)));
        alert("Registro atualizado!");
      } else {
        setRecords((prev) => [...prev, resp.data]);
        alert("Registro cadastrado!");
      }
      setForm(emptyForm);
      setValueCents(0);
      setEditId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  function startEdit(r: FinancialDTO) {
    if (r.id == null) { setError("Backend não retornou 'id'."); return; }
    setEditId(r.id);
    setForm({ type: r.type, description: r.description, referenceOrderId: r.referenceOrderId ?? null });
    setValueCents(Math.round(r.value * 100));
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setValueCents(0);
  }

  async function remove(r: FinancialDTO) {
    if (r.id == null) { setError("Backend não retornou 'id'."); return; }
    setError(null);
    try {
      await axios.delete(`${API_BASE}/${r.id}`);
      setRecords((prev) => prev.filter((x) => x.id !== r.id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  const totalReceitas = records.filter((r) => r.type === "RECEITA").reduce((acc, r) => acc + Number(r.value), 0);
  const totalDespesas = records.filter((r) => r.type === "DESPESA").reduce((acc, r) => acc + Number(r.value), 0);

  return (
    <div className="entity-page">
      <h1>Financeiro</h1>

      <div className="entity-layout">
        <aside className="entity-sidebar">
          <form onSubmit={handleSubmit} className="entity-form">
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as FinancialType }))}
              required
            >
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
            </select>
            <label style={{ fontSize: "0.85em", opacity: 0.7, marginBottom: -4 }}>Valor (R$)</label>
            <input
              type="text"
              inputMode="numeric"
              value={centsToDisplay(valueCents)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setValueCents(parseInt(digits || "0", 10));
              }}
              required
            />
            <input
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
            <input
              placeholder="ID do Pedido (opcional)"
              type="number"
              min={1}
              value={form.referenceOrderId ?? ""}
              onFocus={(e) => e.target.select()}
              onChange={(e) =>
                setForm((p) => ({ ...p, referenceOrderId: e.target.value ? Number(e.target.value) : null }))
              }
            />

            <div className="entity-form-actions">
              <button type="submit">{editId !== null ? "Salvar" : "Cadastrar"}</button>
              {editId !== null && <button type="button" onClick={cancelEdit}>Cancelar</button>}
              <button type="button" onClick={load}>Recarregar</button>
            </div>
          </form>

          {loading && <p className="entity-loading">Carregando...</p>}
          {error && <p className="entity-error">{error}</p>}

          <div style={{ marginTop: 16, fontSize: "0.9em", borderTop: "1px solid #ccc", paddingTop: 12 }}>
            <p style={{ margin: "4px 0", color: "#4caf50" }}>Receitas: R$ {totalReceitas.toFixed(2)}</p>
            <p style={{ margin: "4px 0", color: "crimson" }}>Despesas: R$ {totalDespesas.toFixed(2)}</p>
            <p style={{ margin: "4px 0", fontWeight: "bold" }}>Saldo: R$ {(totalReceitas - totalDespesas).toFixed(2)}</p>
          </div>
        </aside>

        <div className="entity-content">
          <ul className="entity-list">
            {records.map((r) => (
              <li key={r.id} className="entity-list-item">
                <strong style={{ color: r.type === "RECEITA" ? "#4caf50" : "crimson" }}>
                  {r.type === "RECEITA" ? "▲" : "▼"} R$ {Number(r.value).toFixed(2)}
                </strong>
                <p className="entity-meta">{r.description}</p>
                <p className="entity-meta">{formatDate(r.date)}</p>
                {r.referenceOrderId && <p className="entity-meta">Pedido #: {r.referenceOrderId}</p>}
                <div className="entity-item-actions">
                  <button type="button" onClick={() => startEdit(r)}>Editar</button>
                  <button type="button" onClick={() => remove(r)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
