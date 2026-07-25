# Lemem FC — Site Oficial

Site institucional do **Lemem Futebol Clube**, fundado em 2016 na Zona Sul de São Paulo. Apresenta a história do clube, títulos conquistados, elenco/diretoria, produtos oficiais e patrocinadores.

🔗 Produção: `www.criastudiostore.com.br` *(ajuste este link se o domínio for outro)*

## Estrutura do projeto

```
├── index.html              # Página única do site
├── favicon.png
├── README.md
└── assets/
    ├── css/
    │   └── style.css        # Todos os estilos do site
    ├── js/
    │   └── main.js           # Menu mobile, vídeos, animações de scroll
    ├── img/
    │   ├── logos/             # Logo do clube, patrocinadores, torcida
    │   ├── titulos/            # Fotos das galerias de cada título
    │   ├── gestao/               # Fotos da diretoria/comissão técnica
    │   ├── produtos/               # Fotos dos produtos oficiais
    │   └── momentos/                # Fotos da seção "Momentos Inesquecíveis"
    └── video/
        ├── taca-torcida.mp4
        ├── taca-comemoracao.mp4
        └── momentos/
            ├── video1.mp4
            ├── video2.mp4
            └── video3.mp4
```

Antes o repositório tinha todos os arquivos soltos na raiz (HTML + ~40 imagens/vídeos misturados) e o CSS/JS embutido no próprio HTML. Essa reorganização separa **conteúdo** (HTML), **estilo** (CSS) e **comportamento** (JS), e agrupa as mídias por seção — mais fácil de manter e de trocar fotos/vídeos no futuro.

## O que foi otimizado

- **Mídia comprimida**: o projeto caiu de ~59 MB para ~25 MB (imagens redimensionadas para o tamanho real de exibição, PNGs de fotos convertidos para JPEG, vídeos recodificados em H.264 com bitrate menor). Isso deixa o carregamento bem mais rápido, principalmente no celular.
- **CSS e JS externos**, fora do HTML — mais fácil de editar e o navegador pode cachear os arquivos entre visitas.
- **Menu mobile (hambúrguer)**: antes o menu simplesmente sumia em telas pequenas sem nenhuma forma de navegação; agora abre um menu deslizante.
- **`loading="lazy"`** em imagens fora da primeira tela, para não carregar tudo de uma vez.
- **SEO básico**: `<meta description>`, Open Graph para compartilhamento em redes sociais, favicon.
- **Acessibilidade**: `aria-label` nos botões de vídeo e no menu, foco visível no teclado, respeito a `prefers-reduced-motion`.
- **Botão "voltar ao topo"** e pequenas animações de entrada ao rolar a página.

## Como editar

- **Texto e conteúdo** → `index.html`
- **Cores, espaçamentos, fontes** → `assets/css/style.css` (as cores principais estão nas variáveis `:root` no topo do arquivo)
- **Comportamento (menu, vídeos, animações)** → `assets/js/main.js`
- **Trocar uma foto/vídeo** → substitua o arquivo dentro da pasta correspondente em `assets/img/` ou `assets/video/`, mantendo o mesmo nome (ou atualize o `src` no HTML se mudar o nome)

## Publicando

O site é 100% estático (HTML/CSS/JS puro, sem build). Basta apontar a Vercel (ou qualquer hospedagem estática) para a raiz do repositório — não é necessário nenhum comando de build.
