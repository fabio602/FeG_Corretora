import { Helmet } from 'react-helmet-async'
export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog | Seguro Garantia, Licitações e Lei 14.133 | F&G</title>
        <meta name="description" content="Artigos e guias sobre Seguro Garantia para empresas em licitações, contratos públicos e processos judiciais. F&G Corretora." />
        <link rel="canonical" href="https://fegsegurogarantia.com.br/blog" />
      </Helmet>
      <section className="pt-32 pb-20 bg-fg-bg min-h-screen">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold text-fg-navy mb-4">Blog</h1>
          <p className="text-gray-500">Em breve: artigos sobre Seguro Garantia, licitações e contratos públicos.</p>
        </div>
      </section>
    </>
  )
}
