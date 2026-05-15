(function () {
  /* ===== Page visit tracker ===== */
  (function () {
    var visits = JSON.parse(sessionStorage.getItem('kt_visits') || '[]');
    var pageIdEl = document.querySelector('.page-id');
    var entry = {
      t: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      id: pageIdEl ? pageIdEl.textContent.replace('Page ID: ', '').trim() : null,
      title: document.title,
      url: (window.location.pathname.split('/').pop() || 'index.html')
    };
    if (!visits.length || visits[visits.length - 1].url !== entry.url) {
      visits.push(entry);
      sessionStorage.setItem('kt_visits', JSON.stringify(visits));
    }
  })();

  /* ===== Search form handler ===== */
  var form = document.getElementById('site-search');
  if (!form) return;

  var path = window.location.pathname;
  var isSubdir = /\/(jorei|admin)\/[^/]*$/.test(path);
  var prefix = isSubdir ? '../' : '';

  /* K-01〜K-11 キーワード対応表 */
  var keywordMap = new Map([
    /* K-01: 事案記録 S-40-10-312 */
    ['なにもなかった3日間',   prefix + 'item-kioku-5.html'],
    ['なにもなかった３日間',  prefix + 'item-kioku-5.html'],
    /* K-02: 返礼品管理ポータル */
    ['返礼品管理',            prefix + 'catalog-kanri.html'],
    ['返礼品管理ポータル',    prefix + 'catalog-kanri.html'],
    ['返礼品管理システム',    prefix + 'catalog-kanri.html'],
    /* K-03: 忘れていた夏 */
    ['忘れていた夏',          prefix + 'item-kioku-3.html'],
    /* K-04: あの人との時間 */
    ['あの人との時間',        prefix + 'item-kioku-4.html'],
    /* K-05: 未使用の幼少期 */
    ['未使用の幼少期',        prefix + 'item-kioku-6.html'],
    /* K-06: 整理済み記憶セット */
    ['整理済み記憶セット',    prefix + 'item-kioku-7.html'],
    ['整理済み記憶',          prefix + 'item-kioku-7.html'],
    /* K-07: はじめての記憶 */
    ['はじめての記憶',        prefix + 'item-kioku-8.html'],
    /* K-08: 寄附者の声 */
    ['寄附者の声',            prefix + 'testimonials.html'],
    /* K-09: 記憶管理条例 */
    ['記憶管理条例',          prefix + 'jorei/kioku-kanri.html'],
    /* K-10: 内部書類一覧 */
    ['KR-1966',               prefix + 'admin/index.html'],
    /* NMCRI */
    ['NMCRI',                 prefix + 'nmcri-log.html'],
    ['国立記憶認知研究所',    prefix + 'nmcri-log.html'],
    ['記憶認知研究所',        prefix + 'nmcri-log.html'],
    ['国立記憶・認知研究所',  prefix + 'nmcri-log.html'],
  ]);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('search-input').value.trim();
    var dest = keywordMap.get(input);
    if (dest) {
      window.location.href = dest;
    } else {
      window.location.href = prefix + 'search.html?q=' + encodeURIComponent(input);
    }
  });
})();
