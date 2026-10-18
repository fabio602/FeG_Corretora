/**
 * ga4-spa.js
 * Rastreia page_view no Google Analytics 4 em cada mudança de rota do React Router
 * e o evento clique_whatsapp em qualquer link do WhatsApp do site, ajustando a
 * mensagem pré-preenchida para citar a modalidade da página.
 * Carregado via <script defer> em todos os HTMLs do site.
 */
(function () {
  'use strict';

  function sendPageView() {
    if (typeof gtag !== 'function') return;
    gtag('event', 'page_view', {
      page_title:    document.title,
      page_location: window.location.href,
      page_path:     window.location.pathname + window.location.search
    });
  }

  // Page view inicial (aguarda título ser atualizado pelo React)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(sendPageView, 150); });
  } else {
    setTimeout(sendPageView, 150);
  }

  // Intercepta pushState / replaceState do React Router
  var _push    = history.pushState;
  var _replace = history.replaceState;

  history.pushState = function () {
    _push.apply(history, arguments);
    setTimeout(sendPageView, 150);
  };
  history.replaceState = function () {
    _replace.apply(history, arguments);
    setTimeout(sendPageView, 150);
  };

  // Botão voltar / avançar do browser
  window.addEventListener('popstate', function () { setTimeout(sendPageView, 150); });

  // Clique em qualquer link do WhatsApp (wa.me ou api.whatsapp.com), em qualquer página.
  // Usa delegação no document: funciona nas páginas React, nas estáticas e nas /lp/.
  function localDoLink(a) {
    if (a.getAttribute('data-wa-local')) return a.getAttribute('data-wa-local');
    if (a.closest('header, nav')) return 'menu';
    if (a.closest('footer')) return 'rodape';
    try {
      var el = a;
      while (el && el !== document.body) {
        if (window.getComputedStyle(el).position === 'fixed') return 'flutuante';
        el = el.parentElement;
      }
    } catch (e) {}
    return 'conteudo';
  }

  // Mensagem do WhatsApp por página: troca só a mensagem genérica pela versão que cita
  // a modalidade (ou o artigo do blog). Mensagens específicas, como as das /lp/, ficam intactas.
  var WA_NUMERO = '5515998618659';
  var MENSAGENS_GENERICAS = [
    'Olá, gostaria de solicitar uma análise gratuita de Seguro Garantia.',
    'Olá, gostaria de saber mais sobre Seguro Garantia.'
  ];
  var PAGINAS = {
    '/seguro-garantia-execucao-contrato/': 'Seguro Garantia de Execução de Contrato',
    '/seguro-garantia-licitante/': 'Seguro Garantia Licitante (garantia de proposta)',
    '/seguro-garantia-locaticia/': 'Garantia Locatícia',
    '/seguro-garantia-judicial/': 'Seguro Garantia Judicial',
    '/seguro-garantia-judicial-trabalhista/': 'Seguro Garantia Judicial Trabalhista',
    '/seguro-garantia-adicional/': 'Seguro Garantia Adicional',
    '/seguro-garantia-energia/': 'Seguro Garantia para Compra e Venda de Energia',
    '/seguro-garantia-aduaneiro/': 'Seguro Garantia Aduaneiro',
    '/seguro-garantia-loteamento/': 'Seguro Garantia de Loteamento',
    '/seguro-garantia-adiantamento-pagamento/': 'Seguro Garantia de Adiantamento de Pagamento',
    '/seguro-garantia-trabalhista-previdenciario/': 'cobertura de Obrigações Trabalhistas e Previdenciárias',
    '/seguro-cyber/': 'Seguro Cyber'
  };

  function mensagemDaPagina() {
    var caminho = window.location.pathname;
    if (caminho.charAt(caminho.length - 1) !== '/') caminho += '/';
    if (PAGINAS[caminho]) {
      return 'Olá, Fábio. Vim pela página de ' + PAGINAS[caminho] + ' do site e gostaria de uma cotação.';
    }
    if (/^\/blog\/[^\/]+\/$/.test(caminho)) {
      var h1 = document.querySelector('h1');
      var titulo = h1 ? (h1.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90) : '';
      if (titulo) return 'Olá, Fábio. Li o artigo "' + titulo + '" no blog e gostaria de falar sobre Seguro Garantia.';
    }
    if (caminho === '/perguntas-frequentes/') {
      return 'Olá, Fábio. Vim pelas perguntas frequentes do site e gostaria de uma análise de Seguro Garantia.';
    }
    return 'Olá, Fábio. Vim pelo site e gostaria de uma análise de Seguro Garantia.';
  }

  function personalizarLink(a) {
    try {
      var url = new URL(a.href, window.location.href);
      if (!/(^|\.)wa\.me$/i.test(url.hostname)) return;
      if (url.pathname.replace(/\//g, '') !== WA_NUMERO) return;
      var atual = (url.searchParams.get('text') || '').trim();
      if (atual && MENSAGENS_GENERICAS.indexOf(atual) === -1) return;
      url.searchParams.set('text', mensagemDaPagina());
      a.href = url.toString().replace(/\+/g, '%20');
    } catch (e) {}
  }

  document.addEventListener('click', function (ev) {
    var alvo = ev.target;
    var a = alvo && alvo.closest ? alvo.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!/(^|\/\/)(wa\.me|api\.whatsapp\.com)\//i.test(href)) return;
    personalizarLink(a);
    if (typeof gtag !== 'function') return;
    var texto = (a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    gtag('event', 'clique_whatsapp', {
      pagina: window.location.pathname,
      local: localDoLink(a),
      texto_link: texto || 'icone',
      transport_type: 'beacon'
    });
  }, true);
})();
