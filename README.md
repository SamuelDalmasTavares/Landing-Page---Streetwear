# ALTOSCORRE — Lookbook

Site/lookbook da ALTOSCORRE, marca de streetwear brasileira. Apresenta a coleção 01 (Camisas) em uma única página HTML, sem backend e sem etapa de build.

## Como funciona

- **Desktop:** apresentação em slides de tela cheia, com navegação por teclado, mouse e bolinhas laterais.
- **Celular:** página de rolagem contínua, com animação suave de entrada ao rolar.
- **Camisas:** passe o mouse (ou toque) em cada peça para ver a frente. Ao clicar, abre um modal para consultar a peça no WhatsApp.

## Estrutura

- `index.html`: o site completo. As imagens e a fonte estão embutidas em base64, então ele funciona sozinho, sem depender de outras pastas.
- `lookbook.html`: cópia idêntica do `index.html`.
- `assets/`: fotos originais usadas no site.
- `css/`, `js/`: restos da versão antiga da loja, que o lookbook não usa.

## Como rodar

Abra o `index.html` no navegador (duplo clique), ou use um servidor local:

```bash
npx serve .
```

## Publicar (Netlify)

Envie só o arquivo `index.html`. Ele já inclui tudo.

## Tecnologias

HTML, CSS e JavaScript puros.
