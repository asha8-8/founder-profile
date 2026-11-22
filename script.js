(function () {
  'use strict';

  // Illustrative coverage-gap model: fixed 400-day scale so bar lengths stay comparable.
  var SCALE = 400;
  var rem = document.getElementById('rem');
  var ten = document.getElementById('ten');
  var remOut = document.getElementById('remOut');
  var tenOut = document.getElementById('tenOut');
  var gap = document.getElementById('gap');
  var result = document.getElementById('result');

  function plural(n) { return n + (n === 1 ? ' day' : ' days'); }

  function update() {
    if (!rem || !ten || !gap || !result) { return; }
    var r = Number(rem.value);
    var t = Number(ten.value);
    remOut.textContent = r;
    tenOut.textContent = t;
    gap.style.setProperty('--a', (r / SCALE * 100) + '%');
    gap.style.setProperty('--b', (t / SCALE * 100) + '%');
    if (t > r) {
      result.innerHTML = '<strong>' + plural(t - r) + ' uncovered.</strong> The contract ends ' + plural(t - r) + ' before its replacement can be awarded.';
    } else if (t === r) {
      result.innerHTML = '<strong>No spare time.</strong> The replacement is awarded on the day the contract ends.';
    } else {
      result.innerHTML = '<strong>Covered.</strong> The replacement can be awarded ' + plural(r - t) + ' before the contract ends.';
    }
  }

  if (rem && ten) {
    rem.addEventListener('input', update);
    ten.addEventListener('input', update);
    update();
  }

  // Share and copy link.
  var toast = document.getElementById('toast');
  var timer;
  function say(msg) {
    if (!toast) { return; }
    toast.textContent = msg;
    clearTimeout(timer);
    timer = setTimeout(function () { toast.textContent = ''; }, 3500);
  }

  function copy(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(url);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('copy failed'));
      } catch (e) { reject(e); }
    });
  }

  function shareProfile() {
    var url = location.href.split('#')[0];
    var data = { title: document.title, text: 'Founder profile: Asha Prakash Panda, APSARA EdTech Labs', url: url };
    var attempt = (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
      ? navigator.share(data)
      : Promise.reject(new Error('no share'));
    attempt.catch(function (err) {
      if (err && err.name === 'AbortError') { return; }
      return copy(url).then(function () { say('Profile link copied.'); }, function () { say('Copy the address from the browser bar.'); });
    });
  }

  var buttons = document.querySelectorAll('[data-share]');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', shareProfile);
  }
})();
