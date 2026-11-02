

## Incremento — Feedback real e painel administrativo

- **Direção visual:** centralizar a logo no perfil do Link na Bio e trocar o atalho prioritário de serviços por uma faixa compacta de cinco estrelas com o rótulo “Feedback real de clientes”. A faixa aponta para o Google Maps sem afirmar nota ou comentário inexistente.
- **Conteúdo público:** mostrar avaliações cadastradas apenas quando existirem e estiverem publicadas; calcular a média a partir desses registros; quando vazio, explicar a pendência e direcionar para avaliações reais no Google Maps.
- **Persistência:** tabela `feedback` no banco gerenciado com cliente, nota, comentário, data, fonte, publicação e timestamps. Nenhum seed fictício.
- **Painel:** rota `/admin` protegida por Manus OAuth e `adminProcedure`, com cadastro, edição, publicação/despublicação e remoção de avaliações reais. O menu de três pontos da Home aponta para essa rota protegida.
- **Limite atual:** Google Meu Negócio, API Google e avaliações sincronizadas ficam deliberadamente para a última fase, dependentes de OAuth e aprovação da API. Os demais módulos administrativos avançam primeiro com persistência real no banco.

## Acesso administrativo simplificado

O painel `/admin` agora usa formulário próprio de e-mail e senha, conforme solicitado pelo proprietário. A senha permanece somente em variável protegida do ambiente; o servidor verifica a credencial com derivação lenta `scrypt`, cria uma sessão aleatória persistida apenas como hash no banco e envia cookie `HttpOnly`, `Secure`, `SameSite=None` com expiração de sete dias. O logout revoga a sessão. O fluxo Manus OAuth não é mais exigido para administrar feedbacks.

## Incremento — Importador Tyros Cell: Frontais/Telas

O primeiro importador será exclusivo para a categoria `frontals`, sem misturar baterias ou componentes. A nova `Tabelatela(3).xlsx` foi processada: contém 7 abas, sendo `Planilha1` a única com dados; há 14 seções de marca, 623 modelos, 1.253 registros de custo reconhecidos e 57 linhas de modelo sem custo. O formato usa marcas em linhas mescladas de `A:L`, modelo na coluna `A` e várias células de preço/qualidade nas colunas seguintes, normalmente no padrão `valor-qualidade`, com alguns valores numéricos sem qualidade informada.

O sistema agora usa parser determinístico com `xlsx` para `.xlsx` e `.xls`, identifica seções, modelos, qualidades, custos, valores inválidos e duplicidades, armazena a prévia em staging, envia o arquivo original ao Storage, preserva histórico e só atualiza `parts_catalog` após aprovação manual. A `Tabelatela(3).xlsx` foi importada e aprovada com 1.253 registros válidos; os 57 modelos sem custo permanecem sem orçamento automático. O simulador público consulta somente frontais aprovados e recebe exclusivamente o preço final calculado por `Y = (X × 2) + R$ 30`, nunca o custo Tyros Cell.

## Incremento — Centro administrativo operacional

O painel passa a ter navegação responsiva por Dashboard, Editor do Biolink, Botões e Links, Simulador, Pedidos, Clientes, Promoções, Avaliações, Analytics, Configurações e Segurança. As tabelas `admin_content`, `quote_requests` e `analytics_events` persistem conteúdo editável, pedidos enviados pelo simulador e eventos reais. O público pode registrar início/envio de orçamento; o administrador acompanha pedidos, altera status, vê clientes derivados dos pedidos e administra links, seções, reparos, promoções e configurações como registros reais. Nenhum dado do Google Meu Negócio é fabricado ou sincronizado nesta fase.
