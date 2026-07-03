# Carthage — site institucional atualizado

Este pacote mantém o layout, a estrutura e o conteúdo do site original e acrescenta uma camada completa de privacidade, cookies e páginas legais.

## Telefone oficial configurado

- Exibição: **(62) 99981-0066**
- Formato usado nos links do WhatsApp: **5562999810066**

Todos os links do WhatsApp do `index.html` foram corrigidos para esse número.

## Estrutura

```text
carthage_site_extraordinario/
├── index.html
├── style.css
├── script.js
├── consent.css
├── consent.js
├── privacy-config.js
├── robots.txt
├── sitemap.xml
├── CHECKLIST-PUBLICACAO.md
├── TESTE-CONSENTIMENTO.md
├── assets/
│   ├── carthage-logo.png
│   ├── favicon.svg
│   └── og-image.svg
└── legal/
    ├── index.html
    ├── privacidade.html
    ├── cookies.html
    ├── termos.html
    ├── legal.css
    └── legal.js
```

## O que foi acrescentado

- Política de Privacidade completa em página própria.
- Política de Cookies completa em página própria.
- Termos de Uso revisados em página própria.
- Central de Privacidade em `legal/index.html`.
- Banner de consentimento com:
  - Aceitar todos;
  - Rejeitar opcionais;
  - Personalizar;
  - alteração posterior pelo rodapé.
- Categorias separadas:
  - necessários;
  - analíticos;
  - publicitários;
  - preferências.
- Google Analytics bloqueado antes do consentimento analítico.
- Meta Pixel bloqueado antes do consentimento publicitário.
- Registro da escolha no `localStorage`.
- Links legais no rodapé preservados.
- Botão “Preferências de privacidade” adicionado ao rodapé.
- `robots.txt` e `sitemap.xml`.
- Checklists de publicação e teste.

## Meta Pixel

O Pixel configurado é:

```text
1066622929266871
```

Ele está em `privacy-config.js` e só é carregado após consentimento publicitário.

## Google Analytics 4

O identificador do GA4 não foi fornecido. Por isso, o Analytics permanece tecnicamente preparado, porém desativado.

Abra `privacy-config.js` e substitua:

```js
googleAnalyticsId: ''
```

por algo no formato:

```js
googleAnalyticsId: 'G-XXXXXXXXXX'
```

Não cole o snippet bruto do Google Analytics dentro do `index.html`, pois isso faria a ferramenta carregar antes do consentimento.

## Como editar no VS Code e publicar no GitHub

1. Extraia o arquivo `.zip`.
2. Abra a pasta inteira no VS Code: **Arquivo → Abrir Pasta**.
3. Instale ou use a extensão **Live Server**.
4. Abra `index.html` pelo Live Server.
5. Teste o site e o banner conforme `TESTE-CONSENTIMENTO.md`.
6. Substitua no repositório do GitHub os arquivos antigos pelos arquivos desta pasta.
7. Faça commit e push.
8. Aguarde a publicação da hospedagem.
9. Verifique as URLs públicas.

## URL para usar na Meta

```text
https://carthage.com.br/legal/privacidade.html
```

## Dados públicos usados nas páginas legais

- Operação: Carthage.
- Responsável: Gustavo Luiz De Bessa Costa.
- E-mail: gustavoluizbessacosta@gmail.com.
- WhatsApp: (62) 99981-0066.
- CNPJ: operação em formalização; nenhum número foi inventado.

## Observação jurídica

Os textos foram estruturados para oferecer transparência e servir como base operacional. Uma revisão profissional continua recomendável quando o CNPJ for emitido, houver contratação de equipe, novos fornecedores, mudanças nos serviços ou tratamento de dados em maior escala.
