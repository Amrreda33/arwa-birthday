/* ==========================================================================
   lightbox.js  -  the full-screen photo viewer (swipe, arrow keys, Esc)
   ========================================================================== */
(function () {
  'use strict';
  var BS = window.BS;
  var LB = (BS.lightbox = {});

  var root, els = {}, items = [], idx = 0, ratio = 0.8, opener = null, isOpen = false, busy = false;

  function fit() {
    if (!els.stage) return;
    var cs = getComputedStyle(els.stage);
    var w = els.stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var h = els.stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (w <= 0 || h <= 0) return;
    var fw = w, fh = w / ratio;
    if (fh > h) { fh = h; fw = h * ratio; }
    els.frame.style.width = Math.max(140, Math.floor(fw)) + 'px';
    els.frame.style.height = Math.max(140, Math.floor(fh)) + 'px';
  }

  function setText(elm, value) {
    elm.textContent = value || '';
    elm.hidden = !value;
  }

  function render(i) {
    var m = items[i];
    idx = i;
    els.frame.innerHTML = '';
    ratio = 0.8;
    els.frame.appendChild(BS.photo({
      src: m.image, alt: m.title || m.caption || '', index: i, eager: true, fitRatio: false,
      onSize: function (ar) { ratio = ar; fit(); }
    }));

    setText(els.date, m.date);
    setText(els.title, m.title);
    setText(els.cap, m.caption);
    setText(els.story, m.memory);
    els.loc.hidden = !m.location;
    els.locText.textContent = m.location || '';
    els.count.textContent = BS.t('photoCount', { n: i + 1, total: items.length });
    els.prev.disabled = i === 0;
    els.next.disabled = i === items.length - 1;
    els.info.scrollTop = 0;
    els.root.setAttribute('aria-label', BS.t('lbLabel') + ': ' + (m.title || (i + 1)));

    fit();
    requestAnimationFrame(fit);

    // warm up neighbours
    [i - 1, i + 1].forEach(function (n) {
      if (items[n] && items[n].image) { var im = new Image(); im.src = items[n].image; }
    });
  }

  function go(dir) {
    var n = idx + dir;
    if (n < 0 || n >= items.length || busy) return;
    if (BS.reduced || !els.frame.animate) { render(n); return; }
    busy = true;
    var sign = BS.rtl ? -1 : 1;
    var out = els.frame.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(' + (-dir * sign * 34) + 'px) scale(.97)' }],
      { duration: 200, easing: 'ease-in', fill: 'forwards' }
    );
    out.onfinish = function () {
      render(n);
      var inn = els.frame.animate(
        [{ opacity: 0, transform: 'translateX(' + (dir * sign * 34) + 'px) scale(.97)' }, { opacity: 1, transform: 'none' }],
        { duration: 340, easing: 'cubic-bezier(.22,.8,.24,1)' }
      );
      out.cancel();
      inn.onfinish = function () { busy = false; };
    };
  }

  LB.open = function (i, originEl) {
    if (!items.length || isOpen) return;
    opener = originEl || document.activeElement;
    isOpen = true;
    render(i);
    document.body.classList.add('lb-open');
    var story = document.getElementById('story');
    if (story) story.inert = true;
    root.classList.add('is-open');

    if (!BS.reduced && els.frame.animate) {
      requestAnimationFrame(function () {
        var fr = els.frame.getBoundingClientRect();
        var ox = fr.width / 2, oy = fr.height / 2;
        if (originEl && originEl.getBoundingClientRect) {
          var or = originEl.getBoundingClientRect();
          ox = or.left + or.width / 2 - fr.left;
          oy = or.top + or.height / 2 - fr.top;
        }
        els.frame.animate(
          [{ opacity: 0, transform: 'scale(.55)', transformOrigin: ox + 'px ' + oy + 'px' },
           { opacity: 1, transform: 'none', transformOrigin: ox + 'px ' + oy + 'px' }],
          { duration: 560, easing: 'cubic-bezier(.22,.8,.24,1)' }
        );
      });
    }
    setTimeout(function () { els.close.focus({ preventScroll: true }); }, 60);
  };

  LB.close = function () {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('is-open');
    document.body.classList.remove('lb-open');
    var story = document.getElementById('story');
    if (story) story.inert = false;
    if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  };

  LB.init = function (mount, memories) {
    items = memories || [];
    if (!items.length) return;

    els.close = BS.el('button', { class: 'lb__close', type: 'button', 'aria-label': BS.t('lbClose'), html: BS.icon('close') });
    els.frame = BS.el('div', { class: 'lb__frame' });
    els.stage = BS.el('div', { class: 'lb__stage' }, [els.frame]);
    els.date = BS.el('p', { class: 'lb__date' });
    els.title = BS.el('h3', { class: 'lb__title' });
    els.locText = BS.el('span');
    els.loc = BS.el('p', { class: 'lb__loc' }, [BS.el('span', { html: BS.icon('pin') }), els.locText]);
    els.cap = BS.el('p', { class: 'lb__cap' });
    els.story = BS.el('p', { class: 'lb__story' });
    els.prev = BS.el('button', { class: 'lb__arrow', type: 'button', 'aria-label': BS.t('lbPrev'), html: BS.icon('left') });
    els.next = BS.el('button', { class: 'lb__arrow', type: 'button', 'aria-label': BS.t('lbNext'), html: BS.icon('right') });
    els.count = BS.el('span', { class: 'lb__count', 'aria-live': 'polite' });
    els.info = BS.el('div', { class: 'lb__info' }, [
      els.date, els.title, els.loc, els.cap, els.story,
      BS.el('div', { class: 'lb__nav' }, [els.prev, els.count, els.next])
    ]);

    root = els.root = BS.el('div', { class: 'lb', role: 'dialog', 'aria-modal': 'true', 'aria-label': BS.t('lbLabel') }, [
      BS.el('div', { class: 'lb__backdrop' }), els.close, els.stage, els.info
    ]);
    mount.appendChild(root);

    els.close.addEventListener('click', LB.close);
    els.prev.addEventListener('click', function () { go(-1); });
    els.next.addEventListener('click', function () { go(1); });
    els.root.querySelector('.lb__backdrop').addEventListener('click', LB.close);

    /* keyboard */
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { LB.close(); return; }
      var fwd = BS.rtl ? 'ArrowLeft' : 'ArrowRight', back = BS.rtl ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === fwd) go(1);
      else if (e.key === back) go(-1);
      else if (e.key === 'Tab') {
        var f = [els.close, els.prev, els.next].filter(function (b) { return !b.disabled; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (f.indexOf(document.activeElement) === -1) { e.preventDefault(); first.focus(); }
      }
    });

    /* swipe: sideways = next/previous, down = close, tap on the dark = close */
    var sx = 0, sy = 0, dx = 0, dy = 0, tracking = false, moved = false;
    els.stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('button')) return;
      tracking = true; moved = false; sx = e.clientX; sy = e.clientY; dx = dy = 0;
      try { els.stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    els.stage.addEventListener('pointermove', function (e) {
      if (!tracking || busy) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
      if (Math.abs(dx) >= Math.abs(dy)) els.frame.style.transform = 'translateX(' + dx * 0.6 + 'px)';
      else if (dy > 0) els.frame.style.transform = 'translateY(' + dy * 0.6 + 'px) scale(' + (1 - Math.min(dy / 900, 0.1)) + ')';
    });
    function endSwipe(e) {
      if (!tracking) return;
      tracking = false;
      els.frame.style.transition = 'transform .35s cubic-bezier(.22,.8,.24,1)';
      els.frame.style.transform = '';
      setTimeout(function () { els.frame.style.transition = ''; }, 380);
      if (!moved) { if (e && e.target === els.stage) LB.close(); return; }
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go((dx < 0 ? 1 : -1) * (BS.rtl ? -1 : 1));
      else if (dy > 100 && Math.abs(dy) > Math.abs(dx)) LB.close();
    }
    els.stage.addEventListener('pointerup', endSwipe);
    els.stage.addEventListener('pointercancel', endSwipe);

    window.addEventListener('resize', BS.debounce(function () { if (isOpen) fit(); }, 120));
  };
})();
