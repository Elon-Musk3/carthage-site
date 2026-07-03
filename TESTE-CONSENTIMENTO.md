# Teste do consentimento — Carthage

Use uma janela anônima para cada teste ou limpe os dados do site.

## Teste 1 — primeira visita

1. Abra o site.
2. Confirme que o banner aparece.
3. Não clique em nada.
4. Abra o DevTools → Network.
5. Confirme que não existem requisições para:
   - `googletagmanager.com`;
   - `google-analytics.com`;
   - `connect.facebook.net`;
   - endpoints de coleta do Meta Pixel.

Resultado esperado: Analytics e Pixel não carregam antes da escolha.

## Teste 2 — rejeitar opcionais

1. Clique em **Rejeitar opcionais**.
2. Atualize a página.
3. Confirme que o banner não reaparece.
4. Confirme que Analytics e Pixel continuam sem carregar.

## Teste 3 — aceitar todos

1. Limpe os dados do site ou execute no console:

```js
CARTHAGE_PRIVACY.reset()
```

2. Clique em **Aceitar todos**.
3. Confirme que o Meta Pixel é carregado.
4. O Google Analytics só será carregado se houver um ID `G-...` válido em `privacy-config.js`.

## Teste 4 — personalizar

1. Redefina a escolha.
2. Clique em **Personalizar**.
3. Ative apenas “Analíticos”.
4. Salve.
5. Confirme que o Meta Pixel não carrega.

Repita ativando apenas “Publicitários”.

## Teste 5 — alterar escolha

1. Vá até o rodapé.
2. Clique em **Preferências de privacidade**.
3. Altere as categorias.
4. Salve e atualize a página.
5. Confirme que a nova escolha foi preservada.
