import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, LogOut, Pencil, Plus, ShieldCheck, Star, Trash2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

type AdminSessionState = {
  checked: boolean;
  authenticated: boolean;
  email: string;
};

type LoginResponse = {
  authenticated?: boolean;
  email?: string;
  error?: string;
};

const emptyForm = { customerName: "", rating: 5, comment: "", reviewDate: "", source: "Google", published: false };

async function readJson<T>(response: Response) {
  return (await response.json().catch(() => ({}))) as T;
}

export default function Admin() {
  const [session, setSession] = useState<AdminSessionState>({ checked: false, authenticated: false, email: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/session", { credentials: "include" })
      .then((response) => readJson<{ authenticated: boolean; email?: string }>(response))
      .then((data) => {
        if (active) setSession({ checked: true, authenticated: Boolean(data.authenticated), email: data.email ?? "" });
      })
      .catch(() => {
        if (active) setSession({ checked: true, authenticated: false, email: "" });
      });
    return () => { active = false; };
  }, []);

  const feedbackQuery = trpc.feedback.adminList.useQuery(undefined, { enabled: session.authenticated });
  const createMutation = trpc.feedback.create.useMutation({ onSuccess: () => { feedbackQuery.refetch(); resetForm(); } });
  const updateMutation = trpc.feedback.update.useMutation({ onSuccess: () => { feedbackQuery.refetch(); resetForm(); } });
  const removeMutation = trpc.feedback.remove.useMutation({ onSuccess: () => feedbackQuery.refetch() });

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginPending(true);
    setLoginError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginForm),
      });
      const data = await readJson<LoginResponse>(response);
      if (!response.ok || !data.authenticated) {
        setLoginError(data.error ?? "Não foi possível entrar.");
        return;
      }
      setSession({ checked: true, authenticated: true, email: data.email ?? loginForm.email.trim().toLowerCase() });
      setLoginForm({ email: loginForm.email, password: "" });
    } catch {
      setLoginError("Não foi possível conectar ao painel. Tente novamente.");
    } finally {
      setLoginPending(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" }).catch(() => undefined);
    setSession({ checked: true, authenticated: false, email: "" });
    resetForm();
  }

  const canSave = form.customerName.trim().length > 1 && form.comment.trim().length > 2;
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const average = useMemo(() => {
    const list = feedbackQuery.data ?? [];
    return list.length ? (list.reduce((sum, item) => sum + item.rating, 0) / list.length).toFixed(1) : "—";
  }, [feedbackQuery.data]);

  if (!session.checked) return <div className="admin-state">Verificando acesso seguro...</div>;

  if (!session.authenticated) return <main className="admin-login-page"><form className="admin-login-card" onSubmit={handleLogin}><ShieldCheck size={30} /><span className="admin-eyebrow">G-TECH / ÁREA RESTRITA</span><h1>Painel administrativo</h1><p>Entre com o e-mail e a senha administrativa para gerenciar os feedbacks reais da G-Tech.</p><label>E-mail<input type="email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} placeholder="seu@email.com" autoComplete="username" required /></label><label>Senha<input type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} placeholder="Sua senha" autoComplete="current-password" required /></label>{loginError && <div className="admin-form-error" role="alert">{loginError}</div>}<button className="admin-button admin-button--primary" type="submit" disabled={loginPending}>{loginPending ? "Entrando..." : "Entrar no painel"}</button><a className="admin-button admin-button--secondary" href="/">Voltar ao Link na Bio</a></form></main>;

  return <main className="admin-page"><header className="admin-header"><div><span className="admin-eyebrow">G-TECH / PAINEL ADMINISTRATIVO</span><h1>Feedback & avaliações</h1><p>Cadastre apenas avaliações reais e publique somente as aprovadas pela equipe.</p><small className="admin-session-label">Sessão ativa: {session.email}</small></div><div className="admin-header__actions"><a className="admin-button admin-button--secondary" href="/"><ArrowLeft size={15} /> Link na Bio</a><button className="admin-button admin-button--secondary" onClick={handleLogout}><LogOut size={15} /> Sair</button></div></header><section className="admin-grid"><div className="admin-card admin-card--form"><div className="admin-card__head"><div><span className="admin-eyebrow">{editingId ? "EDITAR REGISTRO" : "NOVO REGISTRO"}</span><h2>{editingId ? "Atualizar avaliação" : "Cadastrar avaliação"}</h2></div>{editingId && <button className="admin-icon-button" onClick={resetForm} aria-label="Cancelar edição"><X size={17} /></button>}</div><label>Nome do cliente<input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Nome real do cliente" /></label><label>Nota<div className="admin-rating-input">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} className={value <= form.rating ? "is-active" : ""} onClick={() => setForm({ ...form, rating: value })} aria-label={`${value} estrelas`}><Star size={22} fill="currentColor" /></button>)}</div></label><label>Comentário<textarea value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} placeholder="Cole o comentário real recebido" rows={5} /></label><div className="admin-form-row"><label>Data<input value={form.reviewDate} onChange={(event) => setForm({ ...form, reviewDate: event.target.value })} placeholder="Ex.: 02/11/2026" /></label><label>Fonte<input value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} placeholder="Google" /></label></div><label className="admin-check"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Publicar no Link na Bio</label><button className="admin-button admin-button--primary" disabled={!canSave || isSaving} onClick={() => { if (editingId) updateMutation.mutate({ id: editingId, ...form }); else createMutation.mutate(form); }}>{editingId ? <Check size={16} /> : <Plus size={16} />}{isSaving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar avaliação"}</button></div><div className="admin-card"><div className="admin-card__head"><div><span className="admin-eyebrow">VISÃO GERAL</span><h2>Registros reais</h2></div><div className="admin-stat"><strong>{average}</strong><span>{feedbackQuery.data?.length ?? 0} registros</span></div></div>{feedbackQuery.isLoading ? <p className="admin-muted">Carregando avaliações...</p> : feedbackQuery.data?.length ? <div className="admin-review-list">{feedbackQuery.data.map((item) => <article className="admin-review" key={item.id}><div className="admin-review__top"><strong>{item.customerName}</strong><span className={item.published ? "status status--live" : "status"}>{item.published ? "Publicado" : "Rascunho"}</span></div><div className="admin-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < item.rating ? "currentColor" : "none"} />)}</div><p>{item.comment}</p><small>{item.source}{item.reviewDate ? ` · ${item.reviewDate}` : ""}</small><div className="admin-review__actions"><button onClick={() => { setEditingId(item.id); setForm({ customerName: item.customerName, rating: item.rating, comment: item.comment, reviewDate: item.reviewDate ?? "", source: item.source, published: item.published === 1 }); }}><Pencil size={14} /> Editar</button><button className="danger" onClick={() => { if (window.confirm("Remover esta avaliação?")) removeMutation.mutate({ id: item.id }); }}><Trash2 size={14} /> Remover</button></div></article>)}</div> : <div className="admin-empty"><Star size={24} /><h3>Nenhuma avaliação cadastrada</h3><p>Adicione avaliações reais recebidas pela G-Tech. Nada será inventado automaticamente.</p></div>}</div></section></main>;
}
