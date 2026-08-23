import { useEffect } from 'react'

// O blog é servido como HTML estático (legacy/blog-index.html → dist/blog/index.html).
// Ao navegar via React Router, redirecionamos para a página estática real.
export default function Blog() {
  useEffect(() => {
    window.location.replace('/blog/')
  }, [])
  return null
}
