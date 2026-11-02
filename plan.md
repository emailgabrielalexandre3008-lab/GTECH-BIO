# Plano — G-Tech Bio Premium

## Escopo aprovado

Construir uma landing page pública única, mobile-first e orientada à conversão para a G-Tech Assistência Técnica, com simulador de orçamento, contatos, serviços, produtos, avaliações reais cadastráveis, notícias/vídeos/ofertas/documentos e painel administrativo autenticado. O projeto deverá distinguir conteúdo confirmado de conteúdo pendente e nunca inventar preços, avaliações, estoque, taxas, links, notícias ou datas.

## Abordagem de implementação

- **Frontend:** React + TypeScript + Tailwind v4, com componentes reutilizáveis e uma única rota pública `/` usando seções ancoradas.
- **Compatibilidade de dispositivos:** layout e interações serão testados e ajustados para celulares pequenos e grandes, Android e iPhone, tablets, notebooks, desktops e telas ultrawide, em orientação retrato e paisagem. Os componentes deverão funcionar com toque, mouse, teclado e leitores de tela, com áreas de toque confortáveis, tipografia fluida, conteúdo que não dependa de hover e adaptação de desempenho para aparelhos mais lentos.
- **Backend:** Express + tRPC, aproveitando o starter `web-db-user`.
- **Persistência:** Drizzle/MySQL gerenciado. O schema terá configurações públicas, marcas/modelos/defeitos, regras de orçamento, avaliações, notícias, vídeos, documentos, assets e eventos de conversão.
- **Autenticação:** Manus OAuth para acesso ao painel, com autorização baseada no papel `admin` da tabela de usuários. Visitantes nunca acessarão dados administrativos.
- **Armazenamento:** assets grandes e uploads administrativos em `/manus-storage/<key>`; metadados e URLs estáveis persistidos no banco.
- **Configuração central:** links e dados da loja serão servidos por configuração persistente, com defaults confirmados e campos explicitamente pendentes.
- **Conversão:** CTAs de WhatsApp, ligação, Maps, orçamento e grupo VIP; o simulador monta uma mensagem estruturada para o WhatsApp e registra eventos somente quando o registro real estiver implementado.
- **Integridade operacional:** o preço Incell só aparece quando o cadastro do modelo confirmar estoque/capacidade; demais preços começam vazios; motoboy não terá taxa inventada; avaliações e notícias não terão conteúdo fictício.
- **SEO:** HTML público com título, descrição, headings e conteúdo significativo; canonical e OG absoluto somente quando um domínio público real for configurado.
- **Documentação:** `TODO.md` manterá critérios completos e o estado real das entregas; pendências ficarão abertas até haver dados ou integração.

## Estrutura prevista

- `client/src/pages/Home.tsx`: composição da página e estados do simulador.
- `client/src/components/gtech/`: hero, perfil, service cards, quote flow, reviews, news, videos, offers, documents e footer.
- `client/src/lib/gtech-config.ts`: tipos e helpers de configuração pública.
- `client/src/pages/Admin.tsx`: painel protegido por login e navegação administrativa.
- `server/routers.ts`: procedimentos públicos, eventos e rotas protegidas do painel.
- `server/db.ts`: queries e persistência.
- `drizzle/schema.ts` e `drizzle/`: tabelas e migrações.
- `public/manus-routes.json`: manifesto de rotas públicas e administrativas.
- `brand-spec.md`: inventário dos assets, tokens e fontes da marca.

## Design Decisions

- **Design Read:** landing de assistência técnica premium para uso a 10 cm no celular; visual “tech-luxury de oficina boutique”, autoritativo e energético, com densidade média, movimento controlado e alta dependência da logo/ativos reais. Dials: variação visual 7/10, movimento 5/10, densidade 5/10, dependência de assets 8/10, fidelidade de marca 10/10.
- **Posicionamento:** converter uma necessidade urgente de reparo em uma conversa confiável com a G-Tech. Hero = autoridade/ação; simulador = decisão; conteúdo = prova e recorrência; rodapé = segurança e contato.
- **Âncora estética:** custom, derivada da linguagem visual fornecida pelo usuário — azul elétrico, metal escovado, fundos escuros e highlights de vitrine tecnológica.
- **Movimento de design:** Tech-luxury editorial / “cinematic service bay”.
- **Princípios:** confiança antes do efeito; uma ação principal por viewport; profundidade por camadas translúcidas; neon usado como sinal, não como preenchimento.
- **Filosofia de cor:** marinho quase-preto cria segurança e contraste; azul neon sinaliza ação e precisão; branco quente melhora leitura; ciano e prata aparecem apenas em detalhes técnicos.
- **Paleta:** `#07111F` fundo ink; `#0C1D33` navy; `#1E6BFF` electric blue; `#51D7FF` cyan accent; `#F5F7FA` white; `#8C9AAF` muted; `#C6A96B` metal warm accent usado raramente.
- **Tipografia:** Space Grotesk para títulos e números; DM Sans para corpo, labels e dados. Títulos compactos, com alto contraste e no máximo dois pesos visuais dominantes.
- **Espaçamento:** escala base de 4 px, principais intervalos em 8/16/24/32/48/64 px. Container fluido com gutters de 20 px no mobile e 40 px no desktop.
- **Raios:** cards 20 px, botões 12 px, badges 999 px; evitar a estética de “pill” em tudo.
- **Sombras:** elevação 1 = borda translúcida; elevação 2 = sombra azul-marinho; elevação 3 = glow azul suave somente para CTA/estado ativo.
- **Layout:** coluna editorial assimétrica no mobile, com cards empilhados e faixas horizontais de prova; no desktop, hero dividido entre mensagem e objeto/asset, mantendo o CTA no eixo de leitura.
- **Elementos assinatura:** linha de varredura azul no topo dos cards; micro-grid técnico no fundo; selo circular da G-Tech como ponto de ancoragem.
- **Interação:** escolhas do simulador respondem imediatamente, mostram progresso e não escondem o estado; CTA principal sempre grande e com label verbal. Autoplay de áudio nunca bloqueia o site.
- **Resiliência multiplataforma:** nenhuma função essencial dependerá de hover, largura fixa, gesto exclusivo, autoplay ou recurso disponível apenas em um navegador. O simulador terá controles equivalentes para toque e teclado, o menu será navegável em telas estreitas e o conteúdo será legível sem zoom horizontal.
- **Animação:** entrada curta de 400–600 ms, easing `cubic-bezier(.22,1,.36,1)`; hover com translate de até 4 px; brilho respirando apenas em elementos de ação; respeitar `prefers-reduced-motion`.
- **Essência da marca:** assistência técnica de bairro com presença premium, precisão e atendimento direto. Personalidade: confiável, técnica, resolutiva.
- **Voz:** direta, acolhedora e sem prometer o que não foi confirmado. Exemplo: “Seu aparelho não precisa esperar.” / “Envie os detalhes. A equipe confirma o próximo passo.”
- **Logo e assets:** usar a logo circular azul fornecida pelo usuário como marca principal; usar a arte promocional da Shopee somente em um bloco comercial de divulgação, sem reaproveitá-la como hero genérico. Não desenhar uma logo substituta em CSS.
- **Cor proprietária:** azul elétrico G-Tech `#1E6BFF`.

## Escopo do primeiro corte (v0)

Entregar primeiro a casca visual navegável com hero, perfil, CTA de orçamento, preview do simulador, serviços, imagem/arte real disponível, contato e footer legal. O v0 servirá para calibrar hierarquia e identidade antes de completar estados administrativos, dados e integrações.

## Dependências reais

- Confirmar bairro do endereço: Vila Aricanduva ou Tatuapé.
- Validar visual e interação em múltiplas larguras, alturas, densidades de pixel, orientações e métodos de entrada antes de considerar a experiência concluída.
- Receber link do canal YouTube, grupo VIP, catálogo, domínio e URL direta de áudio.
- Receber ou cadastrar avaliações reais, notícias, preços, modelos, horários e estoque.
- Revisar juridicamente o termo de garantia.
- Integrar/confirmar mapa e eventual API de distância.
