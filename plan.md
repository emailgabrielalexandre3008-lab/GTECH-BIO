

## Incremento — Feedback real e painel administrativo

- **Direção visual:** centralizar a logo no perfil do Link na Bio e trocar o atalho prioritário de serviços por uma faixa compacta de cinco estrelas com o rótulo “Feedback real de clientes”. A faixa aponta para o Google Maps sem afirmar nota ou comentário inexistente.
- **Conteúdo público:** mostrar avaliações cadastradas apenas quando existirem e estiverem publicadas; calcular a média a partir desses registros; quando vazio, explicar a pendência e direcionar para avaliações reais no Google Maps.
- **Persistência:** tabela `feedback` no banco gerenciado com cliente, nota, comentário, data, fonte, publicação e timestamps. Nenhum seed fictício.
- **Painel:** rota `/admin` protegida por Manus OAuth e `adminProcedure`, com cadastro, edição, publicação/despublicação e remoção de avaliações reais. O menu de três pontos da Home aponta para essa rota protegida.
- **Limite atual:** Google Meu Negócio, API Google e avaliações sincronizadas ficam deliberadamente para a última fase, dependentes de OAuth e aprovação da API. Os demais módulos administrativos avançam primeiro com persistência real no banco.

## Acesso administrativo simplificado

O painel `/admin` agora usa formulário próprio de e-mail e senha, conforme solicitado pelo proprietário. A senha permanece somente em variável protegida do ambiente; o servidor verifica a credencial com derivação lenta `scrypt`, cria uma sessão aleatória persistida apenas como hash no banco e envia cookie `HttpOnly`, `Secure`, `SameSite=None` com expiração de sete dias. O logout revoga a sessão. O fluxo Manus OAuth não é mais exigido para administrar feedbacks.

## Incremento — Centro administrativo operacional

O painel passa a ter navegação responsiva por Dashboard, Editor do Biolink, Botões e Links, Simulador, Pedidos, Clientes, Promoções, Avaliações, Analytics, Configurações e Segurança. As tabelas `admin_content`, `quote_requests` e `analytics_events` persistem conteúdo editável, pedidos enviados pelo simulador e eventos reais. O público pode registrar início/envio de orçamento; o administrador acompanha pedidos, altera status, vê clientes derivados dos pedidos e administra links, seções, reparos, promoções e configurações como registros reais. Nenhum dado do Google Meu Negócio é fabricado ou sincronizado nesta fase.
