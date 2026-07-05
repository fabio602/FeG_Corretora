(function () {
  var NAVY = '#1C3A5E';
  var ORANGE = '#E8572A';
  var WA_URL = 'https://wa.me/5515998618659?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20uma%20an%C3%A1lise%20gratuita%20de%20Seguro%20Garantia.';

  function injectStyles() {
    if (document.getElementById('hero-v4-styles')) return;
    var s = document.createElement('style');
    s.id = 'hero-v4-styles';
    s.textContent = [
      '#hero-v4-inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}',
      '#hero-v4-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:48px;}',
      '#hero-v4-btn-primary{transition:background .18s,transform .12s,box-shadow .18s;}',
      '#hero-v4-btn-primary:hover{background:#cf4a22 !important;transform:translateY(-1px);box-shadow:0 6px 20px rgba(232,87,42,.35);}',
      '#hero-v4-btn-primary:active{transform:translateY(0);}',
      '#hero-v4-btn-secondary{transition:background .18s,color .18s,transform .12s;}',
      '#hero-v4-btn-secondary:hover{background:'+NAVY+' !important;color:#fff !important;transform:translateY(-1px);}',
      '#hero-v4-btn-secondary:active{transform:translateY(0);}',
      '#hero-v4-wa-hint{transition:color .15s;}',
      '#hero-v4-wa-hint:hover{color:#25D366 !important;}',
      '@media(max-width:900px){',
        '#hero-v4-inner{grid-template-columns:1fr;gap:36px;}',
        '#hero-v4-card-col{max-width:340px;margin:0 auto;width:100%;}',
        '#hero-v4-stats{grid-template-columns:repeat(2,1fr);}',
      '}',
      '@media(max-width:480px){',
        '#hero-v4-inner h1{font-size:26px !important;}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  function heroHTML() {
    var stats = [
      ['2h','Para emitir a apólice'],
      ['25+','Seguradoras parceiras'],
      ['R$150','A partir, Seg. Licitante'],
      ['100%','Atendimento digital']
    ].map(function(s){
      return '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:20px;text-align:center;">'
        +'<div style="font-size:28px;font-weight:800;color:'+NAVY+';">'+s[0]+'</div>'
        +'<div style="font-size:13px;color:#6B7280;margin-top:4px;">'+s[1]+'</div>'
        +'</div>';
    }).join('');

    var card = ''
      +'<div style="position:relative;">'
      +'<div style="position:absolute;top:-30px;left:-30px;right:-30px;bottom:-30px;'
      +'background:radial-gradient(ellipse at 65% 35%, rgba(232,87,42,.09) 0%, rgba(28,58,94,.07) 45%, transparent 72%);'
      +'border-radius:50%;pointer-events:none;"></div>'
      +'<div style="background:#fff;border-radius:20px;'
      +'box-shadow:0 24px 64px rgba(28,58,94,.10),0 4px 16px rgba(28,58,94,.06);'
      +'padding:36px 32px 28px;position:relative;z-index:1;">'
      +'<div style="margin-bottom:32px;">'
      +'<span style="display:inline-flex;align-items:center;gap:6px;background:#D1FAE5;color:#065F46;font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;">'
      +'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#065F46" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
      +'Emitida'
      +'</span>'
      +'</div>'
      +'<p style="font-size:12px;color:#9CA3AF;margin:0 0 5px;letter-spacing:.06em;text-transform:uppercase;">Modalidade</p>'
      +'<p style="font-size:15px;color:#374151;font-weight:500;margin:0 0 28px;">Executante Construtor</p>'
      +'<p style="font-size:12px;color:#9CA3AF;margin:0 0 8px;letter-spacing:.06em;text-transform:uppercase;">Valor segurado</p>'
      +'<p style="font-size:40px;font-weight:800;color:'+NAVY+';margin:0 0 32px;letter-spacing:-1px;line-height:1;">R$ 250.000<span style="font-size:26px;font-weight:700;">,00</span></p>'
      +'<div style="border-top:1px solid #F3F4F6;padding-top:16px;display:flex;align-items:center;gap:7px;">'
      +'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
      +'<span style="font-size:13px;color:#9CA3AF;">Emitida em <strong style="color:'+ORANGE+';font-weight:600;">1h47min</strong></span>'
      +'</div>'
      +'</div>'
      +'</div>';

    return '<div style="max-width:1200px;margin:0 auto;padding:52px 24px 44px;box-sizing:border-box;">'
      +'<div id="hero-v4-inner">'
      +'<div>'
      +'<div style="display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:600;color:#374151;margin-bottom:20px;">'
      +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+ORANGE+'" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
      +'Autorizado SUSEP · Emissão em até 2h'
      +'</div>'
      +'<h1 style="font-size:clamp(26px,3.2vw,42px);font-weight:800;color:'+NAVY+';line-height:1.15;margin:0 0 16px;">'
      +'Seguro Garantia para quem não pode perder prazo nem'
      +' <span style="color:'+ORANGE+';font-style:italic;font-family:Georgia,serif;">travar caixa</span>'
      +'</h1>'
      +'<p style="font-size:16px;color:#4B5563;line-height:1.65;margin:0 0 28px;max-width:460px;">'
      +'Analisamos o edital ou contrato, estruturamos o Seguro Garantia e emitimos a apólice em até 2 horas. Licitações, execução de contratos, processos judiciais e locações em todo o Brasil.'
      +'</p>'
      +'<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">'
      +'<a id="hero-v4-btn-primary" href="'+WA_URL+'" target="_blank" rel="noopener" '
      +'style="display:inline-block;padding:13px 26px;background:'+ORANGE+';color:#fff;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">'
      +'Solicitar análise gratuita</a>'
      +'<a id="hero-v4-btn-secondary" href="#como-funciona" onclick="event.preventDefault();var el=document.getElementById(\'como-funciona\');if(el)el.scrollIntoView({behavior:\'smooth\'});" '
      +'style="display:inline-block;padding:13px 26px;background:transparent;color:'+NAVY+';border:2px solid '+NAVY+';border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">'
      +'Como funciona</a>'
      +'</div>'
      +'<a id="hero-v4-wa-hint" href="'+WA_URL+'" target="_blank" rel="noopener" '
      +'style="display:inline-flex;align-items:center;gap:8px;font-size:14px;color:#6B7280;text-decoration:none;">'
      +'<svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
      +'Resposta em minutos pelo WhatsApp'
      +'</a>'
      +'</div>'
      +'<div id="hero-v4-card-col">'+card+'</div>'
      +'</div>'
      +'<div id="hero-v4-stats">'+stats+'</div>'
      +'</div>';
  }

  function isHomePage() {
    var p = window.location.pathname;
    return p === '/' || p === '/index.html' || p === '';
  }

  function inject() {
    if (!isHomePage()) return;
    var sections = document.querySelectorAll('section');
    var hero = null;
    for (var i = 0; i < sections.length; i++) {
      var txt = sections[i].textContent || '';
      if (txt.indexOf('Seguro Garantia') !== -1 || txt.indexOf('travar caixa') !== -1) {
        hero = sections[i]; break;
      }
    }
    if (!hero) hero = sections[0];
    if (!hero || hero.dataset.v4done) return;
    injectStyles();
    hero.style.cssText = 'background:#FAFAF8;padding:0;';
    hero.innerHTML = heroHTML();
    hero.dataset.v4done = '1';
  }

  function poll() {
    var attempts = 0;
    function try_() {
      if (document.querySelector('section')) { inject(); }
      else if (attempts++ < 40) { setTimeout(try_, 250); }
    }
    try_();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', poll);
  } else {
    poll();
  }

  window.addEventListener('popstate', function(){ setTimeout(inject, 400); });

  var observer = new MutationObserver(function(){
    var s = document.querySelector('section');
    if (s && !s.dataset.v4done) inject();
  });
  observer.observe(document.body || document.documentElement, {childList:true, subtree:true});
})();
