import React, { useEffect } from 'react';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
    {
        id: 1,
        title: "Mitos e Verdades sobre o Seguro Garantia",
        excerpt: "Muitas empresas perdem contratos por desconhecimento. Saiba o que é real sobre o Seguro Garantia.",
        content: `
      <p>O Seguro Garantia é frequentemente cercado de dúvidas que podem travar o crescimento de uma empresa. Vamos desmascarar os principais mitos:</p>
      
      <h3>Mito 1: "O Seguro Garantia é apenas para obras públicas"</h3>
      <p>Verdade: Embora seja muito usado em licitações, o setor privado está adotando massivamente o seguro garantia para proteger contratos de fornecimento e prestação de serviços.</p>
      
      <h3>Mito 2: "É muito burocrático para contratar"</h3>
      <p>Verdade: Com a F&G, o processo é 100% digital. A análise técnica é feita em tempo real, permitindo a emissão de apólices com agilidade sem precedentes.</p>
      
      <h3>Mito 3: "O custo é proibitivo"</h3>
      <p>Verdade: Comparado à fiança bancária ou ao depósito em dinheiro, o seguro garantia é extremamente competitivo e não compromete as linhas de crédito bancário.</p>
    `,
        date: "15 de Outubro, 2024",
        author: "Fábio Garcia",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Preservando o Fluxo de Caixa com Seguro Garantia",
        excerpt: "Como escolher o seguro garantia em vez de depósitos bancários pode manter seu capital disponível para o crescimento.",
        content: `
      <p>No cenário econômico atual, a liquidez é rainha. Muitas empresas cometem o erro de imobilizar capital em cauções ou depósitos recursais judiciais.</p>
      
      <p>O Seguro Garantia surge como a ferramenta estratégica ideal:</p>
      <ul>
        <li><strong>Liberação de Limites:</strong> Não toma espaço no seu limite de crédito bancário.</li>
        <li><strong>Custo-Benefício:</strong> Taxas significativamente menores que as de uma carta de fiança.</li>
        <li><strong>Rapidez:</strong> Resposta imediata para necessidades urgentes de habilitação.</li>
      </ul>
      <p>Ao utilizar o seguro, sua empresa mantém o dinheiro onde ele deve estar: investido no seu próprio core business.</p>
    `,
        date: "28 de Setembro, 2024",
        author: "F&G Editorial",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Segurança Contratual no Setor Privado",
        excerpt: "A transformação silenciosa onde empresas privadas buscam proteção jurídica e financeira em seus contratos.",
        content: `
      <p>A segurança nas relações comerciais privadas nunca foi tão importante. O Seguro Garantia Contratual oferece a tranquilidade de que, se o fornecedor falhar, o projeto não para.</p>
      
      <p>Principais vantagens para o setor privado:</p>
      <ol>
        <li>Seleção de fornecedores mais qualificados (devido à análise de crédito da seguradora).</li>
        <li>Proteção contra inadimplência contratual.</li>
        <li>Manutenção do cronograma físico-financeiro da obra ou projeto.</li>
      </ol>
      <p>Na F&G, conectamos sua empresa às maiores seguradoras mundiais para garantir que cada contrato seja uma vitória segura</p>
    `,
        date: "10 de Setembro, 2024",
        author: "Fábio Garcia",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop"
    }
];

const Blog: React.FC = () => {
    const [selectedPost, setSelectedPost] = React.useState<typeof BLOG_POSTS[0] | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedPost]);

    if (selectedPost) {
        return (
            <div className="pt-32 pb-20 bg-[#0a0f16] min-h-screen">
                <div className="container mx-auto px-6">
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-fg-gold transition-colors mb-12 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Voltar para o Blog
                    </button>

                    <article className="max-w-4xl mx-auto">
                        <header className="mb-12">
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedPost.date}</span>
                                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedPost.author}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
                                {selectedPost.title}
                            </h1>
                            <div className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                            </div>
                        </header>

                        <div
                            className="prose prose-invert prose-gold max-w-none text-slate-300 text-lg leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />

                        <footer className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-fg-gold/20 flex items-center justify-center text-fg-gold font-bold">
                                    FG
                                </div>
                                <div>
                                    <p className="text-white font-bold">{selectedPost.author}</p>
                                    <p className="text-sm text-slate-500">Especialista em Seguros</p>
                                </div>
                            </div>
                            <button className="p-3 rounded-full border border-white/10 text-slate-400 hover:text-fg-gold hover:border-fg-gold transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </footer>
                    </article>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 bg-[#0a0f16] min-h-screen">
            <div className="container mx-auto px-6">
                <header className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <h2 className="text-fg-gold font-bold tracking-widest uppercase text-sm">Nosso Blog</h2>
                    <h1 className="text-5xl md:text-7xl font-bold text-white">
                        Conhecimento que gera <span className="italic font-serif">Segurança</span>.
                    </h1>
                    <p className="text-slate-400 text-xl font-light">
                        Insights, novidades e tudo o que você precisa saber sobre o mercado de seguro garantia e compliance.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {BLOG_POSTS.map((post) => (
                        <article
                            key={post.id}
                            className="glass-card rounded-[2.5rem] overflow-hidden group hover:border-fg-gold/40 transition-all cursor-pointer flex flex-col"
                            onClick={() => setSelectedPost(post)}
                        >
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>By {post.author}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-fg-gold transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 leading-relaxed text-sm mb-6 flex-grow">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto">
                                    <span className="text-fg-gold font-bold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Ler artigo completo →
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
