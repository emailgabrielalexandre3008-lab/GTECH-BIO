import {
  ArrowUpRight,
  BatteryCharging,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Cpu,
  Instagram,
  LocateFixed,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BRANDS,
  EMPTY_QUOTE,
  GTECH_CONFIG,
  ISSUES,
  SERVICES,
  buildWhatsAppMessage,
  whatsappWithMessage,
  type QuoteForm,
} from "@/lib/gtech-config";

function IconForService({ icon }: { icon: string }) {
  if (icon === "battery") return <BatteryCharging size={18} />;
  if (icon === "bolt") return <Zap size={18} />;
  if (icon === "chip") return <Cpu size={18} />;
  return <Smartphone size={18} />;
}

function BrandMark() {
  return <img className="bio-mark" src={GTECH_CONFIG.logoUrl} alt="Logo G-Tech" />;
}

function QuickLink({ icon, label, href, external = false, onClick }: { icon: React.ReactNode; label: string; href: string; external?: boolean; onClick?: () => void }) {
  return <a className="bio-link" href={href} onClick={onClick} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}><span className="bio-link__icon">{icon}</span><span>{label}</span><ArrowUpRight className="bio-link__arrow" size={16} /></a>;
}

function QuoteWizard({ onDone }: { onDone: (form: QuoteForm) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuoteForm>(EMPTY_QUOTE);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const update = <K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const canAdvance = useMemo(() => {
    if (step === 1) return form.name.trim().length > 1;
    if (step === 2) return Boolean(form.brand && form.model.trim());
    if (step === 3) return Boolean(form.issue);
    return form.serviceMode === "store" || form.address.trim().length > 4;
  }, [form, step]);

  return <div className="quote-sheet__content">
    <div className="quote-sheet__progress"><span style={{ width: `${step * 25}%` }} /></div>
    <div className="quote-sheet__head"><div><small>ORÇAMENTO · ETAPA {step} DE 4</small><h2>{step === 1 ? "Como podemos chamar você?" : step === 2 ? "Qual aparelho precisa de cuidado?" : step === 3 ? "O que aconteceu com ele?" : "Como você prefere ser atendido?"}</h2></div><span>0{step}</span></div>
    <div className="quote-sheet__body">
      {step === 1 && <label className="bio-field">Seu nome<input autoFocus value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Digite seu nome" /><small><ShieldCheck size={13} /> Usaremos apenas para o atendimento.</small></label>}
      {step === 2 && <div className="bio-form-stack"><label className="bio-field">Marca<div className="brand-options">{BRANDS.map((brand) => <button className={form.brand === brand ? "selected" : ""} type="button" key={brand} onClick={() => update("brand", brand)}>{brand}</button>)}</div></label><label className="bio-field">Modelo<input value={form.model} onChange={(event) => update("model", event.target.value)} placeholder="Ex.: iPhone 13, Galaxy S23..." /></label></div>}
      {step === 3 && <div className="bio-form-stack"><label className="bio-field">Defeito<div className="issue-options">{ISSUES.map((issue) => <button className={form.issue === issue ? "selected" : ""} type="button" key={issue} onClick={() => update("issue", issue)}>{issue}<ChevronRight size={14} /></button>)}</div></label><label className="bio-field">Detalhes <em>opcional</em><textarea value={form.details} onChange={(event) => update("details", event.target.value)} placeholder="Quer explicar um pouco mais?" rows={3} /></label></div>}
      {step === 4 && <div className="bio-form-stack"><label className="bio-field">Atendimento<div className="mode-options"><button className={form.serviceMode === "store" ? "selected" : ""} type="button" onClick={() => update("serviceMode", "store")}><MapPin size={17} /><strong>Vou até a loja</strong><small>Receba a rota da G-Tech</small></button><button className={form.serviceMode === "courier" ? "selected" : ""} type="button" onClick={() => update("serviceMode", "courier")}><Send size={17} /><strong>Solicitar motoboy</strong><small>Valor confirmado pela equipe</small></button></div></label>{form.serviceMode === "courier" && <div className="courier-box"><button className="location-link" type="button" onClick={() => setLocationAllowed(true)}><LocateFixed size={15} /> {locationAllowed ? "Localização autorizada" : "Permitir localização"}</button><label className="bio-field">Endereço de retirada<input value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Rua, número e bairro" /></label><div className="bio-form-row"><label className="bio-field">Complemento<input value={form.complement} onChange={(event) => update("complement", event.target.value)} placeholder="Opcional" /></label><label className="bio-field">Referência<input value={form.reference} onChange={(event) => update("reference", event.target.value)} placeholder="Opcional" /></label></div></div>}<label className="bio-field">Intenção<div className="intent-options"><button className={form.intent === "urgency" ? "selected" : ""} type="button" onClick={() => update("intent", "urgency")}><Zap size={16} /><span>Estou com urgência</span></button><button className={form.intent === "quote" ? "selected" : ""} type="button" onClick={() => update("intent", "quote")}><Quote size={16} /><span>Quero um orçamento</span></button></div></label></div>}
    </div>
    <div className="quote-sheet__footer"><button className="sheet-back" type="button" onClick={() => setStep((value) => value - 1)} disabled={step === 1}><ChevronLeft size={16} /> Voltar</button>{step < 4 ? <Button className="sheet-next" disabled={!canAdvance} onClick={() => setStep((value) => value + 1)}>Continuar <ChevronRight size={16} /></Button> : <Button className="sheet-next" disabled={!canAdvance} onClick={() => onDone(form)}>Enviar no WhatsApp <ArrowUpRight size={16} /></Button>}</div>
  </div>;
}

function QuoteSheet({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return <div className="sheet-backdrop" role="dialog" aria-modal="true" aria-labelledby="quote-title"><div className="quote-sheet"><button className="sheet-close" type="button" onClick={onClose} aria-label="Fechar orçamento"><X size={19} /></button>{sent ? <div className="sheet-success"><div className="sheet-success__icon"><MessageCircle size={24} /></div><small>ORÇAMENTO PREPARADO</small><h2>Quase tudo pronto.</h2><p>O WhatsApp foi aberto com os detalhes do seu aparelho. O valor definitivo será confirmado após avaliação técnica.</p><a className="sheet-next" href={GTECH_CONFIG.whatsappUrl} target="_blank" rel="noreferrer">Abrir WhatsApp <ArrowUpRight size={16} /></a><button className="sheet-back" type="button" onClick={onClose}>Fechar</button></div> : <><h1 id="quote-title" className="sr-only">Simular orçamento</h1><QuoteWizard onDone={(form) => { window.open(whatsappWithMessage(buildWhatsAppMessage(form)), "_blank", "noopener,noreferrer"); setSent(true); }} /></>}</div></div>;
}

function BioContent() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [showAssist, setShowAssist] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("gtech-inactivity-seen");
    if (alreadySeen) return;
    const timer = window.setTimeout(() => setShowAssist(true), 60_000);
    return () => window.clearTimeout(timer);
  }, []);

  const closeAssist = () => { sessionStorage.setItem("gtech-inactivity-seen", "1"); setShowAssist(false); };
  const openQuote = () => { closeAssist(); setQuoteOpen(true); };

  return <div className="bio-page"><main className="bio-wrap" id="top">
    <div className="bio-topline"><span>G-TECH / ASSISTÊNCIA TÉCNICA</span><span>SP · 2025</span></div>
    <section className="bio-profile"><BrandMark /><div className="bio-profile__copy"><h1>G-Tech Assistência Técnica</h1><p>Seu aparelho merece cuidado especializado.</p><div className="bio-location"><MapPin size={13} /> São Paulo · bairro a confirmar</div></div><button className="profile-menu" type="button" aria-label="Mais opções"><span /><span /><span /></button></section>
    <button className="budget-cta" type="button" onClick={() => setQuoteOpen(true)}><span className="budget-cta__icon"><Wrench size={19} /></span><span><strong>Fazer orçamento</strong><small>Envie os detalhes do seu aparelho</small></span><ArrowUpRight size={19} /></button>
    <div className="bio-mini-actions"><a href={GTECH_CONFIG.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /><span>WhatsApp</span></a><a href={`tel:+${GTECH_CONFIG.whatsapp}`}><Phone size={17} /><span>Ligar</span></a><a href={GTECH_CONFIG.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17} /><span>Como chegar</span></a></div>
    <section className="bio-links" aria-label="Opções G-Tech"><QuickLink icon={<Smartphone size={18} />} label="Serviços de assistência técnica" href="#servicos" onClick={() => document.getElementById("servicos")?.setAttribute("open", "true")} /><QuickLink icon={<ShieldCheck size={18} />} label="Garantia e como funciona" href="#confia" onClick={() => document.getElementById("confia")?.setAttribute("open", "true")} /><QuickLink icon={<Instagram size={18} />} label="Acompanhar no Instagram" href={GTECH_CONFIG.instagramUrl} external /><QuickLink icon={<MessageCircle size={18} />} label="Falar com a equipe" href={GTECH_CONFIG.whatsappUrl} external /></section>
    <details className="bio-details" id="servicos"><summary><span><Wrench size={17} /> Serviços</span><ChevronDown size={17} /></summary><div className="bio-details__body">{SERVICES.map((service) => <div className="compact-service" key={service.code}><span className="compact-service__icon"><IconForService icon={service.icon} /></span><span><strong>{service.title}</strong><small>{service.body}</small></span><a href="#orcamento" onClick={() => setQuoteOpen(true)} aria-label={`Orçar ${service.title}`}><ArrowUpRight size={15} /></a></div>)}</div></details>
    <details className="bio-details" id="confia"><summary><span><ShieldCheck size={17} /> Confiança & informações</span><ChevronDown size={17} /></summary><div className="bio-details__body bio-info"><p>Orçamentos digitais são preliminares. O valor definitivo e a disponibilidade da peça são confirmados pela equipe após avaliação técnica.</p><div><CheckLine text="Atendimento direto pelo WhatsApp" /><CheckLine text="Disponibilidade confirmada antes da promessa" /><CheckLine text="Termos e garantia documentados" /></div></div></details>
    <details className="bio-details"><summary><span><Sparkles size={17} /> Mais da G-Tech</span><ChevronDown size={17} /></summary><div className="bio-details__body bio-more"><a href={GTECH_CONFIG.catalogUrl || "#"} onClick={(event) => { if (!GTECH_CONFIG.catalogUrl) event.preventDefault(); }}><span>Produtos e acessórios</span><small>{GTECH_CONFIG.catalogUrl ? "Abrir catálogo" : "Link em configuração"}</small><ArrowUpRight size={15} /></a><a href={GTECH_CONFIG.vipGroupUrl || "#"} onClick={(event) => { if (!GTECH_CONFIG.vipGroupUrl) event.preventDefault(); }}><span>Grupo VIP de ofertas</span><small>{GTECH_CONFIG.vipGroupUrl ? "Entrar no grupo" : "Link em configuração"}</small><ArrowUpRight size={15} /></a><a href={GTECH_CONFIG.youtubeUrl || "#"} onClick={(event) => { if (!GTECH_CONFIG.youtubeUrl) event.preventDefault(); }}><span>Vídeos e dicas</span><small>{GTECH_CONFIG.youtubeUrl ? "Assistir no YouTube" : "Canal em configuração"}</small><ArrowUpRight size={15} /></a></div></details>
    <div className="bio-promo"><img src={GTECH_CONFIG.campaignImageUrl} alt="Campanha G-Tech e Shopee" /><div><small>NA LOJA</small><strong>Recebemos seus pacotes.</strong><span>Confira os detalhes pelo WhatsApp.</span></div><ArrowUpRight size={17} /></div>
    <footer className="bio-footer"><p>© 2025 G-Tech · CNPJ {GTECH_CONFIG.cnpj}</p><p><a href="#privacidade">Privacidade</a> · <a href="#termos">Termos</a> · <a href="#garantia">Garantia</a></p></footer>
  </main>{quoteOpen && <QuoteSheet onClose={() => setQuoteOpen(false)} />}{showAssist && <div className="assist-toast"><button type="button" onClick={closeAssist} aria-label="Fechar"><X size={15} /></button><Sparkles size={17} /><div><strong>Precisa de ajuda?</strong><span>Faça um orçamento rápido.</span></div><button type="button" onClick={openQuote}>Orçar <ArrowUpRight size={14} /></button></div>}</div>;
}

function CheckLine({ text }: { text: string }) { return <p><ShieldCheck size={14} /> {text}</p>; }

export default function Home() { return <BioContent />; }
