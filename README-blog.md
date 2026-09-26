# Como publicar um artigo no blog

## Passo a passo

### 1. Crie o arquivo Markdown

Copie o arquivo modelo:

```
content/blog/modelo.md → content/blog/meu-artigo.md
```

O nome do arquivo vira o slug da URL:
`meu-artigo.md` → `fegsegurogarantia.com.br/blog/meu-artigo/`

---

### 2. Preencha o frontmatter (o cabeçalho entre `---`)

| Campo | Obrigatório | O que é |
|---|---|---|
| `slug` | Sim | Igual ao nome do arquivo (sem `.md`) |
| `title` | Sim | Título do artigo (vira o H1 da página) |
| `description` | Sim | Meta description para o Google (140-160 chars) |
| `canonical` | Sim | URL completa com barra final: `https://fegsegurogarantia.com.br/blog/seu-slug/` |
| `date` | Sim | Data no formato `AAAA-MM-DD` |
| `category` | Sim | Uma das 8 categorias válidas (lista abaixo). O build **quebra** se o valor não estiver na lista |
| `readingTime` | Sim | Tempo estimado de leitura em minutos |
| `author` | Sim | Nome do autor |
| `keywords` | Não | Palavras-chave separadas por vírgula |
| `lead` | Não | Parágrafo de abertura destacado (aparece em itálico no topo) |
| `image` | Não | Capa própria (1200x630, JPEG ou PNG). Se ausente, o build gera uma capa SVG sozinho |
| `featured` | Não | `true` destaca o artigo no topo do `/blog/`. Use em no máximo 3 ao mesmo tempo |
| `cta_titulo` | Não | Título do banner de CTA no final do artigo (padrão genérico se ausente) |
| `cta_texto` | Não | Texto do CTA — use texto específico do tema para melhor conversão |
| `faq` | Não | Lista de perguntas/respostas para o schema FAQPage do Google |

**Categorias válidas** (exatamente assim, com acento):

```
Licitação
Execução de Contrato
Judicial
Trabalhista
Locatício
Responsabilidade Civil
Cyber
Para o seu negócio
```

---

### 3. Escreva o conteúdo

- O corpo começa logo depois do segundo `---`
- **Use `##` para a primeira seção** — o H1 já vem do campo `title`
- Nunca use `# ` (H1) no corpo — o build avisa no console se acontecer
- Parágrafos separados por linha em branco
- HTML pode ser inserido diretamente, mas **sem indentação** (sem espaços no início da linha)

---

### 4. Rode o build

```bash
node scripts/build-legacy.mjs
```

O artigo aparece automaticamente na listagem `/blog/` e no `sitemap.xml`.

Rode o build antes de commitar. Ele valida o frontmatter e avisa no console se algo
estiver errado — é mais barato descobrir aqui do que depois do deploy.

**Se o build falhar com `ENOTEMPTY` ou `EPERM` em `dist/`:** o iCloud costuma criar
cópias de conflito com sufixo ` 2` (`dist/blog 2`, `dist/materiais 2`) que o `rm -rf`
do build não consegue remover. Mova ou apague essas pastas pelo Finder e rode de novo.

---

### 4b. Mexeu em `src/` (páginas, modalidades, componentes)? Regere o bundle e os snapshots

A Hostinger não compila o `src/`: o build copia o bundle pronto de `legacy/assets/`
e os snapshots HTML de `legacy/prerender/` (o conteúdo que o Google lê sem executar
JavaScript). Os dois vão para o git. Depois de qualquer mudança em `src/`:

```bash
npx vite build
cp dist/assets/index-*.js  legacy/assets/index-Bhzvy-ks.js
cp dist/assets/index-*.css legacy/assets/index-BRVWEG0Z.css
node scripts/prerender.mjs
node scripts/build-legacy.mjs
```

Os nomes `index-Bhzvy-ks.js` e `index-BRVWEG0Z.css` são fixos porque os HTMLs
apontam para eles. Artigo novo no blog não precisa disso: só o passo 4.

---

### 5. Publique

O deploy é automático. Basta o código entrar na `main`:

```bash
git checkout -b blog/AAAA-MM-DD
git add content/blog/
git commit -m "Descricao do que entrou"
git push -u origin blog/AAAA-MM-DD
gh pr create --fill
```

Depois do merge, a Hostinger roda o build e publica sozinha — leva menos de um minuto.
**Não é preciso subir nada no File Manager.** A pasta `dist/` nem vai para o
repositório (está no `.gitignore`); ela é regerada no servidor a partir dos `.md`.

Confira a URL no ar antes de considerar publicado.

---

### 6. Peça a indexação no Google

Em [Search Console](https://search.google.com/search-console) → **Inspeção de URL**,
cole a URL do artigo e clique em **Solicitar indexação**.

O `sitemap.xml` já está enviado e o Google relê de tempos em tempos, mas o pedido
direto costuma antecipar a primeira aparição em dias.

---

## Regras de URL

- **Não mude o slug depois de publicar** — a URL já pode estar indexada no Google
- O slug deve usar apenas letras minúsculas, números e hífens: `meu-artigo-2026`
- A URL completa sempre termina com barra: `/blog/meu-artigo/`

## Estrutura dos arquivos

```
content/
  blog/
    modelo.md                          ← Arquivo de exemplo
    o-que-e-seguro-garantia.md         ← Artigos existentes
    garantia-adicional-lei-14133.md
    ...

scripts/
  build-blog.mjs                       ← Pipeline de geração
  blog-template.html                   ← Template HTML compartilhado
  blog-listing-template.html           ← Template da listagem /blog/
```
