

## Atualização de 04/11/2026 — Fallback de sessão administrativa no Preview

Foi corrigido o erro `You do not have required permission (10002)` que ocorria no `/admin` quando o Preview incorporado em Safari/iPhone bloqueava o cookie HttpOnly `gtech_admin_session` nas chamadas tRPC. O login continua usando o cookie como caminho principal, mas agora também entrega um token de sessão temporário ao frontend, armazenado apenas em `sessionStorage` durante a sessão do navegador. O backend aceita esse token somente pelo header `X-GTech-Admin-Session`, e as chamadas tRPC e endpoints administrativos usam o fallback quando necessário. O logout revoga também esse token. Nenhuma regra comercial, preço, catálogo ou dado de cliente foi alterado.
