import {
  ArrowDown,
  ArrowUpRight,
  BatteryCharging,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Cpu,
  Instagram,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircle,
  MousePointer2,
  Phone,
  Play,
  Plus,
  Quote,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Upload,
  Volume2,
  VolumeX,
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

const navigation = [
  { label: "Serviços", href: "#servicos" },
  { label: "Orçamento", href: "#orcamento" },
  { label: "Confiança", href: "#confia" },
];

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function IconForService({ icon }: { icon: string }) {
  if (icon === "battery") return <BatteryCharging size={22} strokeWidth={1.6} />;
  if (icon === "bolt") return <Zap size={22} strokeWidth={1.6} />;
  if (icon === "chip") return <Cpu size={22} strokeWidth={1.6} />;
  return <Smartphone size={22} strokeWidth={1.6} />;
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <a className={`brand-lockup ${small ? "brand-lockup--small" : ""}`} href="#top" aria-label="Voltar ao início da G-Tech">
      <img src={GTECH_CONFIG.logoUrl} alt="Selo G-Tech" />
      <span>
        <strong>G-TECH</strong>
        <em>ASSISTÊNCIA TÉCNICA</em>
      </span>
    </a>
  );
}

function Entrance({ onEnter }: { onEnter: (withAudio: boolean) => void }) {
  const [audioChoice, setAudioChoice] = useState(false);

  return (
    <div className="entrance" role="dialog" aria-modal="true" aria-labelledby="entrance-title">
      <div className="entrance__grid" aria-hidden="true" />
      <div className="entrance__rail entrance__rail--top" />
      <div className="entrance__rail entrance__rail--bottom" />
      <div className="entrance__content">
        <div className="entrance__signal"><span /> G-TECH / EST. 2025</div>
        <img className="entrance__logo" src={GTECH_CONFIG.logoUrl} alt="Logo G-Tech" />
        <p className="eyebrow">TECNOLOGIA COM PRECISÃO</p>
        <h1 id="entrance-title">Seu aparelho.<br /><span>Nosso cuidado.</span></h1>
        <p className="entrance__copy">Entre para conhecer uma assistência técnica mais direta, segura e preparada para o seu próximo reparo.</p>
        <div className="entrance__actions">
          <Button className="button button--primary button--wide" onClick={() => onEnter(audioChoice)}>
            Entrar na G-Tech <ArrowUpRight size={18} />
          </Button>
          <button className={`sound-choice ${audioChoice ? "is-active" : ""}`} type="button" onClick={() => setAudioChoice((value) => !value)} aria-pressed={audioChoice}>
            {audioChoice ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {audioChoice ? "Música ativada" : "Entrar sem música"}
          </button>
        </div>
        <p className="entrance__fineprint">A música só será iniciada após sua autorização e interação.</p>
      </div>
      <div className="entrance__meta entrance__meta--left">SP / 01</div>
      <div className="entrance__meta entrance__meta--right">PRECISION / CARE</div>
    </div>
  );
}

function Header({ onQuote }: { onQuote: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo small />
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
          ))}
          <button className="nav-cta" type="button" onClick={() => { setOpen(false); onQuote(); }}>
            Simular agora <ArrowUpRight size={15} />
          </button>
        </nav>
        <button className="menu-button" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

function Hero({ onQuote }: { onQuote: () => void }) {
  return (
    <section className="hero section-pad" id="top">
      <div className="hero__orb hero__orb--one" aria-hidden="true" />
      <div className="hero__orb hero__orb--two" aria-hidden="true" />
      <div className="container hero__layout">
        <div className="hero__copy">
          <div className="section-kicker"><span className="kicker-line" /> ASSISTÊNCIA TÉCNICA / SÃO PAULO</div>
          <h1>Seu celular<br /><span>não precisa</span><br />esperar.</h1>
          <p className="hero__lead">Diagnóstico direto, reparo especializado e uma equipe que fala a sua língua. Na G-Tech, tecnologia, confiança e precisão caminham juntas.</p>
          <div className="hero__actions">
            <Button className="button button--primary" onClick={onQuote}>Começar orçamento <ArrowUpRight size={18} /></Button>
            <a className="button button--ghost" href={GTECH_CONFIG.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar no WhatsApp</a>
          </div>
          <div className="hero__proof">
            <div className="proof-avatars"><span>G</span><span>T</span><span>+</span></div>
            <div><strong>Atendimento humano</strong><small>e confirmação antes de prometer</small></div>
          </div>
        </div>
        <div className="hero__visual" aria-label="Selo da G-Tech e sinais de atendimento técnico">
          <div className="hero__visual-top"><span>01</span><span>PRECISION LAB</span></div>
          <div className="hero__mark-stage">
            <div className="stage-ring stage-ring--outer" />
            <div className="stage-ring stage-ring--inner" />
            <div className="stage-crosshair stage-crosshair--x" />
            <div className="stage-crosshair stage-crosshair--y" />
            <img src={GTECH_CONFIG.logoUrl} alt="Selo circular G-Tech" />
            <span className="stage-dot stage-dot--one" />
            <span className="stage-dot stage-dot--two" />
          </div>
          <div className="hero__visual-bottom"><span>G-TECH / 2025</span><span><MousePointer2 size={13} /> MOVE WITH CARE</span></div>
        </div>
      </div>
      <div className="container hero__scroll"><ArrowDown size={15} /> Role para descobrir <span /></div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Diferenciais G-Tech">
      <div className="container trust-strip__grid">
        <div><span className="strip-index">01</span><ShieldCheck size={19} /><strong>Transparência primeiro</strong></div>
        <div><span className="strip-index">02</span><Wrench size={19} /><strong>Diagnóstico antes do reparo</strong></div>
        <div><span className="strip-index">03</span><Clock3 size={19} /><strong>Resposta sem enrolação</strong></div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section-pad services-section" id="servicos">
      <div className="container">
        <div className="section-heading section-heading--split">
          <div><div className="section-kicker"><span className="kicker-line" /> O QUE A GENTE RESOLVE</div><h2>Precisão para<br /><span>cada sintoma.</span></h2></div>
          <p>Do display ao software, cada aparelho pede uma leitura diferente. A G-Tech começa entendendo o problema — e só então indica o próximo passo.</p>
        </div>
        <div className="service-grid">
          {SERVICES.map((service) => (
            <article className="service-card" key={service.code}>
              <div className="service-card__scan" />
              <div className="service-card__top"><span>{service.code}</span><div className="service-icon"><IconForService icon={service.icon} /></div></div>
              <p className="service-card__eyebrow">{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <a href="#orcamento" aria-label={`Orçar ${service.title}`}><ArrowUpRight size={17} /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteWizard({ onComplete }: { onComplete: (form: QuoteForm) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuoteForm>(EMPTY_QUOTE);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [showManualResult, setShowManualResult] = useState(false);

  const update = <K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const progress = `${(step / 4) * 100}%`;
  const canAdvance = useMemo(() => {
    if (step === 1) return form.name.trim().length > 1;
    if (step === 2) return Boolean(form.brand && form.model.trim());
    if (step === 3) return Boolean(form.issue);
    return form.serviceMode === "store" || form.address.trim().length > 4;
  }, [form, step]);

  const next = () => setStep((value) => Math.min(4, value + 1));
  const previous = () => setStep((value) => Math.max(1, value - 1));

  return (
    <div className="quote-module">
      <div className="quote-module__header">
        <div><span className="module-label">SIMULADOR G-TECH / 04 ETAPAS</span><h3>{step === 4 ? "Como você quer seguir?" : step === 1 ? "Vamos começar pelo seu nome." : step === 2 ? "Qual aparelho precisa de cuidado?" : "Conte o que está acontecendo."}</h3></div>
        <span className="step-count">0{step}<small>/04</small></span>
      </div>
      <div className="progress-line"><span style={{ width: progress }} /></div>
      <div className="quote-module__body">
        {step === 1 && <div className="form-stack"><label>Seu nome<input autoFocus value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Como podemos chamar você?" /></label><p className="field-note"><ShieldCheck size={14} /> Seus dados serão usados apenas para o atendimento.</p></div>}
        {step === 2 && <div className="form-stack"><label>Marca<div className="choice-grid">{BRANDS.map((brand) => <button className={`choice-chip ${form.brand === brand ? "is-selected" : ""}`} type="button" key={brand} onClick={() => update("brand", brand)}>{brand}{form.brand === brand && <Check size={14} />}</button>)}</div></label><label>Modelo<input value={form.model} onChange={(event) => update("model", event.target.value)} placeholder="Ex.: iPhone 13, Galaxy S23..." /></label></div>}
        {step === 3 && <div className="form-stack"><label>Principal problema<div className="issue-list">{ISSUES.map((issue) => <button className={`issue-row ${form.issue === issue ? "is-selected" : ""}`} type="button" key={issue} onClick={() => update("issue", issue)}><span>{issue}</span>{form.issue === issue ? <Check size={15} /> : <ChevronRight size={15} />}</button>)}</div></label><label>Quer adicionar algo? <span className="optional">opcional</span><textarea value={form.details} onChange={(event) => update("details", event.target.value)} placeholder="Conte um pouco mais, se quiser..." rows={3} /></label></div>}
        {step === 4 && <div className="form-stack"><label>Modalidade de atendimento<div className="mode-grid"><button className={`mode-card ${form.serviceMode === "store" ? "is-selected" : ""}`} type="button" onClick={() => update("serviceMode", "store")}><MapPin size={19} /><strong>Vou até a loja</strong><small>Endereço e rota no próximo passo</small></button><button className={`mode-card ${form.serviceMode === "courier" ? "is-selected" : ""}`} type="button" onClick={() => update("serviceMode", "courier")}><Send size={19} /><strong>Solicitar motoboy</strong><small>Valor é confirmado pela equipe</small></button></div></label>{form.serviceMode === "courier" && <div className="courier-fields"><button className="location-button" type="button" onClick={() => setLocationAllowed(true)}><LocateFixed size={16} /> {locationAllowed ? "Localização autorizada" : "Permitir localização do dispositivo"}</button><label>Endereço de retirada<input value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Rua, número e bairro" /></label><div className="field-row"><label>Complemento<input value={form.complement} onChange={(event) => update("complement", event.target.value)} placeholder="Apto, sala..." /></label><label>Referência<input value={form.reference} onChange={(event) => update("reference", event.target.value)} placeholder="Perto de..." /></label></div></div>}<label>Qual é a sua intenção?<div className="intent-grid"><button className={`intent-card ${form.intent === "urgency" ? "is-selected" : ""}`} type="button" onClick={() => update("intent", "urgency")}><Zap size={18} /><strong>Estou com urgência</strong><small>Quero confirmar disponibilidade</small></button><button className={`intent-card ${form.intent === "quote" ? "is-selected" : ""}`} type="button" onClick={() => update("intent", "quote")}><Quote size={18} /><strong>Quero um orçamento</strong><small>Estou pesquisando valores</small></button></div></label></div>}
        {showManualResult && <div className="manual-result"><div className="manual-result__icon"><CircleAlert size={19} /></div><div><strong>Pronto para falar com a equipe.</strong><p>O WhatsApp será aberto com os dados preenchidos. O valor definitivo depende de avaliação técnica.</p></div></div>}
      </div>
      <div className="quote-module__footer"><button className="back-button" type="button" onClick={previous} disabled={step === 1}><ChevronLeft size={17} /> Voltar</button>{step < 4 ? <Button className="button button--primary" disabled={!canAdvance} onClick={next}>Continuar <ChevronRight size={17} /></Button> : <Button className="button button--primary" disabled={!canAdvance} onClick={() => { setShowManualResult(true); onComplete(form); }}>Enviar para o WhatsApp <ArrowUpRight size={17} /></Button>}</div>
    </div>
  );
}

function QuoteSection() {
  const [completed, setCompleted] = useState(false);
  return (
    <section className="section-pad quote-section" id="orcamento">
      <div className="container quote-section__layout">
        <div className="quote-intro"><div className="section-kicker"><span className="kicker-line" /> ORÇAMENTO SEM COMPLICAÇÃO</div><h2>Seu próximo passo<br /><span>começa aqui.</span></h2><p>Preencha em menos de dois minutos. A gente recebe os detalhes, confere o cenário e retorna pelo canal mais rápido.</p><div className="quote-intro__notes"><div><span>01</span><strong>Escolha o aparelho</strong><small>Marca, modelo e sintoma</small></div><div><span>02</span><strong>Defina o atendimento</strong><small>Loja ou retirada</small></div><div><span>03</span><strong>Fale com a equipe</strong><small>Estimativa preliminar</small></div></div></div>
        {completed ? <div className="quote-success"><div className="success-mark"><Check size={30} /></div><span className="module-label">SOLICITAÇÃO PREPARADA</span><h3>Seu atendimento está a um toque.</h3><p>O WhatsApp deve abrir com as informações preenchidas. Se não abrir, use o botão abaixo para falar diretamente com a G-Tech.</p><a className="button button--primary" href={GTECH_CONFIG.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Abrir WhatsApp</a><button className="text-button" type="button" onClick={() => setCompleted(false)}>Fazer outro orçamento</button></div> : <QuoteWizard onComplete={(form) => { const message = buildWhatsAppMessage(form); window.open(whatsappWithMessage(message), "_blank", "noopener,noreferrer"); setCompleted(true); }} />}
      </div>
    </section>
  );
}

function CampaignCard() {
  return <article className="campaign-card"><img src={GTECH_CONFIG.campaignImageUrl} alt="Arte promocional da parceria G-Tech com a Shopee" /><div className="campaign-card__overlay"><span className="module-label">CAMPANHA / PONTO DE APOIO</span><h3>Recebemos seus pacotes.</h3><p>Uma parceria divulgada pela G-Tech para quem trabalha com e-commerce e precisa de praticidade nos envios.</p><span className="campaign-card__link">Ver detalhes na loja <ArrowUpRight size={16} /></span></div></article>;
}

function ConfidenceSection() {
  return <section className="section-pad confidence-section" id="confia"><div className="container"><div className="section-heading"><div className="section-kicker"><span className="kicker-line" /> POR QUE G-TECH</div><h2>Reparo bom é reparo<br /><span>sem surpresa.</span></h2></div><div className="confidence-grid"><div className="confidence-copy"><p className="large-copy">Você não precisa entender de placa, display ou ciclo de bateria. Precisa de alguém que explique com clareza o que seu aparelho tem — e o que realmente faz sentido fazer.</p><div className="confidence-list"><div><Check size={16} /><span>Orçamento digital é sempre preliminar.</span></div><div><Check size={16} /><span>Disponibilidade é confirmada pela equipe.</span></div><div><Check size={16} /><span>Garantia e condições ficam documentadas.</span></div></div><a className="inline-link" href={GTECH_CONFIG.instagramUrl} target="_blank" rel="noreferrer">Acompanhe a G-Tech no Instagram <ArrowUpRight size={15} /></a></div><CampaignCard /></div></div></section>;
}

function StoreFooter() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><Logo /><div className="footer-actions"><a className="footer-action" href={GTECH_CONFIG.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a><a className="footer-action" href={GTECH_CONFIG.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17} /> Como chegar</a><a className="footer-action" href={`tel:+${GTECH_CONFIG.whatsapp}`}><Phone size={17} /> Ligar agora</a></div></div><div className="footer-location"><div><span className="module-label">ONDE ESTAMOS</span><p>{GTECH_CONFIG.address}</p><small>{GTECH_CONFIG.addressNote}</small></div><div><span className="module-label">CONTATO</span><p>(11) 97050-8034</p><small>Atendimento via WhatsApp</small></div><div><span className="module-label">CANAIS</span><p><a href={GTECH_CONFIG.instagramUrl} target="_blank" rel="noreferrer">Instagram</a><span> · </span><span className="pending-link">YouTube em breve</span></p><small>Links pendentes de cadastro</small></div></div><div className="footer-bottom"><span>© 2025 G-Tech Assistência Técnica · CNPJ {GTECH_CONFIG.cnpj}</span><div><a href="#privacidade">Privacidade</a><a href="#termos">Termos de uso</a><a href="#garantia">Garantia</a></div></div></div></footer>;
}

function InactivityCard({ onQuote, onClose }: { onQuote: () => void; onClose: () => void }) {
  return <div className="inactivity-card" role="dialog" aria-modal="true" aria-labelledby="inactivity-title"><button className="inactivity-card__close" type="button" onClick={onClose} aria-label="Fechar"><X size={17} /></button><div className="inactivity-card__signal"><Sparkles size={17} /> UMA AJUDA RÁPIDA</div><h2 id="inactivity-title">Está precisando de ajuda<br />com seu <span>celular?</span></h2><p>Quer realizar um orçamento com a G-Tech?</p><div className="inactivity-card__actions"><Button className="button button--primary" onClick={onQuote}>Sim, quero orçamento <ArrowUpRight size={16} /></Button><button className="text-button" type="button" onClick={onClose}>Agora não</button></div></div>;
}

function AppSections({ onQuote }: { onQuote: () => void }) {
  return <><Hero onQuote={onQuote} /><TrustStrip /><Services /><QuoteSection /><ConfidenceSection /><section className="next-section"><div className="container"><div className="next-section__badge"><Upload size={16} /> PRÓXIMOS MÓDULOS EM CONFIGURAÇÃO</div><h2>A experiência continua<br /><span>depois do primeiro contato.</span></h2><div className="next-section__rail"><div><Star size={16} /><strong>Avaliações reais</strong><small>Cadastro no painel</small></div><div><Play size={16} /><strong>Vídeos & dicas</strong><small>Canal pendente</small></div><div><Plus size={16} /><strong>Grupo VIP</strong><small>Link pendente</small></div></div></div></section><StoreFooter /></>;
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [showInactivity, setShowInactivity] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("gtech-inactivity-seen");
    if (hasSeen) return;
    const timer = window.setTimeout(() => setShowInactivity(true), 60_000);
    return () => window.clearTimeout(timer);
  }, []);

  const enter = (withAudio: boolean) => {
    setAudioEnabled(withAudio);
    setEntered(true);
  };

  const openQuote = () => {
    setShowInactivity(false);
    scrollToId("#orcamento");
  };

  const closeInactivity = () => {
    sessionStorage.setItem("gtech-inactivity-seen", "1");
    setShowInactivity(false);
  };

  if (!entered) return <Entrance onEnter={enter} />;

  return <div className={`site-shell ${audioEnabled ? "audio-intent" : ""}`}><Header onQuote={openQuote} /><main><AppSections onQuote={openQuote} /></main>{showInactivity && <InactivityCard onQuote={openQuote} onClose={closeInactivity} />}<div className="audio-status" aria-live="polite">{audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />} {audioEnabled ? "Áudio autorizado — fonte direta pendente" : "Navegação silenciosa"}</div></div>;
}
