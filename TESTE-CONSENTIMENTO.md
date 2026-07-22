# Teste de consentimento

Use uma janela anônima ou execute `CARTHAGE_PRIVACY.reset()` no console.

## Primeira visita

- confirmar que aparece apenas o cartão compacto no canto inferior;
- confirmar que o painel detalhado não abre sozinho;
- confirmar que o restante do site permanece navegável;
- confirmar ausência de requisições ao Meta Pixel e Google Analytics antes da escolha.

## Botões do cartão

- clicar no `×` e confirmar que o cartão fecha mantendo somente recursos necessários;
- redefinir e testar **Somente necessários**;
- redefinir e testar **Aceitar opcionais**;
- atualizar a página e confirmar que o cartão não reaparece após uma escolha salva.

## Painel detalhado

- redefinir e clicar em **Configurar**;
- confirmar que o painel abre somente após o clique;
- testar o `×`, o clique no fundo e a tecla `Escape`;
- ativar e desativar cada chave;
- clicar em **Salvar seleção**;
- confirmar que o painel fecha e a escolha fica preservada.

## Rastreamento

- ao rejeitar, confirmar que Pixel e Analytics continuam desligados;
- ao aceitar opcionais, confirmar carregamento do Meta Pixel `1570216137830619`;
- confirmar que o Google Analytics não carrega sem um ID real;
- confirmar que as preferências podem ser alteradas novamente pelo rodapé.
