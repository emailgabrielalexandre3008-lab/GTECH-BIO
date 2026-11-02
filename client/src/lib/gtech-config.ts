export const GTECH_CONFIG = {
  brand: "G-Tech Assistência Técnica",
  cnpj: "63.233.026/0001-08",
  address: "Rua Dr. Alarico Silveira, 86 · São Paulo — SP",
  addressNote: "Bairro a confirmar pela equipe",
  whatsapp: "5511970508034",
  whatsappUrl: "https://wa.me/5511970508034",
  instagramUrl:
    "https://www.instagram.com/assistencia_gtechs?cplk=Y2I4NzFreWhueGg5&utm_source=qr",
  mapsUrl: "https://share.google/fgnzdYrlD7kCyIdkC",
  logoUrl: "/gtech-mark.png",
  campaignImageUrl:
    "/manus-storage/015A38C8-22AC-4870-873C-5462D0B8BEAC_6b5ad1a8.jpg",
  directAudioUrl: "",
  youtubeUrl: "",
  catalogUrl: "",
  vipGroupUrl: "",
} as const;

export const BRANDS = ["Apple", "Samsung", "Motorola", "Xiaomi", "Asus", "Outra"] as const;

export const ISSUES = [
  "Tela quebrada",
  "Tela sem imagem",
  "Tela com manchas",
  "Bateria descarregando",
  "Celular não carrega",
  "Conector de carga",
  "Problema de software",
  "Celular não liga",
  "Problema de placa",
  "Oxidação",
  "Outro defeito",
] as const;

export const SERVICES = [
  {
    code: "01",
    title: "Tela & display",
    eyebrow: "Troca precisa",
    body: "Diagnóstico visual, troca de display e acabamento alinhado ao seu aparelho.",
    icon: "screen",
  },
  {
    code: "02",
    title: "Bateria",
    eyebrow: "Mais autonomia",
    body: "Seu celular descarrega rápido? A equipe avalia saúde e compatibilidade da peça.",
    icon: "battery",
  },
  {
    code: "03",
    title: "Conector de carga",
    eyebrow: "Energia estável",
    body: "Falhas de carregamento, mau contato e limpeza técnica com avaliação especializada.",
    icon: "bolt",
  },
  {
    code: "04",
    title: "Software & placa",
    eyebrow: "Diagnóstico técnico",
    body: "Análise de sistema, travamentos, oxidação e falhas que pedem mais precisão.",
    icon: "chip",
  },
] as const;

export type QuoteForm = {
  name: string;
  brand: string;
  model: string;
  issue: string;
  details: string;
  serviceMode: "store" | "courier";
  address: string;
  complement: string;
  reference: string;
  intent: "urgency" | "quote";
  quality: string;
  estimatedPrice: number | null;
};

export const EMPTY_QUOTE: QuoteForm = {
  name: "",
  brand: "",
  model: "",
  issue: "",
  details: "",
  serviceMode: "store",
  address: "",
  complement: "",
  reference: "",
  intent: "quote",
  quality: "",
  estimatedPrice: null,
};

export function buildWhatsAppMessage(form: QuoteForm) {
  const atendimento = form.serviceMode === "store" ? "Ir até a loja" : "Solicitar retirada via motoboy";
  const location = form.serviceMode === "store" ? "Loja G-Tech" : form.address || "Endereço a confirmar";
  const intent = form.intent === "urgency" ? "Estou com urgência" : "Estou apenas procurando orçamento";

  return `Olá, G-Tech! Gostaria de solicitar um orçamento.\n\nNome: ${form.name}\nMarca: ${form.brand}\nModelo: ${form.model}\nDefeito: ${form.issue}\nQualidade: ${form.quality || "A confirmar"}\nPreço estimado: ${form.estimatedPrice ? `R$ ${form.estimatedPrice.toFixed(2)}` : "Não encontrado; consultar equipe"}\nDetalhes: ${form.details || "Não informado"}\nAtendimento: ${atendimento}\nLocalização: ${location}\nIntenção: ${intent}\n\nGostaria de receber uma estimativa preliminar. Sei que o valor definitivo será confirmado após avaliação técnica.`;
}

export function whatsappWithMessage(message: string) {
  return `${GTECH_CONFIG.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
