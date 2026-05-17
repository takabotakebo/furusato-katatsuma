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
  var isSubdir = /\/(admin|portal|nmcri)\/[^/]*$/.test(path);
  var prefix = isSubdir ? '../' : '';

  /* K-01〜K-10 キーワード対応表 { dest, type: 'hidden'|'normal', title, sub }
     dest はルートからの相対パスで固定 */
  var keywordMap = new Map([
    /* K-01: 事案記録 S-40-10-312 */
    ['大規模採取作業',           { dest: 'secret-s40.html',        type: 'hidden', title: '【機密】S-40-10-312 事案記録',           sub: 'かたつま町' }],
    /* K-02: 返礼品管理ログ */
    ['返礼品管理',            { dest: 'catalog-kanri.html',     type: 'hidden', title: '返礼品管理ログ',                    sub: 'かたつま町 ふるさと納税担当課 内部' }],
    ['返礼品管理ログ',    { dest: 'catalog-kanri.html',     type: 'hidden', title: '返礼品管理ログ',                    sub: 'かたつま町 ふるさと納税担当課 内部' }],
    ['返礼品管理システム',    { dest: 'catalog-kanri.html',     type: 'hidden', title: '返礼品管理ログ',                    sub: 'かたつま町 ふるさと納税担当課 内部' }],
    /* K-03: 忘れていた夏 */
    ['忘れていた夏',          { dest: 'item-kioku-3.html',      type: 'hidden', title: '忘れていた夏（1回分）',                  sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    ['忘れていた夏（1回分）', { dest: 'item-kioku-3.html',      type: 'hidden', title: '忘れていた夏（1回分）',                  sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    /* K-04: あの人との時間 */
    ['あの人との時間',        { dest: 'item-kioku-4.html',      type: 'hidden', title: 'あの人との時間（5分以内）',              sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    ['あの人との時間（5分以内）', { dest: 'item-kioku-4.html',  type: 'hidden', title: 'あの人との時間（5分以内）',              sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    /* K-05: 幼少期の記憶 */
    ['幼少期の記憶',          { dest: 'item-kioku-5.html',      type: 'hidden', title: '幼少期の記憶（一式）',                  sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    ['幼少期の記憶（一式）',  { dest: 'item-kioku-5.html',      type: 'hidden', title: '幼少期の記憶（一式）',                  sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    ['未使用の幼少期',        { dest: 'item-kioku-5.html',      type: 'hidden', title: '幼少期の記憶（一式）',                  sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    /* K-06: 昭和時代の記憶セット */
    ['昭和時代の記憶セット',  { dest: 'item-kioku-6.html',      type: 'hidden', title: '昭和時代の記憶セット（混合）',          sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    ['昭和時代の記憶セット（混合）', { dest: 'item-kioku-6.html', type: 'hidden', title: '昭和時代の記憶セット（混合）',       sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    ['整理済み記憶セット',    { dest: 'item-kioku-6.html',      type: 'hidden', title: '昭和時代の記憶セット（混合）',          sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    ['整理済み記憶',          { dest: 'item-kioku-6.html',      type: 'hidden', title: '昭和時代の記憶セット（混合）',          sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    /* K-07: はじめての記憶 */
    ['はじめての記憶',        { dest: 'item-kioku-7.html',      type: 'hidden', title: 'はじめての記憶（複製不可）',             sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    ['はじめての記憶（複製不可）', { dest: 'item-kioku-7.html', type: 'hidden', title: 'はじめての記憶（複製不可）',             sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    /* K-08: 寄附者の声 */
    ['寄附者の声',            { dest: 'testimonials.html',      type: 'hidden', title: '寄附者の声',                            sub: 'かたつま町 ふるさと納税返礼品カタログ' }],
    /* K-08b: 記憶管理課 */
    ['記憶管理課',            { dest: 'dept-kioku.html',        type: 'hidden', title: 'おもいで管理課（旧：記憶管理課）業務概要', sub: 'かたつま町' }],
    /* K-09: 記憶管理条例 */
    ['記憶管理条例',          { dest: 'kioku-kanri.html',       type: 'hidden', title: 'かたつま町記憶管理条例',                 sub: 'かたつま町' }],
    /* K-10: 職員ポータル */
    ['職員ポータル',          { dest: 'portal/login.html',      type: 'hidden', title: '職員ポータル',                          sub: 'かたつま町 一般職員用' }],
    ['一般業務システム',      { dest: 'portal/login.html',      type: 'hidden', title: '職員ポータル',                          sub: 'かたつま町 一般職員用' }],
    /* K-11: KTMS */
    ['KTMS',                  { dest: 'admin/login.html',       type: 'hidden', title: 'おもいで管理課 内部管理システム',        sub: 'KTMS — Kioku Torishimari Management System' }],
    ['内部管理システム',      { dest: 'admin/login.html',       type: 'hidden', title: 'おもいで管理課 内部管理システム',        sub: 'KTMS — Kioku Torishimari Management System' }],
    /* MNE法 */
    ['MNE法',                 { dest: 'nmcri-mne.html',         type: 'hidden', title: 'MNE法　新処理プロトコルのご案内', sub: 'かたつま町 連携機関受信メール' }],
    ['Memory Neural Extraction', { dest: 'nmcri-mne.html',     type: 'hidden', title: 'MNE法　新処理プロトコルのご案内', sub: 'かたつま町 連携機関受信メール' }],
    /* NMCRI */
    ['NMCRI',                 { dest: 'nmcri-log.html',         type: 'hidden', title: '連携機関 往復文書',                     sub: 'かたつま町' }],
    ['国立記憶認知研究所',    { dest: 'nmcri-log.html',         type: 'hidden', title: '連携機関 往復文書',                     sub: 'かたつま町' }],
    ['記憶認知研究所',        { dest: 'nmcri-log.html',         type: 'hidden', title: '連携機関 往復文書',                     sub: 'かたつま町' }],
    ['国立記憶・認知研究所',  { dest: 'nmcri-log.html',         type: 'hidden', title: '連携機関 往復文書',                     sub: 'かたつま町' }],
  ]);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('search-input').value.trim();
    var hit = keywordMap.get(input);
    if (hit) {
      window.location.href = prefix + 'search.html?q=' + encodeURIComponent(input)
        + '&dest=' + encodeURIComponent(hit.dest)
        + '&type=' + hit.type
        + '&title=' + encodeURIComponent(hit.title || '')
        + '&sub=' + encodeURIComponent(hit.sub || '');
    } else {
      window.location.href = prefix + 'search.html?q=' + encodeURIComponent(input);
    }
  });
})();
