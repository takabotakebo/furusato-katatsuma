(function () {
  var applyForm = document.getElementById('apply-form');
  if (!applyForm) return;

  applyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var job = applyForm.querySelector('[name="job"]').value;
    var result = document.getElementById('apply-result');
    if (!result) return;

    if (job === 'memory') {
      result.textContent = 'お申し込みありがとうございます。ご登録内容については、担当より改めてご連絡いたします。なお、今後は本サイトへのアクセス情報を定期的に収集させていただきます。';
    } else {
      result.textContent = 'お申し込みありがとうございます。確認メールをお送りしました。';
    }
    result.className = 'form-result';
    result.style.display = 'block';
  });
})();
