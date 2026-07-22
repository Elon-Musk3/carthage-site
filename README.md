# Carthage — plataforma digital multipágina

Reformulação integral do site institucional, preservando a integração com WhatsApp, consentimento, páginas legais e base estática compatível com Vercel.

## Dados centrais

- Domínio: `https://www.carthage.com.br`
- E-mail: `carthage.incorporated@gmail.com`
- WhatsApp: `(62) 99981-0066`
- Instagram: `@carthage.inc`
- Meta Pixel: `1570216137830619`
- Google Analytics: não configurado; nenhum ID foi inventado.
- Aplicativo: URL pendente em `js/config.js`.

## Configuração principal

Edite `js/config.js` para atualizar:

- dados empresariais;
- promoção e quantidade restante;
- campanhas;
- Meta Pixel e futuro GA4;
- URL do aplicativo;
- arquivos de vídeo;
- autorização do estudo de caso Dárcio Eloi.

## Publicação do estudo de caso

`PROJECTS_CONFIG.darcioEloiPublished` permanece `false`.

Altere para `true` somente após autorização expressa e depois inclua conteúdo público e aprovado. A rota está fora do sitemap e bloqueada no `robots.txt`.

## Promoção

A quantidade de vagas é manual. Quando a condição terminar:

1. defina `PROMOTION_CONFIG.enabled: false`;
2. defina `SITE_CONFIG.promotionEnabled: false`;
3. revise a página `promocao.html`;
4. retire anúncios e CTAs externos que apontem para a oferta.

## Aplicativo e vídeo

O pacote não inventa URL, loja, download, avaliação, login ou funcionalidade. Configure `SITE_CONFIG.appUrl` e `MEDIA_CONFIG` quando os materiais oficiais existirem.

## Estrutura

- 19 páginas HTML, incluindo campanhas, legal, 404 e estudo de caso controlado;
- CSS dividido em tokens/base, componentes, páginas, responsividade e consentimento;
- JavaScript dividido em configuração, privacidade, rastreamento, navegação, animações, formulários e comportamentos de página;
- sitemap, robots, manifest e configuração Vercel;
- roteiros de vídeo e instruções de mídia.

## Teste local

Use um servidor local; não abra apenas pelo protocolo `file://`.

Exemplo:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Correção do painel de privacidade

A primeira visita agora exibe apenas um cartão compacto no canto inferior, sem bloquear o conteúdo. O painel detalhado abre somente quando o visitante escolhe **Configurar** ou acessa as preferências pelo rodapé.

Também foi corrigida a regra global do atributo HTML `hidden`. O erro anterior fazia componentes ocultos permanecerem visualmente abertos, afetando o consentimento e outros controles de abrir/fechar do site.
