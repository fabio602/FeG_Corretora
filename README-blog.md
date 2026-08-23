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
| `category` | Sim | Ex: Guia, Comparativo, Seguro Judicial |
| `readingTime` | Sim | Tempo estimado de leitura em minutos |
| `author` | Sim | Nome do autor |
| `keywords` | Não | Palavras-chave separadas por vírgula |
| `lead` | Não | Parágrafo de abertura destacado (aparece em itálico no topo) |
| `faq` | Não | Lista de perguntas/respostas para o schema FAQPage do Google |

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

---

### 5. Suba para o Hostinger

Copie o conteúdo da pasta `dist/` para o `public_html/` no File Manager do Hostinger.

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
