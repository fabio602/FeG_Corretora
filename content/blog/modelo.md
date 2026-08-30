---
slug: meu-novo-artigo
title: "Titulo do artigo - conciso e descritivo"
description: "Meta description com 140-160 caracteres. Aparece no Google e deve resumir o artigo de forma atraente para quem busca."
canonical: https://fegsegurogarantia.com.br/blog/meu-novo-artigo/
date: 2026-09-01
category: "Para o seu negocio"
readingTime: 5
author: "Fabio Lima"
keywords: "palavra-chave principal, variacao, termo relacionado"
lead: "Paragrafo de abertura destacado. Captura o problema do leitor em 1-2 frases."
image: ""
featured: false
cta_titulo: "Titulo do banner de CTA (opcional)"
cta_texto: "Texto especifico do CTA. Quanto mais proximo do tema, maior a conversao."
faq:
  - q: "Pergunta frequente 1?"
    a: "Resposta clara e direta."
  - q: "Pergunta frequente 2?"
    a: "Outra resposta."
---

## Primeira secao (H2)

O corpo do artigo comeca aqui. Use ## para secoes principais.

## Segunda secao

### Subsecao (H3)

---

CAMPOS DO FRONTMATTER
=====================

slug          - Igual ao nome do arquivo (sem .md). Define a URL /blog/<slug>/.
title         - Titulo do artigo. Vira o H1 e o title da pagina.
description   - Meta description (140-160 chars).
canonical     - URL completa com barra final.
date          - AAAA-MM-DD. Determina a ordem de exibicao (mais recente primeiro).
category      - Uma das categorias validas:
                  Licitacao
                  Execucao de Contrato
                  Judicial
                  Trabalhista
                  Locatico
                  Responsabilidade Civil
                  Cyber
                  Para o seu negocio
                  O build quebra se o valor nao estiver nessa lista.
readingTime   - Tempo estimado em minutos.
author        - Nome do autor (ex: Fabio Lima).
keywords      - Palavras-chave separadas por virgula.
lead          - Paragrafo de abertura destacado (aparece acima do corpo).
image         - (OPCIONAL) Caminho ou URL da imagem de capa. Tamanho recomendado:
                  1200x630 px, JPEG ou PNG. Ex: /blog/capas/meu-artigo.jpg.
                  Se ausente, o build gera uma capa SVG automatica em
                  /blog/capas/<slug>.svg com o titulo e a categoria.
featured      - (OPCIONAL) true ou false (padrao false). Marca o artigo para
                  aparecer na faixa de destaques do topo do /blog/. Use em ate
                  3 artigos simultaneamente.
cta_titulo    - (OPCIONAL) Titulo do banner de CTA. Padrao generico se ausente.
cta_texto     - (OPCIONAL) Texto do CTA. Quanto mais especifico do tema, melhor.
faq           - (OPCIONAL) Lista de perguntas e respostas para o schema FAQPage.
