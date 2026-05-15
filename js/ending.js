(function () {
  var pct = 0;
  var interval = setInterval(function () {
    pct += Math.random() * 8 + 2;
    if (pct >= 92) {
      pct = 92;
      clearInterval(interval);
      startFinalPhase();
    }
    var fill = document.getElementById('progress-fill');
    var text = document.getElementById('progress-text');
    if (fill) fill.style.width = pct.toFixed(1) + '%';
    if (text) text.textContent = Math.floor(pct) + '%';
  }, 150);

  function startFinalPhase() {
    setTimeout(function () {
      var fill = document.getElementById('progress-fill');
      var text = document.getElementById('progress-text');
      if (fill) fill.style.width = '100%';
      if (text) text.textContent = '100%';
      setTimeout(function () {
        document.title = 'かたつま町 - 記憶受領完了';
        var loading = document.getElementById('loading-screen');
        var ending  = document.getElementById('ending-content');
        if (loading) loading.style.display = 'none';
        if (ending)  ending.style.display  = 'block';
      }, 800);
    }, 1000);
  }
})();
