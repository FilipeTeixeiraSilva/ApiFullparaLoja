import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/entity.css";

type CustomerDTO = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  birthDate: string; // dd/MM/yyyy para a API
};

const API_BASE = "http://localhost:8080/customers";

const emptyForm: Omit<CustomerDTO, "id"> = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  address: "",
  birthDate: "",
};

// yyyy-MM-dd (input date) → dd/MM/yyyy (API)
function toAPIDate(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

// dd/MM/yyyy (API) → yyyy-MM-dd (input date)
function toHTMLDate(d: string) {
  if (!d) return "";
  const [day, m, y] = d.split("/");
  return `${y}-${m}-${day}`;
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [birthInput, setBirthInput] = useState(""); // valor do <input type="date">
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get<CustomerDTO[]>(API_BASE);
      setCustomers(resp.data);
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
    const payload = { ...form, birthDate: toAPIDate(birthInput) };
    const isEdit = editId !== null;
    const url = isEdit ? `${API_BASE}/${editId}` : API_BASE;
    try {
      const resp = isEdit
        ? await axios.put<CustomerDTO>(url, payload)
        : await axios.post<CustomerDTO>(url, payload);
      if (isEdit) {
        setCustomers((prev) => prev.map((c) => (c.id === editId ? resp.data : c)));
        alert("Cliente atualizado!");
      } else {
        setCustomers((prev) => [...prev, resp.data]);
        alert("Cliente cadastrado!");
      }
      setForm(emptyForm);
      setBirthInput("");
      setEditId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  function startEdit(c: CustomerDTO) {
    if (c.id == null) { setError("Backend não retornou 'id'."); return; }
    setEditId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone, cpf: c.cpf, address: c.address, birthDate: c.birthDate });
    setBirthInput(toHTMLDate(c.birthDate));
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setBirthInput("");
  }

  async function remove(c: CustomerDTO) {
    if (c.id == null) { setError("Backend não retornou 'id'."); return; }
    setError(null);
    try {
      await axios.delete(`${API_BASE}/${c.id}`);
      setCustomers((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  const set = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="entity-page">
      <h1>Clientes</h1>

      <div className="entity-layout">
        <aside className="entity-sidebar">
          <form onSubmit={handleSubmit} className="entity-form">
            <input placeholder="Nome" value={form.name} onChange={set("name")} required />
            <input placeholder="Email" type="email" value={form.email} onChange={set("email")} required />
            <input placeholder="Telefone ex: (11) 91234-5678" value={form.phone} onChange={set("phone")} required />
            <input placeholder="CPF (11 dígitos)" value={form.cpf} onChange={set("cpf")} required maxLength={11} />
            <input placeholder="Endereço" value={form.address} onChange={set("address")} required />
            <label style={{ fontSize: "0.85em", opacity: 0.7, marginBottom: -4 }}>Data de nascimento</label>
            <input
              type="date"
              value={birthInput}
              onChange={(e) => setBirthInput(e.target.value)}
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
            {customers.map((c) => (
              <li key={c.id ?? c.cpf} className="entity-list-item">
                <strong>{c.name}</strong>
                <p className="entity-meta">CPF: {c.cpf}</p>
                <p className="entity-meta">{c.email}</p>
                <p className="entity-meta">{c.phone}</p>
                <p className="entity-meta">Endereço: {c.address}</p>
                <p className="entity-meta">Nascimento: {c.birthDate}</p>
                <div className="entity-item-actions">
                  <button type="button" onClick={() => startEdit(c)}>Editar</button>
                  <button type="button" onClick={() => remove(c)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
