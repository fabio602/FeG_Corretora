
import React from 'react';
import {
  ShieldCheck,
  Gavel,
  Building2,
  Globe,
  HardHat,
  FileCheck2,
  TrendingUp,
  Award,
  Users,
  Clock,
  Smartphone,
  Star
} from 'lucide-react';

export const COLORS = {
  navy: '#1a2b3c',
  gold: '#e2b49a',
  navyDark: '#0f1a24'
};

export const CONTACT_INFO = {
  phone: '+55 (15) 99861 8659',
  email: 'fabio@fegsegurogarantia.com.br',
  address: {
    street: '',
    city: 'Boituva - SP'
  }
};

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/fg_segurogarantia?igsh=ODhmc2F5MnhpMTRs&utm_source=qr',
  linkedin: 'https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A107618467&keywords=f%20%26%20g%20corretora%20de%20seguros&origin=RICH_QUERY_SUGGESTION&position=1&searchId=2c7d0511-e4cb-4a8b-bfe9-7cbb2e1e1c48&sid=sT4&spellCorrectionEnabled=false',
  facebook: '#'
};

export const SERVICES = [
  {
    title: 'Garantia Licitante',
    description: 'Essencial para empresas que participam de concorrências públicas ou privadas, garantindo a assinatura do contrato.',
    icon: <FileCheck2 className="w-8 h-8" />
  },
  {
    title: 'Garantia Executante',
    description: 'Assegura o cumprimento integral das obrigações contratuais de construção, fornecimento ou prestação de serviços.',
    icon: <HardHat className="w-8 h-8" />
  },
  {
    title: 'Garantia Judicial',
    description: 'Substitui depósitos recursais ou cauções em processos judiciais, preservando o fluxo de caixa da sua empresa.',
    icon: <Gavel className="w-8 h-8" />
  },
  {
    title: 'Garantia Imobiliária',
    description: 'Garante a entrega de unidades habitacionais ou comerciais em regimes de incorporação imobiliária.',
    icon: <Building2 className="w-8 h-8" />
  },
  {
    title: 'Garantia Aduaneira',
    description: 'Assegura o pagamento de tributos em operações de importação e exportação sob regimes especiais.',
    icon: <Globe className="w-8 h-8" />
  },
  {
    title: 'Depósito Recursal',
    description: 'Substitui os depósitos recursais e te dá liberdade para discurtir sua ação em juízo com tranquilidade.',
    icon: <ShieldCheck className="w-8 h-8" />
  }
];

export const STATS = [
  { label: 'Resposta Imediata', value: '2h', icon: <Clock /> },
  { label: 'Seguradoras Líderes', value: '25+', icon: <Users /> },
  { label: 'Processos Digitais', value: '100%', icon: <Smartphone /> },
  { label: 'Satisfação', value: '4.9★', icon: <Star /> }
];

export const TESTIMONIALS = [
  {
    name: 'Roberto Silva',
    role: 'Diretor Financeiro',
    company: 'Construtora Horizonte',
    content: 'A F&G transformou nossa gestão de garantias. O atendimento é ágil e as taxas são as melhores do mercado.'
  },
  {
    name: 'Ana Paula Mendes',
    role: 'CEO',
    company: 'Logística Brasil S.A.',
    content: 'O Seguro Garantia Judicial da F&G nos permitiu manter investimentos críticos sem comprometer o caixa.'
  },
  {
    name: 'Carlos Eduardo',
    role: 'Gerente Jurídico',
    company: 'Tech Solutions',
    content: 'Profissionalismo e seriedade. Recomendo a F&G para qualquer empresa que busque segurança contratual.'
  }
];
