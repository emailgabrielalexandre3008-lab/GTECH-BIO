# G-Tech — Conhecimento Histórico e Contexto Operacional

**Arquivo de referência do projeto:** Gtechbio  
**Última atualização:** 02/11/2026  
**Objetivo:** preservar o contexto confirmado da G-Tech Assistência Técnica para orientar futuras decisões, implementações e recomendações no Manus.

> Este documento separa fatos confirmados, funcionalidades já implementadas, decisões de produto, pendências e hipóteses. Não usar ideias futuras como se fossem recursos concluídos. Não registrar senhas, tokens, chaves privadas ou outros segredos neste arquivo.

---

## 1. O que foi entendido sobre a G-Tech

A G-Tech Assistência Técnica é uma operação de assistência técnica para celulares e dispositivos móveis, com foco em confiança, precisão, atendimento direto e conversão por WhatsApp. A presença digital principal em desenvolvimento é um **Link na Bio mobile-first**, compacto e inspirado em interfaces Apple: poucos elementos, leitura rápida, CTA de orçamento em destaque e navegação sem rolagem excessiva.

A mensagem de posicionamento aprovada para a marca é:

> “Seu celular merece um cuidado especializado. Na G-Tech, tecnologia, confiança e precisão caminham juntas.”

A identidade visual definida para o Link na Bio usa azul-marinho, branco, preto, azul neon em detalhes, tipografia limpa, cards claros/translúcidos e acabamento tecnológico discreto. A direção foi alterada de uma página longa e cinematográfica para um Link na Bio compacto, direto e voltado à geração de orçamentos.

### Dados confirmados da empresa

- **Nome:** G-Tech Assistência Técnica
- **CNPJ:** 63.233.026/0001-08
- **Endereço informado:** Rua Dr. Alarico Silveira, 86 — Vila Aricanduva, São Paulo — SP
- **Bairro:** ainda deve ser confirmado pela equipe quando necessário
- **WhatsApp:** +55 11 97050-8034
- **Instagram:** https://www.instagram.com/assistencia_gtechs?cplk=Y2I4NzFreWhueGg5&utm_source=qr
- **Google Maps:** https://share.google/fgnzdYrlD7kCyIdkC

Não presumir nota, quantidade de avaliações, horário de funcionamento, taxa de motoboy, disponibilidade de peça ou preço que não estejam cadastrados e aprovados.

---

## 2. Como a operação funciona

### Divulgação e aquisição

Os canais confirmados ou preparados no projeto são:

1. Link na Bio público da G-Tech.
2. WhatsApp como principal canal de conversão e atendimento.
3. Instagram como canal de presença e relacionamento.
4. Google Maps como canal de localização e avaliações reais.
5. Possíveis links futuros para YouTube, catálogo, grupo VIP e promoções — ainda dependentes de configuração real.

### Conversão

O CTA principal abre o simulador de orçamento. O cliente informa nome, marca, modelo, defeito, forma de atendimento e intenção. Quando existe uma peça cadastrada e aprovada, o sistema mostra a qualidade e um preço estimado. Ao final, o sistema monta uma mensagem estruturada e abre o WhatsApp.

O valor exibido é sempre preliminar. O valor definitivo e a disponibilidade da peça devem ser confirmados pela equipe após avaliação técnica.

### Atendimento e execução

O fluxo previsto contempla:

- Atendimento na loja.
- Solicitação de retirada via motoboy.
- Endereço, complemento e referência quando o motoboy for escolhido.
- Localização apenas mediante permissão do cliente.
- Regra de menos de 1 km grátis e valores a partir de 1 km somente quando configurados e confirmados administrativamente.
- Registro do pedido de orçamento no sistema.
- Acompanhamento do pedido no painel administrativo.
- Confirmação da peça, preço e prazo antes de prometer o serviço.

### Pós-venda

A operação prevê controle de garantia, política de privacidade, termos de uso, avaliações reais e contato pós-serviço. Os documentos e textos finais devem ser cadastrados ou revisados pela equipe. O termo de garantia precisa de revisão jurídica antes de ser tratado como documento definitivo.

---

## 3. Projeto atual: G-Tech Bio Premium

O projeto WebDev gerenciado foi criado no Manus com frontend, servidor e banco persistente.

### Direção do produto

- Link na Bio, não site institucional longo.
- Experiência prioritariamente mobile, mas responsiva para iPhone, Android, tablets, notebooks e desktops.
- CTA de orçamento visível no primeiro viewport.
- Visual Apple-like, compacto e elegante.
- Ações principais: simular orçamento, WhatsApp, ligar, como chegar, Instagram e avaliações.
- Informações secundárias em accordions para reduzir a rolagem.
- Conteúdo real separado de conteúdo futuro ou ainda não confirmado.

### Arquitetura já criada

- React + TypeScript no frontend.
- Vite para build do frontend.
- Express + tRPC no backend.
- Drizzle ORM com banco MySQL gerenciado.
- Storage do projeto para arquivos enviados.
- Sessão administrativa própria com cookie HttpOnly, Secure e SameSite=None.
- Painel `/admin` com login por e-mail e senha armazenados de forma protegida no ambiente; os valores secretos não ficam no código nem neste documento.
- Rotas públicas e administrativas declaradas em `client/public/manus-routes.json`.
- Projeto salvo no Git canônico do WebDev.

### Estado visual atual

A página pública contém:

- Logo G-Tech centralizada.
- Nome e descrição da assistência.
- Botão **“Simular orçamento”**.
- Atalhos para WhatsApp, ligação e localização.
- Faixa de cinco estrelas para feedback real.
- Link para Instagram.
- Link para falar com a equipe.
- Accordions de confiança, avaliações e mais opções.
- Mensagem automática após inatividade, uma vez por sessão, sem interromper o simulador.

---

## 4. Simulador de orçamento já implementado

O simulador possui quatro etapas:

1. **Nome:** como chamar o cliente.
2. **Aparelho:** marca e modelo.
3. **Defeito:** tela quebrada, tela sem imagem, tela com manchas, bateria descarregando, celular não carrega, conector de carga, software, celular não liga, placa, oxidação ou outro.
4. **Atendimento:** loja ou motoboy, endereço quando aplicável e intenção de urgência ou orçamento.

Quando o defeito começa com “Tela” e o modelo possui registros aprovados, aparece o card de simulação de frontais.

### Apple/iPhone

O cliente escolhe **Apple** no formulário, mas o sistema consulta corretamente a seção **IPHONE** da planilha. O modelo pode ser digitado como `12` ou `iPhone 12`; a consulta normaliza o texto.

O card atual usa o título:

> **Simulação de frontais iPhone 12**

O sistema prioriza correspondência exata para evitar misturar `12`, `12 Mini` e `12 Pro Max`.

### Mensagem enviada ao WhatsApp

A mensagem inclui, quando disponível:

- Nome.
- Marca.
- Modelo.
- Defeito.
- Qualidade escolhida.
- Preço estimado.
- Detalhes adicionais.
- Modalidade de atendimento.
- Localização.
- Intenção.
- Aviso de que o valor definitivo depende de avaliação técnica.

---

## 5. Catálogo de telas/frontais

Foi criado um importador dedicado à categoria `frontals`, sem misturar baterias ou componentes.

### Arquivo mais recente aplicado

- **Arquivo:** `Tabelatela(3).xlsx`
- **Aba com dados:** `Planilha1`
- **Modelos processados:** 623
- **Marcas identificadas:** 14
- **Registros válidos de custo:** 1.253
- **Registros sem custo válido:** 57
- **Status:** importado e aprovado
- **Import ID registrado no teste:** 60001

Marcas identificadas na tabela:

- Samsung
- Motorola
- LG
- iPhone
- Xiaomi
- Realme
- Huawei
- Zenfone
- Nokia
- Infinix
- Touch Tablet
- Philco
- Honor
- Tecno

### Fórmula atual

O preço estimado exibido ao cliente é calculado por:

```text
Y = (X × 2) + R$ 30
```

- `X`: custo importado da tabela, privado.
- `Y`: preço estimado mostrado ao cliente.

O custo do fornecedor nunca deve ser exibido no frontend público.

### iPhone 12 já disponível

As qualidades e preços atualmente encontrados para iPhone 12 são:

- INSELL — R$ 160
- VIVID (TYROS) — R$ 180
- JK KELAI FHD — R$ 210
- JK — R$ 220
- OLED DD — R$ 350
- SOFT OLED KELAI® — R$ 430
- DD CALIBRADA — R$ 490

Esses preços são estimativas calculadas pela fórmula e não substituem a confirmação técnica.

### Regras do catálogo

- Não inventar preço quando não há custo válido.
- Não preencher modelos sem custo com preço genérico.
- Não misturar telas, baterias e componentes.
- Nova planilha deve passar por prévia e aprovação antes de alterar o catálogo público.
- O arquivo original e o histórico de importação devem ser preservados.
- Duplicidades e linhas inválidas devem ser sinalizadas.

---

## 6. Painel administrativo

O painel está disponível em `/admin` e usa login próprio por e-mail e senha. A credencial foi recebida pelo proprietário e armazenada como segredo protegido do ambiente. **Não registrar a senha em documentos, commits, logs ou respostas.**

Módulos já preparados ou implementados:

- Dashboard.
- Editor do Link na Bio.
- Botões e links.
- Simulador.
- Pedidos de orçamento.
- Clientes derivados dos pedidos.
- Promoções.
- Avaliações/feedback.
- Importação de telas/frontais.
- Analytics.
- Configurações.
- Segurança.

### Feedbacks

- Feedbacks são persistidos no banco.
- Podem ser cadastrados, editados, publicados/despublicados e removidos pelo painel.
- A página pública mostra somente feedbacks publicados.
- Quando não há comentários cadastrados, o sistema não inventa avaliações e direciona o visitante ao Google Maps.

### Importação

O importador aceita `.xlsx` e `.xls`, armazena a prévia, preserva o arquivo original e exige aprovação antes de publicar preços no catálogo.

Foi implementada autorização adicional por ticket curto para proteger upload, conferência e aprovação no Preview quando o cookie não acompanha corretamente uma requisição binária.

---

## 7. Histórico de decisões importantes

1. O primeiro conceito era uma página mais longa, tecnológica e cinematográfica.
2. O proprietário pediu mudança para um Link na Bio compacto, padrão Apple e com foco em orçamento.
3. A logo foi centralizada.
4. O atalho de serviços foi substituído por feedback real com cinco estrelas e link para avaliações.
5. O acesso administrativo deixou de depender do Manus OAuth e passou a usar login próprio protegido.
6. Google Meu Negócio, API Google e sincronização automática de avaliações foram deixados para a última fase.
7. Primeiro foi implementada a importação de telas/frontais; bateria e componentes ficam para depois.
8. A primeira tabela real foi analisada, mas a tabela mais recente `Tabelatela(3).xlsx` foi a que ficou aprovada e ativa.
9. O CTA público foi renomeado de “Fazer orçamento” para “Simular orçamento”.
10. Apple foi normalizada para consultar a categoria `IPHONE` da tabela.

---

## 8. O que ainda falta ou depende de validação

### Dados comerciais

- Confirmar bairro e dados finais do endereço.
- Cadastrar preços de bateria.
- Cadastrar preços de conectores.
- Cadastrar preços de placa, software e outros serviços.
- Definir disponibilidade real e prazo por peça.
- Definir regra final de motoboy e taxas por distância.
- Cadastrar garantia final e revisar juridicamente o termo.
- Cadastrar política de privacidade e termos de uso definitivos.
- Inserir links reais do catálogo, grupo VIP, YouTube e música, se forem utilizados.

### Integrações

- Google Business Profile / Google Meu Negócio.
- Google Places ou fluxo autorizado para avaliações.
- RSS/API de notícias, caso a central de notícias seja ativada.
- Integração com YouTube, caso o canal seja configurado.
- Analytics externo, se necessário além do registro interno de eventos.

### Produto

- Melhorar sugestões de modelo e autocompletar para reduzir erro de digitação.
- Definir se o cliente deve obrigatoriamente escolher uma qualidade antes de avançar.
- Definir mensagens específicas para peças sem preço.
- Revisar visualmente o fluxo completo em vários tamanhos de iPhone, Android, tablet e desktop.
- Criar módulos de bateria e componentes usando planilhas próprias, sem reaproveitar a tabela de telas.

---

## 9. Oportunidades prioritárias

### Prioridade 1 — Conversão imediata

- Garantir que o CTA “Simular orçamento” permaneça visível no primeiro viewport.
- Melhorar o preenchimento de marca/modelo com sugestões reais do catálogo.
- Medir início do simulador, seleção de qualidade, envio e clique no WhatsApp.
- Confirmar rapidamente disponibilidade da peça antes de prometer prazo.

### Prioridade 2 — Aumentar ticket e previsibilidade

- Concluir tabelas de bateria e componentes.
- Separar preço estimado, mão de obra, garantia e adicionais quando a operação definir esses valores.
- Criar acompanhamento de pedidos por status no painel.
- Organizar clientes derivados de pedidos para retorno e pós-venda.

### Prioridade 3 — Economizar tempo operacional

- Usar o painel para alterar links, textos, promoções e preços sem editar código.
- Manter importação por prévia/aprovação para reduzir erro de tabela.
- Criar mensagens automáticas por tipo de defeito e intenção.
- Centralizar documentos, garantia e regras de atendimento.

### Prioridade 4 — Prova social e aquisição

- Cadastrar somente avaliações reais.
- Integrar Google Meu Negócio quando a autorização e a API estiverem disponíveis.
- Configurar Instagram, grupo VIP, catálogo e YouTube somente com links confirmados.
- Criar campanhas com rastreamento de origem.

---

## 10. Regras permanentes para futuras tarefas

1. Não inventar avaliações, notas, preços, taxas, disponibilidade, horários, links, notícias ou datas.
2. Diferenciar sempre “implementado”, “cadastrado”, “pendente”, “hipótese” e “ideia futura”.
3. Não usar preço de fornecedor no frontend público.
4. Não misturar categorias de produto na importação.
5. Preservar os arquivos Excel originais e o histórico de importações.
6. Validar planilhas antes de aprovar alterações no catálogo.
7. Pedir confirmação quando uma decisão mudar preço, disponibilidade, garantia, política legal ou fluxo comercial.
8. Não registrar credenciais em arquivos, código, commits ou mensagens.
9. Manter a experiência compacta, mobile-first e orientada à conversão.
10. Respeitar acessibilidade básica, feedback de erro compreensível e funcionamento em celulares, tablets e desktops.
11. Ao implementar novas funções no painel, usar banco persistente; não simular persistência com estado local.
12. Antes de declarar uma entrega concluída, executar checagem, build e teste funcional do caminho alterado.

---

## 11. Estado técnico no momento deste registro

- Último commit relacionado à simulação de frontais: `c913dfc`.
- TypeScript: aprovado na última verificação.
- Build de produção: aprovado na última verificação.
- Catálogo público de frontais: ativo após aprovação da `Tabelatela(3).xlsx`.
- Google Meu Negócio/API Google: deliberadamente não implementado nesta fase.
- Bateria e componentes: ainda não importados.


## Atualização de 03/11/2026 — Catálogo de baterias

A implementação de baterias foi iniciada conforme planejado, usando a planilha real `Tabelabaterias(4).xlsx` da Tyros Cell. O arquivo possui uma aba (`Sheet1`), seções para Samsung, Motorola, Xiaomi, LG, iPhone, Realme, Infinix e Oppo, com colunas de qualidade `CHINA`, `ORI TYROS` e, na seção de iPhone, `FOX CONN` e `ORI TYROS`.

O parser dedicado identifica marca, modelo, qualidade e custo sem misturar a categoria com frontais ou componentes. A fórmula aprovada do projeto foi aplicada para o preço estimado: `Y = (X × 2) + R$ 30`. O custo da Tyros permanece privado no painel e não é enviado ao cliente.

A tabela foi importada e aprovada com os seguintes números confirmados: 300 modelos, 409 opções válidas de custo, 191 combinações sem custo válido, 8 marcas e importação registrada com ID 90001. As opções sem custo continuam fora do orçamento automático.

O painel administrativo agora possui a aba `Importar baterias`, com upload protegido, prévia, histórico e aprovação. O simulador público possui consulta separada para baterias e, quando o defeito escolhido é `Bateria descarregando`, mostra as qualidades disponíveis para o modelo e os preços estimados aprovados. O endpoint público testado para Samsung A01 retornou `CHINA — R$ 80` e `ORI TYROS — R$ 100`.

Baterias agora estão implementadas e ativas. Ainda faltam, em fases futuras, componentes/conectores e a confirmação comercial de disponibilidade, prazo, garantia e eventuais regras específicas por bateria. Não presumir essas informações.


## Atualização de 04/11/2026 — Logo sem borda e editor de identidade visual

A logo padrão foi tratada a partir do asset fornecido pelo proprietário: o anel preto externo foi removido por recorte da área azul e aplicada uma máscara circular transparente. O novo asset padrão é `client/public/gtech-logo-clean.png`, usado pela página pública no lugar de `gtech-mark.png`.

O painel administrativo recebeu a aba **Logo e identidade**. Ela aceita upload de JPG e PNG até 5 MB, envia a imagem ao Storage protegido e permite ajustar escala, posição horizontal e posição vertical antes de salvar. A configuração é persistida no banco como conteúdo `branding/logo`; a página pública lê somente a configuração ativa e aplica máscara circular, sem borda preta externa. O fallback continua sendo o asset limpo local quando ainda não existe uma personalização salva.

O upload foi validado com resposta HTTP 200 e URL de Storage. A página pública foi capturada em viewport mobile e confirmou a logo centralizada sem o anel preto externo.
