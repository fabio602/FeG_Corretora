(function () {
  'use strict';

  function fixTeamAvatar() {
    var avatars = document.querySelectorAll('[class*="rounded-full"], [class*="w-16"], [class*="w-20"], [class*="w-24"]');
    for (var i = 0; i < avatars.length; i++) {
      var el = avatars[i];
      var text = el.textContent.trim();
      if (text === 'F&G' || text === 'FG' || text === 'F & G') {
        el.innerHTML = '';
        el.style.cssText = 'background:#1C3A5E;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:8px;';
        var img = document.createElement('img');
        img.src = '/logo-nav.webp';
        img.alt = 'F&G Corretora';
        img.width = 64;
        img.height = 64;
        img.style.cssText = 'width:100%;height:100%;object-fit:contain;';
        el.appendChild(img);
        return true;
      }
    }

    // Fallback: read style BEFORE any DOM write (avoid forced reflow)
    var allEls = document.querySelectorAll('*');
    for (var j = 0; j < allEls.length; j++) {
      var node = allEls[j];
      if (node.children.length === 0 && node.textContent.trim() === 'F&G') {
        var parent = node.parentElement;
        if (!parent) continue;
        // READ first (before any write)
        var br = parseInt(window.getComputedStyle(parent).borderRadius) || 0;
        if (br > 20) {
          // WRITE after read
          parent.innerHTML = '';
          parent.style.cssText = 'background:#1C3A5E;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:8px;';
          var img2 = document.createElement('img');
          img2.src = '/logo-nav.webp';
          img2.alt = 'F&G Corretora';
          img2.width = 64;
          img2.height = 64;
          img2.style.cssText = 'width:100%;height:100%;object-fit:contain;';
          parent.appendChild(img2);
          return true;
        }
      }
    }
    return false;
  }

  function tryFix() {
    if (fixTeamAvatar()) return;
    var attempts = 0;
    var interval = setInterval(function () {
      attempts++;
      if (fixTeamAvatar() || attempts > 20) clearInterval(interval);
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryFix);
  } else {
    tryFix();
  }

  window.addEventListener('popstate', function () { setTimeout(tryFix, 200); });

  var observer = new MutationObserver(function (mutations) {
    for (var m = 0; m < mutations.length; m++) {
      if (mutations[m].addedNodes.length > 0) {
        if (fixTeamAvatar()) return;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
