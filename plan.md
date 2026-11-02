

## Incremento — Feedback real e painel administrativo

- **Direção visual:** centralizar a logo no perfil do Link na Bio e trocar o atalho prioritário de serviços por uma faixa compacta de cinco estrelas com o rótulo “Feedback real de clientes”. A faixa aponta para o Google Maps sem afirmar nota ou comentário inexistente.
- **Conteúdo público:** mostrar avaliações cadastradas apenas quando existirem e estiverem publicadas; calcular a média a partir desses registros; quando vazio, explicar a pendência e direcionar para avaliações reais no Google Maps.
- **Persistência:** tabela `feedback` no banco gerenciado com cliente, nota, comentário, data, fonte, publicação e timestamps. Nenhum seed fictício.
- **Painel:** rota `/admin` protegida por Manus OAuth e `adminProcedure`, com cadastro, edição, publicação/despublicação e remoção de avaliações reais. O menu de três pontos da Home aponta para essa rota protegida.
- **Limite atual:** este é o primeiro módulo administrativo; configurações de loja, preços, modelos, documentos, notícias e analytics continuam pendentes até serem implementadas com persistência real.

## Acesso administrativo simplificado

O painel `/admin` agora usa formulário próprio de e-mail e senha, conforme solicitado pelo proprietário. A senha permanece somente em variável protegida do ambiente; o servidor verifica a credencial com derivação lenta `scrypt`, cria uma sessão aleatória persistida apenas como hash no banco e envia cookie `HttpOnly`, `Secure`, `SameSite=None` com expiração de sete dias. O logout revoga a sessão. O fluxo Manus OAuth não é mais exigido para administrar feedbacks.
