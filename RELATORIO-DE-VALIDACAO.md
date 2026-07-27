# Relatório de validação — Carthage

Validação executada em 26 de julho de 2026 sobre a versão final desta pasta.

## Resultado

- **19 páginas HTML verificadas**, incluindo homepage, soluções, serviços, portfólio, estudo de caso, contato e páginas legais.
- **Links locais e âncoras:** todos os destinos referenciados existem.
- **Assets:** CSS, JavaScript, SVGs, imagens, favicons e manifesto referenciados foram encontrados.
- **Imagens:** elementos públicos possuem texto alternativo e dimensões declaradas.
- **Semântica:** uma única região `main` e um único `h1` por página; tags estruturais balanceadas.
- **Formulários:** envio configurado como `POST`, validação preservada e sem dados pessoais na URL.
- **JavaScript:** oito arquivos aprovados na verificação sintática do Node.js.
- **Megamenus:** as 16 cópias públicas do cabeçalho possuem três grupos, nove itens e exatamente um SVG semântico por item; não restou nenhum caractere usado como ícone.
- **Família de ícones:** nove SVGs válidos, todos em malha 48 × 48, renderizados em conjunto para conferência de escala, traço, alinhamento e legibilidade.
- **Interação do menu:** abertura por `pointerenter`, fechamento temporizado por `pointerleave`, navegação por foco e setas, fechamento por `Escape` e fallback por clique/toque verificados no código e na estrutura DOM.
- **Estados de movimento do megamenu:** a primeira abertura aciona uma distribuição escalonada dos itens; a troca direta entre categorias usa saída e entrada cruzadas no mesmo ponto de ancoragem, substituindo o conteúdo sem reiniciar o escalonamento.
- **Linguagem de movimento:** os componentes são classificados em sequências de texto, superfícies, mídias e revelações simples; a homepage validou 33 elementos reveláveis, sete sequências de conteúdo, 22 etapas internas, três mídias com profundidade e 12 superfícies interativas.
- **Movimento responsável:** megamenu, revelações, profundidade, luz contextual e magnetismo possuem fallback explícito para `prefers-reduced-motion`, sem ocultar conteúdo nem deslocar o painel.
- **Teste comportamental do DOM:** abertura por hover, troca direta entre categorias, fechamento temporizado, fundo contextual, menu mobile, acordeões e estado de movimento reduzido foram executados sem falhas no teste automatizado incluído no fluxo de QA.
- **SEO:** títulos, descrições, canonical e metadados essenciais verificados.
- **Portfólio:** exatamente um projeto público real, **Dárcio Eloi Advocacia**.
- **Compatibilidade HTTP:** nove rotas críticas responderam com status `200` em servidor local.
- **Vídeo responsivo:** quatro arquivos finais verificados — WebM e MP4 para desktop (1920 × 1080) e mobile (1080 × 1920), todos com aproximadamente 13,1 segundos e sem áudio.
- **Integridade das mídias:** os quatro vídeos foram decodificados integralmente pelo FFmpeg, sem erro; pôsteres desktop e mobile foram encontrados e servidos com o MIME correto.
- **Comportamento responsável:** a integração inicia e repete automaticamente em condições normais, pausa mídias fora da tela, troca a proporção no breakpoint mobile e respeita economia de dados e `prefers-reduced-motion`.
- **Quadro limpo:** não existem controles, painéis, selos, títulos ou frases externas sobrepostos ao vídeo; as mudanças de tomada passam brevemente pelo fundo escuro e não empilham interfaces. Selos decorativos posicionados sobre as imagens do estudo de caso também foram removidos.
- **Arte do estudo de caso:** o rótulo redundante incorporado à imagem principal foi removido por retoque localizado, mantendo o arquivo em 1440 × 900 e preservando a composição do projeto real.

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

## Restrições mantidas de propósito

- Nenhum cliente, depoimento ou métrica foi inventado. Os vídeos desta versão utilizam apenas gravações reais e autorizadas do projeto publicado.
- A página antiga de aplicativo foi preservada apenas como rota de compatibilidade, com `noindex` e fora da navegação pública.
- Mídias antigas não utilizadas continuam armazenadas para preservar a estrutura recebida, mas não são exibidas nas seções corrigidas.
- Itens que ainda dependem de material real ou autorização específica estão documentados em `CONTEUDOS-PENDENTES.md`.

Antes da publicação definitiva, ainda é necessário confirmar as configurações reais de domínio, hospedagem, mensuração, canais de contato e consentimento jurídico.
Também permanece recomendada a conferência visual final nos navegadores e aparelhos reais listados no checklist; o navegador headless do ambiente de montagem não pôde ser baixado nesta execução.
