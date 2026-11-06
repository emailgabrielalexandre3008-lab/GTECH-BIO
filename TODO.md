# TODO — G-Tech Bio Premium

## V0 público responsivo e conversão

- [x] Entregar o v0 da página única com navegação fluida por seções, priorizando mobile-first e funcionamento visual em celulares pequenos e grandes, Android e iPhone, tablets, notebooks, desktops e telas ultrawide, em retrato e paisagem. Evidência: TypeScript sem erros e capturas em 375, 768 e 1440 px.
- [x] Exibir logo da G-Tech, tela inicial premium, mensagem de boas-vindas, botão de entrada e CTAs grandes para orçamento e WhatsApp, sem bloquear a navegação por áudio ou animação. Ligação e Maps estão implementados no footer do v0.
- [x] Usar azul-marinho como cor principal, preto e branco como complementares, azul neon em detalhes, elementos metálicos discretos, cards translúcidos, iluminação cinematográfica, tipografia legível e animações suaves; evitar layout genérico de Linktree, excesso de efeitos e botões pequenos.
- [x] Utilizar a logo real fornecida pelo usuário e a arte promocional da Shopee em contexto comercial próprio, sem inventar novos dados de endereço ou parceria.

## Simulador de orçamento

- [x] Implementar o fluxo básico com nome; marca Apple, Samsung, Motorola, Xiaomi, Asus ou outra; modelo; defeito; descrição adicional; atendimento na loja ou retirada por motoboy; intenção de urgência ou orçamento.
- [ ] Para motoboy, solicitar a permissão real de localização antes de usar geolocalização, coletar endereço, complemento e referência; distância inferior a 1 km deve ser gratuita; a partir de 1 km o valor deve ser confirmado pela equipe; não inventar taxa.
- [x] Montar mensagem com nome, marca, modelo, defeito, modalidade, localização e intenção, direcionando ao WhatsApp e informando que o preço definitivo depende de avaliação técnica.
- [ ] Na urgência, mostrar preço apenas quando cadastrado; a oferta de Incell de R$ 120 a R$ 150, garantia de 1 mês, película e mesmo dia só pode aparecer com disponibilidade e capacidade previamente confirmadas pela equipe.
- [x] Não inventar preços de bateria, conector, placa, software ou outros reparos; quando não há preço aprovado, o fluxo orienta consultar a equipe.
- [ ] Solicitar e persistir telefone do cliente quando necessário para acompanhamento, pois os pedidos reais atuais foram registrados sem telefone.

### Regras comerciais de precificação confirmadas

- [x] Aplicar às peças a fórmula `Y = (X × 2) + R$ 30`, mantendo `X` como custo privado do fornecedor e `Y` como estimativa ao cliente.
- [x] Não aplicar desconto no Pix; a configuração persistente está em `pixDiscountPercent: 0` e exibe “Sem desconto no Pix”.
- [x] Usar preços individuais para serviços específicos e exibir “Sob avaliação técnica” quando o valor não estiver cadastrado.
- [ ] Tornar multiplicador, mão de obra e arredondamento configuráveis pelo painel antes de importar ou recalcular Baterias e Componentes.

## Persistência e painel administrativo

- [x] Criar a primeira tabela persistente `feedback` no banco gerenciado, com nome do cliente, nota, comentário, data, fonte, status de publicação e timestamps; não inserir avaliações fictícias.
- [x] Criar `/admin` protegido por login próprio de e-mail e senha; armazenar a senha apenas como variável protegida, usar sessão aleatória persistida somente como hash, cookie `HttpOnly/Secure/SameSite=None`, expiração de sete dias e logout; visitantes não devem acessar os procedimentos administrativos.
- [x] Permitir no painel cadastrar, editar, publicar/despublicar e remover avaliações reais, com cálculo da média somente a partir dos registros existentes.
- [x] Persistir registros de conteúdo administrativo para configurações, seções, links, reparos, promoções e dados estruturados, com cadastro, edição, ativação, ordenação e remoção.
- [x] Registrar pedidos reais enviados pelo simulador, listar pedidos no painel, alterar status e derivar uma lista de clientes a partir dos pedidos recebidos.
- [x] Registrar eventos reais de início e envio de orçamento e exibir contagens no Dashboard/Analytics; não exibir números fictícios.
- [ ] Persistir preços, regras detalhadas de garantia, disponibilidade, Incell, motoboy, mensagens, notícias, vídeos, documentos e assets com editores especializados e uploads persistidos, além do JSON genérico já existente para configurações.
- [ ] Permitir upload/substituição de documentos e imagens com metadados persistidos e endereços estáveis `/manus-storage/<key>`.
- [ ] Não simular persistência, analytics, avaliações ou integrações externas; manter pendências explícitas.

## Conteúdo e confiança

- [x] Substituir o atalho principal de serviços por `Avaliações reais no Google`, exibir cinco estrelas como referência visual e apresentar feedbacks públicos somente quando forem cadastrados e publicados pela equipe.
- [x] Linkar para o Google Maps como fonte de avaliações reais enquanto o painel não tiver registros publicados, deixando claro que o site não inventa comentários ou nota.
- [ ] Criar espaços para serviços, produtos/acessórios, notícias, vídeos, grupo VIP, downloads, política de privacidade, termos de uso e termo de garantia.
- [ ] Não inventar avaliações, notícias, datas, preços, links, estoque, horário ou disponibilidade; links de YouTube, catálogo, grupo VIP, áudio direto e domínio permanecem configuráveis/pedentes.
- [ ] Exibir o orçamento como preliminar e deixar o termo de garantia sujeito à revisão jurídica compatível com o Código de Defesa do Consumidor.
- [x] Deixar Google Meu Negócio e API Google fora desta etapa, sem inventar nota, avaliações, insights ou sincronização; a integração oficial permanece como fase final dependente de OAuth e acesso às APIs.

## Importador Tyros Cell — Frontais/Telas

- [x] Criar seção administrativa exclusiva para Frontais/Telas, separada de Baterias e Componentes, com upload individual de `.xlsx` e `.xls`.
- [x] Ler o Excel original recebido, incluindo abas não vazias, seções de marcas, modelos na coluna inicial, células de qualidade/custo e valores numéricos ou no padrão `valor-qualidade`.
- [x] Gerar prévia persistente antes da aprovação, exibindo arquivo, data, abas, marcas, modelos, custos reconhecidos, linhas inválidas e duplicidades.
- [x] Armazenar o arquivo original no Storage durável e proteger upload, histórico, prévia, catálogo e custos com sessão administrativa.
- [x] Criar catálogo persistente de frontais e histórico de custos; não apagar automaticamente peças ausentes em uma nova tabela.
- [x] Calcular preço estimado por código usando `Y = (X × 2) + R$ 30`; o simulador público recebe apenas preço final e dados necessários ao orçamento.
- [x] Conectar o simulador a frontais aprovados, com seleção de qualidade quando disponível e mensagem de consulta ao WhatsApp quando não houver custo válido.
- [x] Renomear o CTA público para “Simular orçamento”, normalizar Apple/iPhone com a seção `IPHONE` da tabela e exibir o card “Simulação de frontais iPhone 12” com as qualidades e preços realmente disponíveis.
- [x] Importar e aprovar `Tabelatela(3).xlsx`, que contém 623 modelos, 1.253 custos reconhecidos e 57 modelos sem custo; os frontais válidos já alimentam o orçamento público.

## Experiência e qualidade

- [ ] Garantir controles equivalentes para toque, mouse e teclado, áreas de toque confortáveis, foco visível, textos legíveis sem zoom horizontal, conteúdo que não dependa de hover e suporte a `prefers-reduced-motion`.
- [ ] Exibir card de orçamento somente após 60 segundos sem interação, uma vez por sessão, sem atrapalhar o simulador, com as mensagens e botões definidos no documento mestre.
- [ ] Manter manifesto em `/manus-routes.json`, metadados SEO básicos, títulos/descrições significativos e estrutura compatível com publicação futura.


## Baterias — implementação concluída

- [x] Ler e interpretar `Tabelabaterias(4).xlsx` em parser dedicado, sem misturar com frontais.
- [x] Criar importação protegida, prévia, histórico e aprovação no painel administrativo.
- [x] Aprovar 300 modelos, 409 opções válidas e 191 combinações sem custo; manter sem preço automático as opções inválidas ou sem custo.
- [x] Conectar o simulador ao catálogo `batteries` para o defeito “Bateria descarregando”.
- [x] Validar Samsung A01 com CHINA por R$ 80 e ORI TYROS por R$ 100.
- [ ] Confirmar comercialmente disponibilidade, prazo e garantia específicos de cada bateria.
- [ ] Implementar posteriormente a tabela de componentes/conectores em categoria separada.


## Logo e identidade visual — implementação concluída

- [x] Remover o anel preto externo do asset padrão por recorte preservando a arte azul da marca.
- [x] Aplicar máscara circular sem borda preta na logo pública.
- [x] Criar aba administrativa `Logo e identidade`.
- [x] Aceitar upload protegido de imagens JPG e PNG até 5 MB.
- [x] Permitir ajustar escala, posicionamento horizontal e posicionamento vertical com prévia circular.
- [x] Persistir a configuração ativa no banco e aplicar o resultado na página pública.
- [x] Validar TypeScript, build, upload protegido e captura mobile da Home.
