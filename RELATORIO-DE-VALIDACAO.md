# Relatório de validação — Carthage

Validação executada em 28 de julho de 2026 sobre a versão 16 desta pasta.

## Resultado

- **22 páginas HTML verificadas**, incluindo homepage, soluções, serviços, portfólio, estudo de caso, contato, páginas legais e as três novas experiências responsivas.
- **Links e mídias locais:** 1.369 referências locais presentes no HTML foram verificadas; todos os destinos referenciados existem.
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
- **Teste integrado preservado na versão 16:** 42 verificações adicionais foram aprovadas, cobrindo seletores por cursor, exclusividade de painel, fechamento após `pointerleave`, sincronização com o campo nativo, sugestões de prazo, diagnóstico, comparador nos limites de 0%/100%, recorte dos rótulos por camada, persistência, preferências de interface, pausa de vídeo, Facebook e atualização do rodapé.
- **Navegação móvel dedicada:** as 22 páginas foram percorridas estruturalmente e os 16 cabeçalhos compartilhados foram confirmados com **Soluções** como primeiro item; abertura, fechamento pelo botão, toque fora, acordeões, restauração da rolagem em 920 px, ancoragem do cabeçalho, `pagehide`, `pageshow` e `popstate` foram exercitados sem falhas.
- **Cabeçalho após rolagem:** ao abrir o menu no meio da página, a geometria visível do cabeçalho é preservada em posição fixa durante o bloqueio temporário do conteúdo; o painel é ancorado abaixo dela e recebe altura compatível com o `visualViewport`.
- **Histórico sem bloqueio visual:** a classe de saída e qualquer temporizador pendente da transição são eliminados antes de congelar a página e novamente quando ela é restaurada; o retorno pelo botão Voltar não mantém a camada de carregamento nem o menu anterior.
- **Responsabilidade digital:** 12 verificações dedicadas confirmaram o núcleo editorial, os quatro pilares na ordem prevista, ícones SVG exclusivos, descrições, resultados, animação de entrada, reorganização responsiva, redução de movimento e remoção do antigo diagrama genérico.
- **Contraste dos valores:** os quatro cartões da seção branca usam fundo opaco claro, títulos em azul-marinho, parágrafos em azul-acinzentado escuro e números em ciano profundo; não dependem mais das variáveis de texto destinadas às superfícies escuras.
- **Teste dedicado de proteção editorial:** dez verificações comportamentais confirmaram `draggable="false"` em mídias e links associados, cancelamento de arraste e menu contextual sobre imagens, bloqueio de seleção em títulos e preservação da seleção em parágrafos e campos editáveis.
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
- **Comparador honesto:** o estado anterior é identificado como uma simulação didática de teste local no navegador, com HTML disponível e parte dos estilos ausente; o estado posterior usa a interface real publicada.
- **Comparador estável:** imagens não podem ser selecionadas ou arrastadas pelo navegador; o ponteiro é limitado entre 0% e 100%, o divisor permanece no extremo escolhido e a animação inicial percorre uma única vez o intervalo de 8% a 50%, sem pulsação ou retorno automático.
- **Rótulos do comparador:** as camadas anterior e posterior usam recortes complementares; seus rótulos são ocultados quando a região visível fica menor que o espaço necessário e não atravessam o divisor.
- **Formulários por cursor e teclado:** cada seletor abre por passagem do mouse em dispositivos compatíveis, fecha ao sair, substitui qualquer painel anterior e mantém clique, toque, foco, setas e `Escape`.
- **Central de escolhas:** tema, contraste, escala de texto, densidade, redução de movimento e autoplay foram exercitados no DOM; as mudanças são aplicadas de imediato e armazenadas localmente apenas quando a categoria de preferências é ativada.
- **Conteúdo legal:** as três páginas legais foram expandidas e continuam com exatamente um `main`, um `h1`, IDs únicos e links internos válidos.
- **Contato e rodapé:** o contato institucional é identificado como WhatsApp; a página de contato inclui o canal oficial **Carthage Inc no Facebook**, e o link de Facebook é inserido após Instagram em todas as páginas que usam o rodapé completo.
- **Presença digital:** o núcleo “Presença própria” contém quatro módulos semânticos e uma rota operacional; o protocolo seguinte contém cinco etapas completas, com ícones, responsabilidades, entregáveis e continuidade.
- **Presença digital responsiva:** o núcleo e seus quatro módulos respondem à largura interna do próprio painel. Na coluna lateral do hero, o resumo permanece horizontal e os ativos formam uma malha 2 × 2; abaixo de 330 px internos, o conjunto passa a uma coluna. Ícones, títulos, descrições e marcadores mantêm largura mínima flexível, sem corte horizontal nem palavras espremidas.
- **Geometria dos formulários:** a lista de cada seletor personalizado permanece ancorada ao gatilho correspondente, sem herdar a altura de outro campo na mesma linha da grade.
- **Proteção editorial seletiva:** todas as páginas que usam a estrutura pública recebem bloqueio de arraste nativo; mídias e logotipos não oferecem menu contextual de salvamento; títulos, navegação, categorias, subcategorias e controles não exibem seleção acidental.
- **Texto e formulários preservados:** parágrafos e listas explicativas continuam selecionáveis e copiáveis; inputs, áreas de texto, selects e conteúdo editável mantêm seleção, preenchimento, foco e interação normal.

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
