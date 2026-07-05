(function () {
  var MAPS_URL = 'https://share.google/AtTRA9nk7u7cOrOaa';

  var REVIEWS = [
    { name: 'I.C Licitação', rating: 5, text: 'Tive uma excelente experiência! O Fábio foi extremamente prestativo, educado e disposto a ajudar. Emissão do seguro rápida e eficiente!', time: 'há 2 semanas', color: '#1C3A5E' },
    { name: 'Monique Barros', rating: 5, text: 'São profissionais que transmitem confiança, atenção e transparência em cada atendimento. Recomendo de coração pelo profissionalismo e dedicação que demonstram no dia a dia.', time: 'há 2 semanas', color: '#E8572A' },
    { name: 'Edílson Lobo', rating: 5, text: 'Ótima experiência. Atendimento muito atencioso, consultivo, diversos esclarecimentos, soluções rápidas contemplando os prazos apertados do segmento que atuamos.', time: 'há 2 semanas', color: '#2563EB' },
    { name: 'Renata Nadur', rating: 5, text: 'Super atenciosos e na hora do aperto eles tentam fazer tudo pelos clientes. Excelente trabalho.', time: 'há 2 semanas', color: '#7C3AED' },
    { name: 'Adilson Hanauer', rating: 5, text: 'Empresa ágil e comprometida. Recomendo.', time: 'há 2 semanas', color: '#059669' }
  ];

  var RATING = 5.0;
  var TOTAL = REVIEWS.length;
  var current = 0;
  var timer = null;
  var track, dots;

  function initials(name) {
    var p = name.trim().split(/\s+/);
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  function stars(n) {
    var h = '<div style="display:flex;gap:2px;margin-bottom:10px;">';
    for (var i = 1; i <= 5; i++)
      h += '<svg width="15" height="15" viewBox="0 0 24 24" fill="' + (i <= n ? '#FBBC04' : '#D1D5DB') + '"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    return h + '</div>';
  }

  function getVisible() { return window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1; }

  function goTo(idx) {
    var vis = getVisible();
    var max = TOTAL - vis;
    current = Math.max(0, Math.min(idx, max));
    var pct = current * (100 / vis);
    track.style.transform = 'translateX(-' + pct + '%)';
    if (dots) {
      var ds = dots.querySelectorAll('button');
      for (var i = 0; i < ds.length; i++) {
        ds[i].style.background = i === current ? '#E8572A' : '#D1D5DB';
        ds[i].style.width = i === current ? '24px' : '8px';
      }
    }
  }

  function next() { goTo(current + 1 > TOTAL - getVisible() ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? TOTAL - getVisible() : current - 1); }

  function startAuto() { timer = setInterval(next, 4500); }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

  function googleLogo() {
    return '<svg height="18" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/><path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/><path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/><path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/><path fill="#EA4335" d="M255.27 54.04l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/><path fill="#4285F4" d="M35.29 41.41V32h31.4c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C15.96 69.35.5 54.4.5 35.28.5 16.16 15.96 1.21 34.99 1.21c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.18.27z"/></svg>';
  }

  function buildSection() {
    var bigStars = '';
    for (var i = 0; i < 5; i++)
      bigStars += '<svg width="20" height="20" viewBox="0 0 24 24" fill="#FBBC04"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

    var cardHTML = REVIEWS.map(function (r) {
      return '<div style="flex:0 0 calc(100%/var(--vis,3));box-sizing:border-box;padding:0 10px;">'
        + '<div style="background:#fff;border-radius:14px;padding:22px;box-shadow:0 2px 12px rgba(0,0,0,.08);height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;">'
        + '<div style="display:flex;align-items:center;gap:10px;">'
        + '<div style="width:40px;height:40px;border-radius:50%;background:' + r.color + ';display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0;">' + initials(r.name) + '</div>'
        + '<div><div style="font-weight:600;color:#1C3A5E;font-size:14px;">' + r.name + '</div>'
        + '<div style="font-size:12px;color:#9CA3AF;">' + r.time + '</div></div>'
        + '</div>'
        + stars(r.rating)
        + '<p style="font-size:14px;color:#374151;line-height:1.6;margin:0;flex:1;">' + r.text + '</p>'
        + '</div></div>';
    }).join('');

    var section = document.createElement('section');
    section.id = 'google-reviews';
    section.style.cssText = 'background:#F8F9FA;padding:64px 0;font-family:inherit;';

    var arrowBtn = 'cursor:pointer;width:40px;height:40px;border-radius:50%;border:1.5px solid #E5E7EB;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s;';
    var arrowSVG = function(dir) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C3A5E" stroke-width="2.5" stroke-linecap="round"><polyline points="' + (dir === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6') + '"/></svg>';
    };

    section.innerHTML = '<style>'
      + '#gr-track{--vis:3}'
      + '@media(max-width:900px){#gr-track{--vis:2}}'
      + '@media(max-width:600px){#gr-track{--vis:1}}'
      + '#gr-track > div{flex:0 0 calc(100% / var(--vis))}'
      + '</style>'
      + '<div style="max-width:1200px;margin:0 auto;padding:0 24px;">'
      + '<div style="text-align:center;margin-bottom:36px;">'
      + '<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px;">' + googleLogo() + '</div>'
      + '<div style="font-size:48px;font-weight:800;color:#1C3A5E;line-height:1;">5.0</div>'
      + '<div style="display:flex;justify-content:center;gap:3px;margin:8px 0 4px;">' + bigStars + '</div>'
      + '<div style="font-size:14px;color:#6B7280;">Baseado em ' + TOTAL + ' avaliações no Google</div>'
      + '<a href="' + MAPS_URL + '" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:14px;padding:10px 22px;background:#E8572A;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Ver no Google Maps</a>'
      + '</div>'
      /* Carousel */
      + '<div style="position:relative;">'
      + '<div style="overflow:hidden;border-radius:4px;">'
      + '<div id="gr-track" style="display:flex;transition:transform .45s cubic-bezier(.25,.46,.45,.94);">'
      + cardHTML
      + '</div></div>'
      /* Arrows */
      + '<button id="gr-prev" aria-label="Avaliação anterior" style="position:absolute;top:50%;left:-20px;transform:translateY(-50%);' + arrowBtn + '">' + arrowSVG('left') + '</button>'
      + '<button id="gr-next" aria-label="Próxima avaliação" style="position:absolute;top:50%;right:-20px;transform:translateY(-50%);' + arrowBtn + '">' + arrowSVG('right') + '</button>'
      + '</div>'
      /* Dots */
      + '<div id="gr-dots" style="display:flex;justify-content:center;align-items:center;gap:6px;margin-top:24px;"></div>'
      + '</div>';

    return section;
  }

  function initCarousel(section) {
    track = section.querySelector('#gr-track');
    dots = section.querySelector('#gr-dots');

    /* Build dots */
    for (var i = 0; i < TOTAL; i++) {
      var d = document.createElement('button');
      d.style.cssText = 'border:none;border-radius:99px;height:8px;cursor:pointer;padding:0;transition:all .3s;background:#D1D5DB;width:8px;';
      (function(idx){ d.addEventListener('click', function(){ stopAuto(); goTo(idx); startAuto(); }); })(i);
      dots.appendChild(d);
    }

    section.querySelector('#gr-prev').addEventListener('click', function(){ stopAuto(); prev(); startAuto(); });
    section.querySelector('#gr-next').addEventListener('click', function(){ stopAuto(); next(); startAuto(); });

    /* Pause on hover */
    section.addEventListener('mouseenter', stopAuto);
    section.addEventListener('mouseleave', startAuto);

    /* Touch swipe */
    var touchX = 0;
    track.addEventListener('touchstart', function(e){ touchX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', function(e){
      var diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
    }, {passive:true});

    /* Responsive resize */
    window.addEventListener('resize', function(){ goTo(0); });

    goTo(0);
    startAuto();
  }

  function insert() {
    if (document.getElementById('google-reviews')) return;
    var footer = document.querySelector('footer');
    if (!footer) return;
    var section = buildSection();
    footer.parentNode.insertBefore(section, footer);
    initCarousel(section);
  }

  function poll() {
    if (window.location.pathname !== "/") return;
    var n = 0;
    function try_() {
      if (document.querySelector('footer')) { insert(); }
      else if (n++ < 40) { setTimeout(try_, 250); }
    }
    try_();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', poll); }
  else { poll(); }
})();
