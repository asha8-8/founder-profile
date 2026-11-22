(function () {
  var d = document, root = d.documentElement;
  var bar = d.getElementById('bar'), hero = d.querySelector('.hero');

  /* hero entrance */
  requestAnimationFrame(function () { setTimeout(function () { hero.classList.add('is-ready'); }, 60); });

  /* sticky bar solid after hero top */
  function onScroll() {
    bar.classList.toggle('is-solid', window.scrollY > 40 && !d.body.classList.contains('menu-open'));
    updateChain();
  }

  /* reveal on scroll */
  var els = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* capability chain: line fills as you scroll, nodes light up */
  var chain = d.getElementById('chain'), items = chain ? chain.querySelectorAll('li') : [];
  function updateChain() {
    if (!chain) return;
    var r = chain.getBoundingClientRect(), vh = window.innerHeight, mark = vh * 0.6;
    var p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
    chain.style.setProperty('--p', p.toFixed(3));
    items.forEach(function (li) { li.classList.toggle('on', li.getBoundingClientRect().top < mark); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateChain);
  onScroll();

  /* mobile menu */
  var btn = d.getElementById('menuBtn'), menu = d.getElementById('menu');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    d.body.classList.toggle('menu-open', open);
    if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('is-open'); }); }
    else { menu.classList.remove('is-open'); setTimeout(function () { if (!d.body.classList.contains('menu-open')) menu.hidden = true; }, 300); }
    onScroll();
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.body.classList.contains('menu-open')) setMenu(false); });

  /* copy link */
  var toast = d.getElementById('toast'), copy = d.getElementById('copyBtn');
  function show(msg) { toast.textContent = msg; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 2200); }
  copy.addEventListener('click', function () {
    var url = 'https://asha8-8.github.io/founder-profile/';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { show('Link copied'); }, function () { show(url); });
    } else { show(url); }
  });
})();
