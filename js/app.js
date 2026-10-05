/* ==========================================================================
   app.js  -  the conductor.
   Order of events:
     countdown (only before the birthday)  ->  opening screen  ->  story
   The story is a single long scroll made of chapters. Each chapter is
   unlocked by the "Continue" button of the one before it, so the surprise
   always arrives in the right order.
   ========================================================================== */
(function () {
  'use strict';
  var BS = window.BS;

  var ORDER = ['reveal', 'letter', 'memories', 'story', 'loves', 'quiz', 'secret', 'gift', 'finale'];

  var screensRoot, storyRoot, progressEl, chapters = [], liveCount = 0;

  /* ------------------------------------------------------------------
     Friendly error screen (for typos in birthdayData.js)
     ------------------------------------------------------------------ */
  function fatal(detail, isData) {
    var box = BS.el('div', { class: 'fatal is-on' }, [
      BS.el('div', { class: 'fatal__box' }, [
        BS.el('h1', { text: isData ? 'Almost there: one small fix needed' : 'Something went wrong' }),
        BS.el('p', { text: isData
          ? 'The website could not read content/birthdayData.js. This is usually a missing quote " or comma , or a bracket near the last thing you edited.'
          : 'The page could not start. Try refreshing it.' }),
        detail ? BS.el('code', { text: detail }) : null,
        BS.el('div', { class: 'fatal__ar' }, [
          BS.el('h1', { text: isData ? 'خطوة صغيرة ونخلص' : 'حصلت مشكلة' }),
          BS.el('p', { text: isData
            ? 'الموقع مش قادر يقرا ملف content/birthdayData.js. غالبًا في علامة تنصيص " أو فاصلة , أو قوس ناقص جنب آخر حاجة عدّلتها.'
            : 'الصفحة مقدرتش تشتغل. جرّب تعمل تحديث للصفحة.' })
        ])
      ])
    ]);
    document.body.appendChild(box);
    document.body.classList.remove('is-locked');
  }

  /* ------------------------------------------------------------------
     Screens (full-page moments that sit above the story)
     ------------------------------------------------------------------ */
  function showScreen(node) {
    screensRoot.appendChild(node);
    requestAnimationFrame(function () { requestAnimationFrame(function () { node.classList.add('is-on'); }); });
    return node;
  }

  function hideScreen(node) {
    node.classList.add('is-leaving');
    return new Promise(function (res) {
      setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); res(); }, BS.reduced ? 40 : 1150);
    });
  }

  function setMood(m) { document.body.setAttribute('data-mood', m); }

  /* ------------------------------------------------------------------
     Opening screen
     ------------------------------------------------------------------ */
  function openingScreen() {
    var l1 = BS.el('p', { class: 'open__l1 seq', text: BS.t('openLine1') });
    var l2 = BS.el('p', { class: 'open__l2 seq', text: BS.t('openLine2') });
    var btn = BS.el('button', {
      class: 'btn btn--primary open__btn seq', type: 'button', disabled: 'disabled',
      html: BS.icon('gift') + '<span>' + BS.esc(BS.t('openButton')) + '</span>'
    });
    var node = BS.el('section', { class: 'screen screen--open', 'aria-label': BS.t('openLine1') }, [l1, l2, btn]);

    showScreen(node);
    BS.music.warm();

    var t = BS.reduced ? [0, 0, 0] : [900, 3000, 4900];
    setTimeout(function () { l1.classList.add('is-in'); }, t[0]);
    setTimeout(function () { l2.classList.add('is-in'); }, t[1]);
    setTimeout(function () { btn.classList.add('is-in'); btn.disabled = false; btn.focus({ preventScroll: true }); }, t[2]);

    return new Promise(function (resolve) {
      btn.addEventListener('click', function () {
        // must happen right inside the tap, or browsers block the music
        BS.music.start();
        BS.buzz(16);
        resolve(node);
      });
    });
  }

  /* ------------------------------------------------------------------
     Building the chapters
     ------------------------------------------------------------------ */
  function buildStory(d) {
    var defs = ORDER.map(function (id) { return BS.chapters[id]; }).filter(function (def) { return def && def.available(d); });

    defs.forEach(function (def, i) {
      var section = BS.el('section', { class: 'chapter chapter--' + def.id, id: 'ch-' + def.id, 'data-mood': def.mood, hidden: true });
      var inner = BS.el('div', { class: 'chapter__inner' });
      section.appendChild(inner);

      var c = { def: def, section: section, inner: inner, index: i, live: false, entered: false, hooks: {}, nextBtn: null, nextWrap: null };
      var nextDef = defs[i + 1];

      if (nextDef) {
        c.nextBtn = BS.el('button', { class: 'btn btn--primary', type: 'button', text: BS.t('go_' + nextDef.id) });
        c.nextWrap = BS.el('div', { class: 'chapter__next' }, [c.nextBtn]);
        section.appendChild(c.nextWrap);
        c.nextBtn.addEventListener('click', function () {
          c.nextBtn.disabled = true;
          unlock(i + 1);
        });
      }

      var ctx = {
        d: d, section: section, inner: inner, nextBtn: c.nextBtn, nextWrap: c.nextWrap,
        title: function (text, sub) {
          var head = BS.el('header', { class: 'chapter__head' });
          var h = BS.el('h2', { class: 'chapter__title', id: 'h-' + def.id, tabindex: '-1', text: text });
          head.appendChild(h);
          if (sub) head.appendChild(BS.el('p', { class: 'chapter__sub', text: sub }));
          inner.appendChild(head);
          section.setAttribute('aria-labelledby', 'h-' + def.id);
          c.heading = h;
          return head;
        },
        showNext: function () { if (c.nextWrap) c.nextWrap.classList.add('is-ready'); }
      };

      c.hooks = def.build(d, ctx) || {};
      chapters.push(c);
      storyRoot.appendChild(section);
    });
  }

  function enterChapter(c) {
    if (c.entered) return;
    c.entered = true;
    if (c.hooks.enter) c.hooks.enter();
    if (c.def.autoNext != null && c.nextWrap) {
      setTimeout(function () { c.nextWrap.classList.add('is-ready'); }, BS.reduced ? 0 : c.def.autoNext);
    }
  }

  function updateProgress() {
    progressEl.firstElementChild.style.setProperty('--p', (liveCount / chapters.length).toFixed(3));
  }

  function unlock(i) {
    var c = chapters[i];
    if (!c || c.live) return;
    c.live = true;
    liveCount++;
    c.section.hidden = false;
    c.section.classList.add('is-live');
    updateProgress();

    requestAnimationFrame(function () {
      BS.scrollToEl(c.section, 'start');
      setTimeout(function () {
        enterChapter(c);
        if (c.heading) c.heading.focus({ preventScroll: true });
      }, BS.reduced ? 0 : 750);
    });
  }

  /* which chapter is on screen decides the light in the room */
  function watchMood() {
    var ticking = false;
    function update() {
      ticking = false;
      var mid = window.innerHeight * 0.5;
      var found = null;
      for (var i = chapters.length - 1; i >= 0; i--) {
        var c = chapters[i];
        if (!c.live) continue;
        var r = c.section.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) { found = c; break; }
      }
      if (found) {
        setMood(found.def.mood);
        BS.fx.setAmbientMode(found.def.id === 'finale' ? 'stars' : 'dust');
      }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function boot() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    screensRoot = document.getElementById('screens');
    storyRoot = document.getElementById('story');
    progressEl = document.getElementById('progress');

    if (!window.BIRTHDAY_DATA) {
      var e = (window.__errs || []).filter(function (x) { return /birthdayData/i.test(x.file); })[0];
      fatal(e ? 'Line ' + e.line + ': ' + e.msg : 'content/birthdayData.js was not found or is empty.', true);
      return;
    }

    var d = BS.normalize(window.BIRTHDAY_DATA);
    BS.setup(d);
    document.title = BS.t('pageTitle');

    BS.fx.initAmbient(document.getElementById('dust'));
    BS.fx.initBurst(document.getElementById('fx'));
    BS.music.init(d, document.getElementById('player-root'));
    BS.lightbox.init(document.getElementById('lightbox-root'), d.memories);

    buildStory(d);
    storyRoot.inert = true;

    var target = BS.birthdayMoment(d);
    var preview = /[?&]preview(=|&|$)/.test(window.location.search);
    var before = !isNaN(target) && Date.now() < target && !preview;

    var step = Promise.resolve();

    if (before) {
      var cd = BS.buildCountdown(target, d.timezone);
      showScreen(cd.node);
      step = cd.ready.then(function () { cd.stop(); return hideScreen(cd.node); });
    }

    step.then(function () {
      setMood('night');
      return openingScreen();
    }).then(function (openNode) {
      setMood('ember');
      hideScreen(openNode);
      storyRoot.inert = false;
      document.body.classList.remove('is-locked');
      progressEl.classList.add('is-on');
      watchMood();
      var first = chapters[0];
      first.live = true;
      first.section.hidden = false;
      first.section.classList.add('is-live');
      liveCount = 1;
      updateProgress();
      setTimeout(function () { enterChapter(first); }, BS.reduced ? 0 : 700);
    });
  }

  function start() {
    try { boot(); } catch (err) {
      if (window.console) console.error(err);
      fatal(err && err.message ? err.message : String(err), false);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
