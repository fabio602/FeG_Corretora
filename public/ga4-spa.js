/**
 * ga4-spa.js
 * Rastreia page_view no Google Analytics 4 em cada mudança de rota do React Router.
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
})();
