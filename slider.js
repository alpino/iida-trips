// 横スワイプ系スライダー (.compare-slider / .photos) に
// PC向けの矢印ボタン / マウスドラッグ / キーボード矢印キー操作を追加する

(function () {
  function enhance(slider) {
    if (slider.dataset.scrollEnhanced) return;
    slider.dataset.scrollEnhanced = '1';

    // Wrap with .scroll-control for absolute-positioned arrows
    var wrap = document.createElement('div');
    wrap.className = 'scroll-control';
    slider.parentNode.insertBefore(wrap, slider);
    wrap.appendChild(slider);

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'scroll-btn prev';
    prev.setAttribute('aria-label', '前へスクロール');
    prev.textContent = '‹';
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'scroll-btn next';
    next.setAttribute('aria-label', '次へスクロール');
    next.textContent = '›';
    wrap.appendChild(prev);
    wrap.appendChild(next);

    function stepWidth() {
      var first = slider.firstElementChild;
      var w = first ? first.offsetWidth : 300;
      var style = getComputedStyle(slider);
      var gap = parseFloat(style.columnGap || style.gap) || 0;
      return w + gap;
    }

    function updateDisabled() {
      var maxScroll = slider.scrollWidth - slider.clientWidth;
      prev.disabled = slider.scrollLeft <= 1;
      next.disabled = slider.scrollLeft >= maxScroll - 1;
    }

    prev.addEventListener('click', function () {
      slider.scrollBy({ left: -stepWidth(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      slider.scrollBy({ left: stepWidth(), behavior: 'smooth' });
    });
    slider.addEventListener('scroll', updateDisabled, { passive: true });
    window.addEventListener('resize', updateDisabled);
    updateDisabled();

    // Mouse drag-to-scroll (PC only)
    var isDown = false, startX = 0, startScroll = 0, moved = false;
    slider.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDown = true; moved = false;
      startX = e.pageX;
      startScroll = slider.scrollLeft;
      slider.style.scrollSnapType = 'none';
    });
    window.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      slider.scrollLeft = startScroll - dx;
    });
    window.addEventListener('mouseup', function () {
      if (!isDown) return;
      isDown = false;
      // restore snap after a moment so smooth glide isn't disrupted
      setTimeout(function () { slider.style.scrollSnapType = ''; }, 60);
    });
    // Prevent text drag/select hijack from triggering link clicks after drag
    slider.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);

    // Keyboard arrows when slider has focus
    slider.tabIndex = 0;
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev.click(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
    });
  }

  function init() {
    var sliders = document.querySelectorAll('.compare-slider, .photos');
    sliders.forEach(enhance);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
