# Relatório de validação — Carthage

Validação executada em 27 de julho de 2026 sobre a versão 9 desta pasta.

## Resultado

- **22 páginas HTML verificadas**, incluindo homepage, soluções, serviços, portfólio, estudo de caso, contato, páginas legais e as três novas experiências responsivas.
- **Links e mídias locais:** 1.499 referências verificadas; todos os destinos locais referenciados existem.
- **Assets:** CSS, JavaScript, SVGs, imagens, favicons e manifesto referenciados foram encontrados.
- **Imagens:** elementos públicos possuem texto alternativo e dimensões declaradas.
- **Semântica:** uma única região `main` e um único `h1` por página; tags estruturais balanceadas.
- **Formulários:** envio configurado como `POST`, validação preservada e sem dados pessoais na URL.
- **JavaScript:** oito arquivos aprovados na verificação sintática do Node.js.
- **CSS:** cinco folhas aprovadas pelo parser do CSS Tree.
- **HTML:** todas as 22 páginas aprovadas pelo `html-validate` após desativar somente regras opinativas incompatíveis com o projeto, como sintaxe XHTML legada e a proibição genérica de autoplay.
- **Megamenus:** as 16 cópias públicas do cabeçalho possuem três grupos, nove itens e exatamente um SVG semântico por item; não restou nenhum caractere usado como ícone.
- **Família de ícones:** nove SVGs válidos, todos em malha 48 × 48, renderizados em conjunto para conferência de escala, traço, alinhamento e legibilidade.
- **Interação do menu:** abertura por `pointerenter`, fechamento temporizado por `pointerleave`, navegação por foco e setas, fechamento por `Escape` e fallback por clique/toque verificados no código e na estrutura DOM.
- **Estados de movimento do megamenu:** a primeira abertura aciona uma distribuição escalonada dos itens; a troca direta entre categorias usa saída e entrada cruzadas no mesmo ponto de ancoragem, substituindo o conteúdo sem reiniciar o escalonamento.
- **Linguagem de movimento:** os componentes são classificados em sequências de texto, superfícies, mídias e revelações simples; a homepage validou 51 elementos reveláveis, dez sequências de conteúdo, 32 etapas internas, três mídias com profundidade e 25 superfícies interativas.
- **Revelação durante a rolagem:** um teste dedicado manteve um bloco abaixo da dobra no estado `queued`, revelou apenas o conteúdo inicialmente visível e confirmou a entrada do bloco seguinte após um evento real de rolagem. O motor também possui fallback por `requestAnimationFrame` para navegadores ou situações em que o observador não dispare como esperado.
- **Movimento responsável:** megamenu, revelações, profundidade, luz contextual e magnetismo possuem fallback explícito para `prefers-reduced-motion`, sem ocultar conteúdo nem deslocar o painel.
- **Teste comportamental do DOM:** abertura por hover, troca direta entre categorias, fechamento temporizado, fundo contextual, menu mobile, acordeões e estado de movimento reduzido foram executados sem falhas no teste automatizado incluído no fluxo de QA.
- **Teste integrado da versão 9:** 38 verificações adicionais foram aprovadas, cobrindo seletores por cursor, exclusividade de painel, fechamento após `pointerleave`, sincronização com o campo nativo, sugestões de prazo, diagnóstico, comparador nos limites de 0%/100%, persistência, preferências de interface, pausa de vídeo e atualização do rodapé.
- **SEO:** títulos, descrições, canonical e metadados essenciais verificados.
- **Experiências responsivas:** `responsividade-desktop.html`, `responsividade-tablet.html` e `responsividade-celular.html` possuem título, descrição, canonical, um único `h1`, imagens reais, diagramas semânticos, critérios técnicos, links cruzados e CTAs válidos. Tablet e celular usam capturas independentes do projeto publicado em 768 × 1024 px e 390 × 844 px @2x, sem recorte da mídia desktop.
- **Conteúdo comercial:** a homepage e a página de soluções distinguem sites, portais, sistemas, SaaS, aplicativos/PWA, dados, APIs, integrações e automações; a faixa de referência foi padronizada para **R$ 925–R$ 1.499**, com ressalvas de escopo e custos externos.
- **Portfólio:** exatamente um projeto público real, **Dárcio Eloi Advocacia**.
- **Compatibilidade HTTP:** doze rotas críticas e três ativos representativos responderam com status `200` e MIME coerente em servidor local.
- **Vídeo responsivo:** quatro arquivos finais verificados — WebM e MP4 para desktop (1920 × 1080) e mobile (1080 × 1920), todos com aproximadamente 13,1 segundos e sem áudio.
- **Limpeza da gravação horizontal:** a faixa da barra de rolagem incorporada no arquivo original foi removida, o quadro útil foi recomposto para 1920 × 1080 e os dois codecs mantêm SAR 1:1 e DAR 16:9.
- **Integridade das mídias:** os quatro vídeos foram decodificados integralmente pelo FFmpeg, sem erro; pôsteres desktop e mobile foram encontrados e servidos com o MIME correto.
- **Autoplay reforçado:** a integração inicia sem som e sem controles, repete automaticamente, pausa fora da tela, troca a fonte no breakpoint mobile e tenta se recuperar depois de `pageshow`, retorno de visibilidade ou primeira interação quando o navegador bloqueia a tentativa inicial.
- **Quadro limpo:** não existem controles, painéis, selos, títulos ou frases externas sobrepostos ao vídeo; as mudanças de tomada passam brevemente pelo fundo escuro e não empilham interfaces. Selos decorativos posicionados sobre as imagens do estudo de caso também foram removidos.
- **Arte do estudo de caso:** o rótulo redundante incorporado à imagem principal foi removido por retoque localizado, mantendo o arquivo em 1440 × 900 e preservando a composição do projeto real.
- **Formulários:** os dois formulários usam o mesmo componente de seleção estilizado, preservam o `<select>` nativo para envio e validação, permitem teclado e foco, oferecem prazo editável com seis referências rápidas e usam uma confirmação visual própria sem retângulo de foco incorreto.
- **Demonstração por dispositivo:** desktop, tablet e celular carregam arquivos distintos e texto alternativo próprio; a troca atualiza moldura, proporção, mídia, estado selecionado e descrição ao vivo.
- **Ilustrações sem ruído textual:** quatro peças foram revisadas visualmente em resolução original. Não incluem marca, nome da empresa, textos pequenos incorporados, falsos botões ou promessa de resultado.
- **Comparador honesto:** o estado anterior é identificado como mapa estrutural anterior ao design, e o estado posterior usa a interface real publicada; o divisor possui controle por faixa, ponteiro e teclado.
- **Comparador estável:** imagens não podem ser selecionadas ou arrastadas pelo navegador, o divisor permanece no limite escolhido e o estado anterior é um protótipo estrutural próprio em HTML/CSS, sem alegar a existência de um site antigo.
- **Formulários por cursor e teclado:** cada seletor abre por passagem do mouse em dispositivos compatíveis, fecha ao sair, substitui qualquer painel anterior e mantém clique, toque, foco, setas e `Escape`.
- **Central de escolhas:** tema, contraste, escala de texto, densidade, redução de movimento e autoplay foram exercitados no DOM; as mudanças são aplicadas de imediato e armazenadas localmente apenas quando a categoria de preferências é ativada.
- **Conteúdo legal:** as três páginas legais foram expandidas e continuam com exatamente um `main`, um `h1`, IDs únicos e links internos válidos.
- **Rodapé:** o contato institucional é identificado como WhatsApp, e o link de Facebook é inserido após Instagram em todas as páginas que usam o rodapé completo.

## Rotas críticas testadas

- `/index.html`
- `/solucoes.html`
- `/portfolio.html`
- `/projeto-darcio-eloi.html`
- `/contato.html`
- `/iniciar-projeto.html`
- `/processo.html`
- `/promocao.html`
- `/politica-de-privacidade.html`
- `/responsividade-desktop.html`
- `/responsividade-tablet.html`
- `/responsividade-celular.html`

## Restrições mantidas de propósito

- Nenhum cliente, depoimento ou métrica foi inventado. Os vídeos desta versão utilizam apenas gravações reais e autorizadas do projeto publicado.
- A página antiga de aplicativo foi preservada apenas como rota de compatibilidade, com `noindex` e fora da navegação pública.
- Mídias antigas não utilizadas continuam armazenadas para preservar a estrutura recebida, mas não são exibidas nas seções corrigidas.
- Itens que ainda dependem de material real ou autorização específica estão documentados em `CONTEUDOS-PENDENTES.md`.

Antes da publicação definitiva, ainda é necessário confirmar as configurações reais de domínio, hospedagem, mensuração, canais de contato e consentimento jurídico.
Também permanece obrigatória a conferência visual final nos navegadores e aparelhos reais listados no checklist. O Chromium headless do ambiente de montagem não pôde ser baixado nesta execução; por isso o relatório não afirma uma inspeção visual automatizada de navegador que não ocorreu.
