# Carthage — site revisado

Versão estática multipágina revisada em 26 de julho de 2026. A estrutura original de pastas e arquivos foi preservada; páginas, estilos, scripts, ícones e mídias foram refinados dentro dela.

## Principais correções

- portfólio público reduzido ao único projeto real: **Dárcio Eloi Advocacia**;
- imagens autorreferenciais, repetitivas ou com promessas inexistentes substituídas por diagramas HTML/CSS;
- rota antiga de aplicativo mantida apenas por compatibilidade, fora da navegação e do sitemap, com `noindex` e redirecionamento;
- os nove ícones dos megamenus foram redesenhados em uma única malha SVG 48 × 48, com significado específico, espessura uniforme e centralização óptica; o caractere usado como falso ícone em “Visão geral” foi eliminado;
- menus de **Soluções**, **Projetos** e **Carthage** usam dois estados de movimento: a primeira abertura distribui os itens em sequência curta; ao atravessar diretamente para outra categoria, o conjunto anterior se apaga enquanto o novo o substitui no mesmo painel, sem repetir a distribuição inicial;
- o menu aberto cria uma camada contextual discreta sobre a página, enquanto o cabeçalho reduz sua altura de forma fluida após a rolagem, preservando acesso e legibilidade;
- o megamenu continua disponível por cursor, clique, foco, setas, `Escape` e toque; no mobile permanece como acordeão e, com redução de movimento ativada, todas as transições decorativas são removidas;
- formulários alterados para `POST`, com tratamento local e descrição transparente do encaminhamento ao WhatsApp;
- FAQs aprofundadas, hierarquia semântica e landmarks legais corrigidos;
- rolagem por âncora, transições, foco do menu mobile, redução de movimento e carregamento progressivo aprimorados;
- o sistema de movimento deixou de usar uma única animação genérica: textos entram em sequência sem fragmentar palavras, cartões recebem revelação própria e iluminação contextual, mídias ganham profundidade sutil ligada à rolagem e os principais CTAs respondem ao cursor em dispositivos compatíveis;
- os efeitos de profundidade e magnetismo são desligados em telas pequenas ou com `prefers-reduced-motion`, mantendo todo o conteúdo imediatamente visível;
- demonstração real do projeto Dárcio Eloi integrada à homepage e ao estudo de caso, com loops automáticos próprios para desktop e mobile, MP4/WebM, pôsteres e quadro visual isolado, sem painel, controles, selos, textos externos ou interfaces empilhadas;
- selos decorativos removidos das imagens públicas do estudo de caso e rótulo redundante eliminado da arte principal sem alterar suas dimensões;
- sitemap, robots, metadados e eventos de rastreamento revisados.

## Publicação

Publique o conteúdo desta pasta mantendo os caminhos relativos. Antes de substituir a versão atual, faça uma cópia da publicação anterior, valide domínio e HTTPS e percorra o `CHECKLIST-PUBLICACAO.md`.

## Conteúdo futuro

O site não simula depoimentos, métricas ou clientes. Os vídeos desta versão usam somente gravações reais autorizadas do projeto publicado. O arquivo `CONTEUDOS-PENDENTES.md` registra o que foi concluído e o que ainda depende de fonte externa.
