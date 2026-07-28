# Carthage — site revisado · versão 16

Versão estática multipágina revisada em 28 de julho de 2026. A estrutura original de pastas e arquivos foi preservada; páginas, estilos, scripts, ícones e mídias foram refinados dentro dela.

## Principais correções

- portfólio público reduzido ao único projeto real: **Dárcio Eloi Advocacia**;
- imagens autorreferenciais, repetitivas ou com promessas inexistentes substituídas por diagramas HTML/CSS;
- rota antiga de aplicativo mantida apenas por compatibilidade, fora da navegação e do sitemap, com `noindex` e redirecionamento;
- os nove ícones dos megamenus foram redesenhados em uma única malha SVG 48 × 48, com significado específico, espessura uniforme e centralização óptica; o caractere usado como falso ícone em “Visão geral” foi eliminado;
- menus de **Soluções**, **Projetos** e **Carthage** usam dois estados de movimento: a primeira abertura distribui os itens em sequência curta; ao atravessar diretamente para outra categoria, o conjunto anterior se apaga enquanto o novo o substitui no mesmo painel, sem repetir a distribuição inicial;
- o menu aberto cria uma camada contextual discreta sobre a página, enquanto o cabeçalho reduz sua altura de forma fluida após a rolagem, preservando acesso e legibilidade;
- o megamenu continua disponível por cursor, clique, foco, setas, `Escape` e toque; no mobile permanece como acordeão e, com redução de movimento ativada, todas as transições decorativas são removidas;
- o menu mobile agora abre sempre a partir de **Soluções**, mantém o cabeçalho completo visível mesmo depois de a página ter sido rolada, preserva a posição de leitura e usa uma camada externa que permite fechá-lo ao tocar fora;
- abrir e fechar o painel não altera mais o contêiner de rolagem de forma incompatível com o cabeçalho `sticky`; posição, largura e área útil são calculadas novamente conforme viewport, barra do navegador e orientação do aparelho;
- botão de menu, toque externo, links, `Escape`, mudança de orientação, retorno do histórico e restauração da página fecham e limpam o mesmo estado compartilhado, evitando painel solto, conteúdo bloqueado ou acordeões presos;
- a navegação móvel recebeu diálogo identificado, foco contido, indicadores sincronizados, rolagem interna com contenção e áreas seguras para aparelhos com recortes de tela;
- a transição entre páginas é removida de qualquer entrada preservada no histórico em `pageshow`, `pagehide` e `popstate`; o botão Voltar do navegador não pode mais restaurar indefinidamente a tela de carregamento;
- formulários alterados para `POST`, com tratamento local e descrição transparente do encaminhamento ao WhatsApp;
- FAQs aprofundadas, hierarquia semântica e landmarks legais corrigidos;
- rolagem por âncora, transições, foco do menu mobile, redução de movimento e carregamento progressivo aprimorados;
- o sistema de movimento deixou de usar uma única animação genérica: textos entram em sequência sem fragmentar palavras, cartões recebem revelação própria e iluminação contextual, mídias ganham profundidade sutil ligada à rolagem e os principais CTAs respondem ao cursor em dispositivos compatíveis;
- o carregamento das revelações foi corrigido para preservar um quadro inicial realmente oculto: o conteúdo acima da dobra entra primeiro e cada bloco posterior só é liberado quando alcança a região ativa da janela, com `IntersectionObserver`, fallback de rolagem e restauração segura de posição;
- a mídia real do projeto em destaque deixou de aparecer isolada: agora possui um bloco editorial externo com identificação do caso, contexto, decisões de arquitetura, adaptação por tela, objetivo de conversão e acessos para o estudo e o projeto publicado;
- os três modelos de responsividade deixaram de usar botões ilustrativos: **Desktop**, **Tablet** e **Celular** agora são links reais para páginas próprias, com composição visual, critérios de legibilidade, interação, reorganização, acessibilidade, desempenho e validação;
- as páginas de **Tablet** e **Celular** usam capturas independentes do projeto publicado, renderizadas respectivamente em viewports reais de 768 × 1024 px e 390 × 844 px @2x; nenhuma delas reaproveita ou recorta a captura desktop;
- a oferta técnica foi ampliada e explicada sem tratar todas as entregas como “site”: páginas, portais, sistemas, SaaS, aplicativos/PWA, bancos de dados, APIs, integrações, automações e painéis administrativos possuem responsabilidades e níveis de escopo distintos;
- o modelo comercial informado foi organizado em uma seção própria e em perguntas detalhadas: sites de referência entre **R$ 925 e R$ 1.499**, alterações avulsas de **R$ 10, R$ 20 ou R$ 50**, manutenção recorrente de **R$ 40 a R$ 50/mês** e painéis de autonomia sob diagnóstico e orçamento específico;
- os valores são apresentados como referências sujeitas a escopo, sem presumir domínio, hospedagem, licenças, infraestrutura, serviços de terceiros ou suporte fora da proposta;
- os efeitos de profundidade e magnetismo são desligados em telas pequenas ou com `prefers-reduced-motion`, mantendo todo o conteúdo imediatamente visível;
- demonstração real do projeto Dárcio Eloi integrada à homepage e ao estudo de caso, com loops automáticos próprios para desktop e mobile, MP4/WebM, pôsteres e quadro visual isolado, sem painel, controles, selos, textos externos ou interfaces empilhadas;
- a gravação horizontal foi reprocessada para remover a barra de rolagem incorporada na borda direita, e o HTML já entrega fontes de vídeo antes da inicialização progressiva do JavaScript para reduzir o risco de a mídia parecer estática;
- o loop silencioso recebeu uma estratégia adicional de recuperação: autoplay, mudo, repetição, reprodução inline, fontes já declaradas no HTML, nova tentativa após restauração da página e nova tentativa silenciosa na primeira interação quando o navegador tiver bloqueado a carga inicial;
- os dois formulários agora compartilham seletores próprios, navegáveis por teclado, com lista estilizada, foco visível e sincronização com o campo nativo; o prazo passou a aceitar texto livre e referências rápidas de 1–2, 7, 30, 60 ou mais de 60 dias;
- a confirmação de privacidade recebeu uma caixa própria, sem o retângulo vertical provocado pelo foco do input nativo;
- o diagnóstico visual de contato foi reconstruído com quatro cartões explicativos e ícones vetoriais; WhatsApp, e-mail, Instagram e a página oficial **Carthage Inc** no Facebook foram realinhados e ganharam ícones com contraste e indicação externa coerentes;
- textos de apoio, atributos e metadados deixaram de imitar botões: somente ações reais preservam aparência e comportamento de controle;
- a demonstração de responsividade em `criacao-de-sites.html` passou a trocar entre três capturas independentes do projeto — desktop, tablet e celular — com moldura, proporção, texto de estado e seleção visível próprios;
- as páginas de responsividade exibem o endereço clicável do projeto publicado, inclusive nas experiências de tablet e celular;
- quatro ilustrações repetitivas ou com texto ilegível foram substituídas por composições sem logotipo, sem nome da Carthage, sem frases incorporadas e sem falsos controles; o significado é apresentado em legendas HTML externas e acessíveis;
- o comparador de reformulação deixou de sugerir um “antes” fictício: ele confronta uma simulação identificada de teste no navegador — HTML disponível e parte do acabamento visual ausente — com a homepage real publicada;
- o divisor parte de 8% e percorre suavemente o quadro até 50% na primeira entrada em tela, sem pulsação concorrente; depois da primeira interação, passa ao controle integral do visitante;
- o comparador bloqueia seleção e arraste nativo, limita matematicamente o ponteiro entre 0% e 100%, permanece exatamente no limite escolhido e continua acessível por faixa e teclado;
- as camadas e os rótulos do comparador agora compartilham o mesmo recorte; “Antes” e “Depois” desaparecem quando sua área deixa de comportá-los e nenhum texto de uma etapa vaza sobre a imagem oposta;
- os seletores dos formulários também respondem a `hover` em dispositivos com cursor preciso: a categoria entra com transição curta, fecha ao retirar o ponteiro e nunca deixa dois painéis abertos simultaneamente; toque, clique e teclado continuam independentes do comportamento de cursor;
- diagramas antes compostos por caixas vazias foram substituídos por mapas editoriais com ícones, numeração, responsabilidades, entregáveis e relações legíveis nas páginas de Soluções e Presença digital;
- a arquitetura de **Presença própria** foi reconstruída como um painel editorial com núcleo, quatro ativos documentados e rota operacional; o fluxo de cinco etapas agora explica responsabilidade, saída e continuidade em vez de exibir formas geométricas vazias;
- o painel de **Presença própria** passou a responder à largura real da coluna do hero, não apenas à largura geral da janela: o núcleo ocupa um resumo horizontal compacto, os quatro ativos formam uma malha 2 × 2 legível e, quando o próprio componente fica estreito, migram para uma coluna sem cortar ícones, palavras ou cartões;
- o antigo conjunto cru de cinco caixas da página **Sobre** foi reconstruído como um sistema editorial de responsabilidade digital: núcleo explicativo, quatro pilares numerados com ícones vetoriais próprios, descrições, resultados, conexões visuais, entrada escalonada, respostas ao cursor e reorganização responsiva;
- os quatro cartões editoriais de **Clareza**, **Coerência**, **Preservação** e **Transparência** receberam superfície clara própria, texto de alto contraste, numeração legível, acento cromático e profundidade compatível com a seção branca, eliminando o aspecto lavado produzido pela antiga transparência escura;
- o diagnóstico de soluções passou a apresentar justificativa, quatro entregáveis e uma ação específica para cada uma das seis situações, evitando um botão genérico que retornava à própria página;
- os quatro canais da página de contato receberam uma malha fixa para centralização dos ícones, alinhamento do texto e indicador externo; o rodapé diferencia explicitamente **Contato pelo WhatsApp** e inclui Facebook logo após Instagram;
- os seletores personalizados permanecem ancorados imediatamente abaixo do respectivo campo mesmo quando outro campo da mesma linha aumenta a altura da grade;
- imagens, vídeos, SVGs, logotipos e demais mídias não iniciam mais o arraste nativo, o menu contextual de salvamento é bloqueado sobre essas superfícies e os links que envolvem mídia também recebem `draggable="false"`;
- títulos, menus, categorias, subcategorias, breadcrumbs, botões e rótulos estruturais não exibem seleção de texto; parágrafos, listas explicativas, campos, áreas editáveis e demais conteúdos de leitura continuam selecionáveis e copiáveis;
- a Central de Privacidade deixou de ser uma coleção de chaves sem efeito: tema, contraste, tamanho do texto, densidade, intensidade de movimento e reprodução automática agora são aplicados imediatamente e persistidos localmente quando autorizados;
- Política de Privacidade, Política de Cookies e Termos de Uso foram ampliados com bases, finalidades, retenção, fornecedores, transferências, segurança, direitos, tecnologias, escopo, preços de referência, alterações, propriedade intelectual, serviços externos e versionamento próprios da operação descrita pela Carthage;
- as páginas legais usam uma composição tipográfica mais densa, tabelas, notas e chamadas de atenção sem sacrificar legibilidade, navegação por títulos ou adaptação para telas menores;
- selos decorativos removidos das imagens públicas do estudo de caso e rótulo redundante eliminado da arte principal sem alterar suas dimensões;
- sitemap, robots, metadados e eventos de rastreamento revisados.

## Publicação

Publique o conteúdo desta pasta mantendo os caminhos relativos. Antes de substituir a versão atual, faça uma cópia da publicação anterior, valide domínio e HTTPS e percorra o `CHECKLIST-PUBLICACAO.md`.

## Conteúdo futuro

O site não simula depoimentos, métricas ou clientes. Os vídeos desta versão usam somente gravações reais autorizadas do projeto publicado. O arquivo `CONTEUDOS-PENDENTES.md` registra o que foi concluído e o que ainda depende de fonte externa.
