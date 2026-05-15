(function () {
  var key = 'admin_access_count';
  var count = parseInt(localStorage.getItem(key) || '0') + 1;
  localStorage.setItem(key, count);
  var el = document.getElementById('access-count');
  if (el) el.textContent = count;
})();
