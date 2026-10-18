/**
 * ga4-spa.js
 * Rastreia page_view no Google Analytics 4 em cada mudança de rota do React Router
 * e o evento clique_whatsapp em qualquer link do WhatsApp do site.
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

  document.addEventListener('click', function (ev) {
    var alvo = ev.target;
    var a = alvo && alvo.closest ? alvo.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!/(^|\/\/)(wa\.me|api\.whatsapp\.com)\//i.test(href)) return;
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
