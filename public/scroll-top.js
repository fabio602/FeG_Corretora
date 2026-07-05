(function () {
  // Patch history.pushState so React Router navigation triggers scroll to top.
  // If the destination URL contains a hash (anchor), skip — let the browser
  // handle scrolling to the element naturally.
  var _push = history.pushState.bind(history);
  history.pushState = function (state, title, url) {
    _push(state, title, url);
    var hasHash = url && String(url).indexOf('#') !== -1;
    if (!hasHash) {
      // Defer one tick so React has committed the new route's DOM
      setTimeout(function () { window.scrollTo(0, 0); }, 0);
    }
  };

  // Back / forward buttons
  window.addEventListener('popstate', function () {
    if (!window.location.hash) {
      setTimeout(function () { window.scrollTo(0, 0); }, 0);
    }
  });
})();
