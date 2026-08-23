import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

// Os artigos são HTML estático em dist/blog/:slug/index.html com estilos e
// marcação próprios. O componente redireciona para o HTML pré-renderizado,
// garantindo que o usuário e o Google vejam exatamente o mesmo conteúdo.
export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>()
  useEffect(() => {
    if (slug) window.location.replace('/blog/' + slug + '/')
  }, [slug])
  return null
}
