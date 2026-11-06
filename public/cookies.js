/**
 * cookies.js
 * Banner de consentimento de cookies (LGPD) + Google Consent Mode v2.
 *
 * O padrão "negado" é definido por um <script id="fg-consent-default"> inline no
 * <head>, injetado pelo build (scripts/build-legacy.mjs) ANTES do gtag.js. Este
 * arquivo só mostra o banner, grava a escolha e envia o gtag('consent','update').
 *
 * Escolha guardada em localStorage "fg_cookie_consent" (versão 1).
 * Para reabrir as preferências de qualquer lugar: window.fgCookiePreferencias()
 */
(function () {
  'use strict';
  if (window.__fgCookiesLoaded) return;
  window.__fgCookiesLoaded = true;

  var KEY = 'fg_cookie_consent';
  var VERSAO = 1;
  var POLITICA = '/politica-de-privacidade/';
  var DOMINIO = 'fegsegurogarantia.com.br';

  function ler() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.v === VERSAO) return c;
    } catch (e) {}
    return null;
  }

  function gt() {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag === 'function') { window.gtag.apply(null, arguments); }
    else { window.dataLayer.push(arguments); }
  }

  function apagarCookiesGA() {
    var nomes = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); });
    nomes.forEach(function (n) {
      if (!/^(_ga|_gid|_gat|_gcl)/.test(n)) return;
      var exp = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = n + exp;
      document.cookie = n + exp + '; domain=.' + DOMINIO;
      document.cookie = n + exp + '; domain=' + DOMINIO;
    });
  }

  function aplicar(c) {
    var a = c.analytics ? 'granted' : 'denied';
    var m = c.marketing ? 'granted' : 'denied';
    gt('consent', 'update', {
      analytics_storage: a,
      ad_storage: m,
      ad_user_data: m,
      ad_personalization: m
    });
    if (!c.analytics) apagarCookiesGA();
  }

  function salvar(analytics, marketing) {
    var c = { v: VERSAO, analytics: !!analytics, marketing: !!marketing, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    aplicar(c);
    gt('event', 'cookie_consent', { analytics: c.analytics ? 'sim' : 'nao', marketing: c.marketing ? 'sim' : 'nao' });
    fecharTudo();
  }

  // ── Estilos ────────────────────────────────────────────────────────────────
  var CSS = '' +
    '.fgck,.fgck *{box-sizing:border-box;font-family:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    '.fgck-bar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#1c3a5e;color:#fff;' +
      'padding:18px clamp(16px,5vw,80px);display:flex;flex-wrap:wrap;align-items:center;gap:14px 28px;' +
      'box-shadow:0 -6px 24px rgba(0,0,0,.18);animation:fgckUp .35s ease-out}' +
    '@keyframes fgckUp{from{transform:translateY(100%)}to{transform:none}}' +
    '.fgck-txt{flex:1 1 520px;font-size:14.5px;line-height:1.55;margin:0;color:#e9eef5}' +
    '.fgck-txt strong{color:#fff}' +
    '.fgck-txt a{color:#eac8ac;text-decoration:underline}' +
    '.fgck-acts{display:flex;flex-wrap:wrap;gap:10px;flex:0 0 auto}' +
    '.fgck-btn{appearance:none;border:2px solid #e8572a;border-radius:8px;padding:10px 18px;font-size:14px;font-weight:600;cursor:pointer;line-height:1.2;min-width:120px}' +
    '.fgck-pri{background:#e8572a;color:#fff}.fgck-pri:hover{background:#d24a20;border-color:#d24a20}' +
    '.fgck-sec{background:transparent;color:#fff;border-color:#fff}.fgck-sec:hover{background:rgba(255,255,255,.1)}' +
    '.fgck-lnk{background:none;border:0;color:#eac8ac;text-decoration:underline;font-size:14px;cursor:pointer;padding:10px 4px}' +
    '.fgck-ov{position:fixed;inset:0;z-index:2147483001;background:rgba(10,20,35,.55);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.fgck-mod{background:#fff;color:#1f2937;border-radius:14px;width:min(640px,100%);max-height:90vh;overflow:auto;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,.3)}' +
    '.fgck-mod h2{margin:0 0 8px;font-size:20px;font-weight:700;color:#1c3a5e}' +
    '.fgck-mod p{margin:0 0 16px;font-size:14.5px;line-height:1.55;color:#4b5563}' +
    '.fgck-mod a{color:#1c3a5e}' +
    '.fgck-cat{border:1px solid #e4e1da;border-radius:10px;padding:14px 16px;margin:0 0 10px;display:flex;gap:16px;align-items:flex-start;justify-content:space-between}' +
    '.fgck-cat h3{margin:0 0 4px;font-size:15px;font-weight:600;color:#1c3a5e}' +
    '.fgck-cat p{margin:0;font-size:13.5px}' +
    '.fgck-sw{position:relative;flex:0 0 46px;height:26px;margin-top:2px}' +
    '.fgck-sw input{opacity:0;width:100%;height:100%;margin:0;position:absolute;inset:0;cursor:pointer;z-index:1}' +
    '.fgck-sw span{position:absolute;inset:0;background:#cbd2db;border-radius:26px;transition:.2s}' +
    '.fgck-sw span:before{content:"";position:absolute;width:20px;height:20px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s}' +
    '.fgck-sw input:checked+span{background:#e8572a}' +
    '.fgck-sw input:checked+span:before{transform:translateX(20px)}' +
    '.fgck-sw input:disabled+span{background:#1c3a5e;opacity:.55}' +
    '.fgck-sw input:focus-visible+span{outline:3px solid #eac8ac;outline-offset:2px}' +
    '.fgck-mod .fgck-acts{margin-top:18px;justify-content:flex-end}' +
    '.fgck-mod .fgck-sec{color:#1c3a5e;border-color:#1c3a5e}.fgck-mod .fgck-sec:hover{background:#f3f5f8}' +
    '.fgck-flt{position:fixed;left:14px;bottom:14px;z-index:2147482000;background:#fff;color:#1c3a5e;border:1px solid #e4e1da;border-radius:20px;' +
      'padding:6px 12px;font-size:12px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.08);font-family:system-ui,sans-serif}' +
    '.fgck-foot{display:inline-flex;gap:16px;flex-wrap:wrap;margin-top:12px;font-size:13px}' +
    '.fgck-foot a,.fgck-foot button{color:inherit;opacity:.8;background:none;border:0;padding:0;cursor:pointer;font:inherit;text-decoration:underline}' +
    '.fgck-foot a:hover,.fgck-foot button:hover{opacity:1}' +
    '@media (max-width:640px){.fgck-acts{width:100%}.fgck-bar .fgck-btn{flex:1 1 0}}';

  function css() {
    if (document.getElementById('fgck-css')) return;
    var s = document.createElement('style');
    s.id = 'fgck-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var barra = null, overlay = null;

  function fecharTudo() {
    if (barra) { barra.remove(); barra = null; }
    if (overlay) { overlay.remove(); overlay = null; }
  }

  function mostrarBarra() {
    if (barra) return;
    css();
    barra = document.createElement('div');
    barra.className = 'fgck fgck-bar';
    barra.setAttribute('role', 'region');
    barra.setAttribute('aria-label', 'Aviso de cookies');
    barra.innerHTML =
      '<p class="fgck-txt"><strong>Sua privacidade importa.</strong> Usamos cookies necessários para o site funcionar e, com a sua autorização, ' +
      'cookies de medição (Google Analytics) para entender como o site é usado e melhorar o atendimento. ' +
      'Você pode aceitar, recusar ou escolher. Saiba mais na <a href="' + POLITICA + '">Política de Privacidade e Cookies</a>.</p>' +
      '<div class="fgck-acts">' +
        '<button type="button" class="fgck-lnk" data-a="pref">Personalizar</button>' +
        '<button type="button" class="fgck-btn fgck-sec" data-a="nao">Recusar</button>' +
        '<button type="button" class="fgck-btn fgck-pri" data-a="sim">Aceitar todos</button>' +
      '</div>';
    barra.addEventListener('click', function (e) {
      var a = e.target && e.target.getAttribute('data-a');
      if (a === 'sim') salvar(true, true);
      else if (a === 'nao') salvar(false, false);
      else if (a === 'pref') abrirPreferencias();
    });
    document.body.appendChild(barra);
  }

  function abrirPreferencias() {
    css();
    if (overlay) overlay.remove();
    var c = ler() || { analytics: false, marketing: false };
    overlay = document.createElement('div');
    overlay.className = 'fgck fgck-ov';
    overlay.innerHTML =
      '<div class="fgck-mod" role="dialog" aria-modal="true" aria-labelledby="fgck-t">' +
        '<h2 id="fgck-t">Preferências de cookies</h2>' +
        '<p>Escolha quais cookies podemos usar. Você pode mudar isso a qualquer momento pelo link "Preferências de cookies" no rodapé. ' +
        'Detalhes na <a href="' + POLITICA + '">Política de Privacidade e Cookies</a>.</p>' +
        '<div class="fgck-cat"><div><h3>Necessários</h3><p>Fazem o site e os formulários funcionarem e guardam esta escolha. Não podem ser desligados.</p></div>' +
          '<label class="fgck-sw" aria-label="Necessários, sempre ativos"><input type="checkbox" checked disabled><span></span></label></div>' +
        '<div class="fgck-cat"><div><h3>Medição</h3><p>Google Analytics: páginas visitadas, origem da visita e cliques, de forma estatística, para melhorar o site.</p></div>' +
          '<label class="fgck-sw" aria-label="Cookies de medição"><input type="checkbox" id="fgck-an"' + (c.analytics ? ' checked' : '') + '><span></span></label></div>' +
        '<div class="fgck-cat"><div><h3>Marketing</h3><p>Medem o resultado dos nossos anúncios no Google e permitem anúncios mais relevantes.</p></div>' +
          '<label class="fgck-sw" aria-label="Cookies de marketing"><input type="checkbox" id="fgck-mk"' + (c.marketing ? ' checked' : '') + '><span></span></label></div>' +
        '<div class="fgck-acts">' +
          '<button type="button" class="fgck-btn fgck-sec" data-a="nao">Recusar todos</button>' +
          '<button type="button" class="fgck-btn fgck-sec" data-a="salvar">Salvar escolhas</button>' +
          '<button type="button" class="fgck-btn fgck-pri" data-a="sim">Aceitar todos</button>' +
        '</div>' +
      '</div>';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { overlay.remove(); overlay = null; return; }
      var a = e.target && e.target.getAttribute('data-a');
      if (a === 'sim') salvar(true, true);
      else if (a === 'nao') salvar(false, false);
      else if (a === 'salvar') salvar(document.getElementById('fgck-an').checked, document.getElementById('fgck-mk').checked);
    });
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay) { overlay.remove(); overlay = null; }
    });
    document.body.appendChild(overlay);
    var primeiro = overlay.querySelector('#fgck-an');
    if (primeiro) primeiro.focus();
  }
  window.fgCookiePreferencias = abrirPreferencias;

  // ── Links no rodapé (ou botão flutuante discreto se a página não tiver rodapé) ──
  function linksRodape() {
    if (document.querySelector('.fgck-foot')) return true;
    var f = document.querySelector('footer');
    if (!f) return false;
    var d = document.createElement('div');
    d.className = 'fgck-foot';
    d.innerHTML = '<a href="' + POLITICA + '">Política de Privacidade e Cookies</a>' +
      '<button type="button">Preferências de cookies</button>';
    d.querySelector('button').addEventListener('click', abrirPreferencias);
    var alvo = f.lastElementChild || f;
    alvo.appendChild(d);
    return true;
  }

  function botaoFlutuante() {
    if (document.querySelector('.fgck-flt') || document.querySelector('.fgck-foot')) return;
    css();
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'fgck-flt';
    b.textContent = 'Cookies';
    b.setAttribute('aria-label', 'Preferências de cookies');
    b.addEventListener('click', abrirPreferencias);
    document.body.appendChild(b);
  }

  function iniciar() {
    css();
    var c = ler();
    if (!c) mostrarBarra();

    // O React monta o rodapé depois; observa até 6 s e, se ele sumir numa troca
    // de rota, coloca os links de novo.
    linksRodape();
    new MutationObserver(function () { linksRodape(); })
      .observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { if (!document.querySelector('.fgck-foot')) botaoFlutuante(); }, 6000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
