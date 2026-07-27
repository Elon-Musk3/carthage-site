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

## Central detalhada

- redefinir e clicar em **Configurar escolhas** ou **Preferências** no rodapé;
- confirmar que a central abre somente após o clique;
- testar o `×`, o clique no fundo e a tecla `Escape`;
- alternar entre **Privacidade**, **Aparência**, **Leitura** e **Mídia**;
- ativar e desativar cada categoria opcional e confirmar que a escolha é aplicada imediatamente;
- testar tema original, escuro e claro;
- testar densidade confortável e compacta;
- testar texto padrão e ampliado;
- testar contraste padrão e alto;
- testar animações completas e reduzidas;
- testar reprodução automática ativada e desativada;
- fechar com **Concluir**, atualizar a página e confirmar que escolhas autorizadas foram preservadas;
- testar **Restaurar interface** e confirmar o retorno aos padrões visuais.

## Rastreamento

- ao rejeitar, confirmar que Pixel e Analytics continuam desligados;
- ao aceitar opcionais, confirmar carregamento do Meta Pixel `1570216137830619`;
- confirmar que o Google Analytics não carrega sem um ID real;
- confirmar que as preferências podem ser alteradas novamente pelo rodapé;
- confirmar que desligar autoplay pausa os vídeos e preserva os pôsteres;
- confirmar que movimento reduzido mantém todo o conteúdo visível.
