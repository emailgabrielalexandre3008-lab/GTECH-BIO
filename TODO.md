# TODO — G-Tech Bio Premium

## V0 público responsivo e conversão

- [x] Entregar o v0 da página única com navegação fluida por seções, priorizando mobile-first e funcionamento visual em celulares pequenos e grandes, Android e iPhone, tablets, notebooks, desktops e telas ultrawide, em retrato e paisagem. Evidência: TypeScript sem erros e capturas em 375, 768 e 1440 px.
- [x] Exibir logo da G-Tech, tela inicial premium, mensagem de boas-vindas, botão de entrada e CTAs grandes para orçamento e WhatsApp, sem bloquear a navegação por áudio ou animação. Ligação e Maps estão implementados no footer do v0.
- [x] Usar azul-marinho como cor principal, preto e branco como complementares, azul neon em detalhes, elementos metálicos discretos, cards translúcidos, iluminação cinematográfica, tipografia legível e animações suaves; evitar layout genérico de Linktree, excesso de efeitos e botões pequenos.
- [x] Utilizar a logo real fornecida pelo usuário e a arte promocional da Shopee em contexto comercial próprio, sem inventar novos dados de endereço ou parceria.

## Simulador de orçamento

- [ ] Implementar fluxo com nome; marca Apple, Samsung, Motorola, Xiaomi, Asus ou outras; modelo; defeito; descrição adicional; atendimento na loja ou retirada por motoboy; intenção de urgência ou orçamento.
- [ ] Para motoboy, solicitar localização somente após permissão, endereço, complemento e referência; distância inferior a 1 km deve ser gratuita; a partir de 1 km o valor deve ser confirmado pela equipe; não inventar taxa.
- [ ] No orçamento, montar mensagem com nome, marca, modelo, defeito, modalidade, localização e intenção, direcionando ao WhatsApp e informando que o preço definitivo depende de avaliação técnica.
- [ ] Na urgência, mostrar preço apenas quando cadastrado; a oferta de Incell de R$ 120 a R$ 150, garantia de 1 mês, película e mesmo dia só pode aparecer com disponibilidade e capacidade previamente confirmadas pela equipe.
- [ ] Não inventar preços de bateria, conector, placa, software ou outros reparos; manter campos editáveis pelo painel.

## Persistência e painel administrativo

- [ ] Persistir configuração da loja, links, marcas, modelos, defeitos, preços, regras de garantia, disponibilidade, Incell, motoboy, mensagens, avaliações, notícias, vídeos, documentos e assets no banco gerenciado.
- [ ] Proteger o painel com autenticação Manus OAuth e autorização por papel de administrador; visitantes não devem acessar dados administrativos.
- [ ] Permitir upload/substituição de documentos e imagens com metadados persistidos e endereços estáveis `/manus-storage/<key>`.
- [ ] Não simular persistência, analytics, avaliações ou integrações externas; manter pendências explícitas.

## Conteúdo e confiança

- [ ] Criar espaços para serviços, produtos/acessórios, avaliações reais, notícias, vídeos, grupo VIP, downloads, política de privacidade, termos de uso e termo de garantia.
- [ ] Não inventar avaliações, notícias, datas, preços, links, estoque, horário ou disponibilidade; links de YouTube, catálogo, grupo VIP, áudio direto e domínio permanecem configuráveis/pedentes.
- [ ] Exibir o orçamento como preliminar e deixar o termo de garantia sujeito à revisão jurídica compatível com o Código de Defesa do Consumidor.

## Experiência e qualidade

- [ ] Garantir controles equivalentes para toque, mouse e teclado, áreas de toque confortáveis, foco visível, textos legíveis sem zoom horizontal, conteúdo que não dependa de hover e suporte a `prefers-reduced-motion`.
- [ ] Exibir card de orçamento somente após 60 segundos sem interação, uma vez por sessão, sem atrapalhar o simulador, com as mensagens e botões definidos no documento mestre.
- [ ] Manter manifesto em `/manus-routes.json`, metadados SEO básicos, títulos/descrições significativos e estrutura compatível com publicação futura.
