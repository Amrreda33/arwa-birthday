/* ==========================================================================
   core.js  -  small helpers shared by every other file.
   (Nothing to edit in the js/ or css/ folders. Your content is in content/.)
   ========================================================================== */
(function () {
  'use strict';

  var BS = (window.BS = window.BS || {});

  /* ------------------------------------------------------------------
     Motion preference
     ------------------------------------------------------------------ */
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  BS.reduced = !!(mq && mq.matches);
  document.documentElement.classList.toggle('reduce-motion', BS.reduced);
  if (mq) {
    var onMq = function (e) {
      BS.reduced = e.matches;
      document.documentElement.classList.toggle('reduce-motion', e.matches);
    };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  /* ------------------------------------------------------------------
     Tiny utilities
     ------------------------------------------------------------------ */
  BS.sleep = function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, BS.reduced ? Math.min(ms, 40) : ms);
    });
  };

  BS.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  BS.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  BS.buzz = function (ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms || 10); } catch (e) { /* ignore */ }
  };

  // small seeded random (so tilts/placeholders are stable between visits)
  BS.rng = function (seed) {
    var a = (seed || 1) >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /* ------------------------------------------------------------------
     DOM builder:  BS.el('div', { class:'x', text:'hi', on... }, [children])
     ------------------------------------------------------------------ */
  function append(node, kids) {
    if (kids == null || kids === false) return;
    if (!Array.isArray(kids)) kids = [kids];
    kids.forEach(function (k) {
      if (k == null || k === false) return;
      node.appendChild(typeof k === 'string' || typeof k === 'number' ? document.createTextNode(String(k)) : k);
    });
  }

  BS.el = function (tag, props, kids) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style') node.style.cssText = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      });
    }
    append(node, kids);
    return node;
  };

  /* ------------------------------------------------------------------
     Icons (simple line icons, all drawn here so there are no files to load)
     ------------------------------------------------------------------ */
  var ICONS = {
    play: '<path d="M8.5 5.4v13.2a1 1 0 0 0 1.52.85l10.4-6.6a1 1 0 0 0 0-1.7L10.02 4.55A1 1 0 0 0 8.5 5.4z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/>',
    volume: '<path d="M11 5 6.5 9H3.5v6h3L11 19V5z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6"/><path d="M18.2 6.6a8 8 0 0 1 0 10.8"/>',
    mute: '<path d="M11 5 6.5 9H3.5v6h3L11 19V5z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    cross: '<path d="M7 7l10 10M17 7L7 17"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M2.5 12S6 5.5 12 5.5c2 0 3.7.7 5.1 1.6M21.5 12S18 18.5 12 18.5c-2 0-3.7-.7-5.1-1.6"/><path d="M4 4l16 16"/><path d="M9.9 9.9A3 3 0 0 0 14.1 14.1"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="4.5" rx="1.2"/><path d="M5 13v7h14v-7"/><path d="M12 8.5V20"/><path d="M12 8.5C10.6 4.6 6 4.4 6.8 7c.5 1.6 3.1 1.5 5.2 1.5zM12 8.5c1.4-3.9 6-4.1 5.2-1.5-.5 1.6-3.1 1.5-5.2 1.5z"/>',
    heart: '<path d="M12 20.4s-7.6-4.6-9.2-9.5C1.6 7.4 3.8 4.4 7 4.4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.2 0 5.4 3 4.2 6.5-1.6 4.9-9.2 9.5-9.2 9.5z"/>',
    heartfill: '<path d="M12 20.4s-7.6-4.6-9.2-9.5C1.6 7.4 3.8 4.4 7 4.4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.2 0 5.4 3 4.2 6.5-1.6 4.9-9.2 9.5-9.2 9.5z" fill="currentColor" stroke="none"/>',
    sparkle: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/>',
    music: '<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    replay: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4.2v4.6h4.6"/>',
    pin: '<path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
    camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.2-2h6.6l1.2 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9z"/><circle cx="12" cy="13" r="3.4"/>'
  };

  BS.icon = function (name, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  };

  /* ------------------------------------------------------------------
     Data cleaning: turns whatever is in birthdayData.js into something safe
     ------------------------------------------------------------------ */
  function str(v) { return v == null ? '' : String(v).trim(); }
  function arr(v) { return Array.isArray(v) ? v : []; }
  function isObj(v) { return v && typeof v === 'object'; }

  BS.normalize = function (raw) {
    raw = isObj(raw) ? raw : {};
    var d = {};
    d.language = raw.language === 'ar' ? 'ar' : 'en';
    d.recipientGender = raw.recipientGender === 'male' ? 'male' : 'female';
    d.recipientName = str(raw.recipientName) || (d.language === 'ar' ? 'حبيبي' : 'You');
    d.senderName = str(raw.senderName);
    d.birthdayDate = str(raw.birthdayDate);
    d.timezone = str(raw.timezone);
    d.personalLine = str(raw.personalLine);

    d.musicFile = str(raw.musicFile);
    d.musicTitle = str(raw.musicTitle);
    d.musicArtist = str(raw.musicArtist);

    d.birthdayMessage = str(raw.birthdayMessage);

    d.memories = arr(raw.memories).filter(isObj).map(function (m) {
      return {
        image: str(m.image), date: str(m.date), title: str(m.title),
        caption: str(m.caption), location: str(m.location), memory: str(m.memory)
      };
    });

    d.timeline = arr(raw.timeline).filter(isObj).map(function (t) {
      return { date: str(t.date), title: str(t.title), description: str(t.description), image: str(t.image) };
    }).filter(function (t) { return t.title || t.description || t.date; });

    d.thingsILove = arr(raw.thingsILove).filter(isObj).map(function (t) {
      return { title: str(t.title), text: str(t.text) };
    }).filter(function (t) { return t.title || t.text; });

    d.quizQuestions = arr(raw.quizQuestions).filter(isObj).map(function (q) {
      var opts = arr(q.options).map(str).filter(Boolean).slice(0, 6);
      var c = parseInt(q.correct, 10);
      if (!(c >= 1 && c <= opts.length)) c = 1;
      return { question: str(q.question), options: opts, correct: c - 1, explanation: str(q.explanation) };
    }).filter(function (q) { return q.question && q.options.length >= 2; });

    d.quizResults = arr(raw.quizResults).filter(isObj).map(function (r) {
      return { minScore: parseInt(r.minScore, 10) || 0, title: str(r.title), message: str(r.message) };
    }).sort(function (a, b) { return b.minScore - a.minScore; });

    d.password = str(raw.password);
    d.passwordHint = str(raw.passwordHint);
    d.secretMessage = str(raw.secretMessage);
    d.finalThanks = str(raw.finalThanks);
    d.finalMessage = str(raw.finalMessage);
    d.text = isObj(raw.text) ? raw.text : {};
    return d;
  };

  /* ------------------------------------------------------------------
     Language + wording
     ------------------------------------------------------------------ */
  var dict = {};

  BS.setup = function (d) {
    BS.d = d;
    BS.lang = d.language;
    BS.rtl = d.language === 'ar';
    BS.female = d.recipientGender !== 'male';
    BS.name = d.recipientName;
    var all = window.UI_TEXT || { en: {}, ar: {} };
    dict = {};
    [all.en, all[BS.lang], d.text].forEach(function (src) {
      if (!src) return;
      Object.keys(src).forEach(function (k) {
        if (typeof src[k] === 'string' && src[k] !== '') dict[k] = src[k];
      });
    });
    var root = document.documentElement;
    root.lang = BS.lang;
    root.dir = BS.rtl ? 'rtl' : 'ltr';
  };

  // {man|woman}  ->  picks the right side (Arabic grammar)
  BS.gender = function (s) {
    return String(s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g, function (_, m, f) { return BS.female ? f : m; });
  };

  BS.fmt = function (s, vars) {
    vars = vars || {};
    if (vars.name == null) vars.name = BS.name;
    var out = String(s == null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) {
      return vars[k] != null ? vars[k] : m;
    });
    return BS.gender(out);
  };

  BS.t = function (key, vars) {
    var s = dict[key];
    if (s == null) s = key;
    return BS.fmt(s, vars);
  };

  BS.hasArabic = function (s) { return /[\u0600-\u06FF]/.test(s || ''); };

  BS.fmtDate = function (ms, tz) {
    var loc = BS.rtl ? 'ar-EG-u-nu-latn' : 'en-GB';
    var opts = { day: 'numeric', month: 'long', year: 'numeric' };
    try {
      if (tz) opts.timeZone = tz;
      return new Intl.DateTimeFormat(loc, opts).format(new Date(ms));
    } catch (e) {
      try { delete opts.timeZone; return new Intl.DateTimeFormat(loc, opts).format(new Date(ms)); }
      catch (e2) { return new Date(ms).toDateString(); }
    }
  };

  /* ------------------------------------------------------------------
     Message text -> paragraphs -> little chunks that fade in one by one
     ------------------------------------------------------------------ */
  BS.paragraphs = function (raw) {
    var txt = BS.fmt(String(raw || '').replace(/\r\n?/g, '\n').trim());
    if (!txt) return [];
    return txt.split(/\n[ \t]*\n/).map(function (p) {
      return p.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    }).filter(function (p) { return p.length; });
  };

  BS.splitChunks = function (line) {
    var out = [];
    var re = /\*([^*\n]+)\*/g;
    var last = 0, m;
    function sentences(s) {
      var parts = s.match(/[^.!?\u061F\u2026]+(?:[.!?\u061F\u2026]+["'\u201D\u2019)\]]*)?\s*/g);
      (parts || [s]).forEach(function (x) { if (x) out.push({ text: x, hl: false }); });
    }
    while ((m = re.exec(line))) {
      if (m.index > last) sentences(line.slice(last, m.index));
      out.push({ text: m[1], hl: true });
      last = m.index + m[0].length;
    }
    if (last < line.length) sentences(line.slice(last));
    return out;
  };

  // Fills `container` with the paragraphs; returns the list of chunk elements
  BS.buildText = function (container, raw) {
    var chunks = [];
    BS.paragraphs(raw).forEach(function (lines) {
      var p = BS.el('p', { class: 'txt__p' });
      lines.forEach(function (line, li) {
        var ln = BS.el('span', { class: 'txt__ln' });
        var parts = BS.splitChunks(line);
        parts.forEach(function (part, ci) {
          var node = BS.el(part.hl ? 'mark' : 'span', { class: 'ck' + (part.hl ? ' hl' : ''), text: part.text });
          if (ci === parts.length - 1) node.setAttribute('data-end', li === lines.length - 1 ? 'p' : 'l');
          ln.appendChild(node);
          chunks.push(node);
        });
        p.appendChild(ln);
      });
      container.appendChild(p);
    });
    return chunks;
  };

  // Reveals chunks one after another. Returns { done: Promise, skip() }
  BS.playText = function (chunks, opts) {
    opts = opts || {};
    var i = 0, timer = null, cancelled = false, finish;
    var done = new Promise(function (res) { finish = res; });

    function step() {
      if (cancelled) return;
      if (i >= chunks.length) { finish(); return; }
      var c = chunks[i++];
      c.classList.add('is-in');
      if (opts.onChunk) opts.onChunk(c);
      var len = (c.textContent || '').length;
      var gap = BS.reduced ? 0 : Math.min(1500, 240 + len * (opts.perChar || 26));
      var end = c.getAttribute('data-end');
      if (!BS.reduced) gap += end === 'p' ? 420 : end === 'l' ? 170 : 0;
      timer = setTimeout(step, gap);
    }
    step();

    return {
      done: done,
      skip: function () {
        if (cancelled) return;
        cancelled = true;
        clearTimeout(timer);
        chunks.forEach(function (c) { c.classList.add('is-in'); });
        finish();
      }
    };
  };

  // Lets a paper/panel grow downward as its words are written, instead of
  // showing up as a huge empty sheet. Needs the paper to be position:relative.
  BS.grower = function (paper) {
    var padB = parseFloat(getComputedStyle(paper).paddingBottom) || 0;
    function bottomOf(node) {
      var y = 0, n = node;
      while (n && n !== paper) { y += n.offsetTop; n = n.offsetParent; }
      return y + node.offsetHeight;
    }
    var timer = null;
    return {
      init: function (firstNode) {
        clearTimeout(timer);
        paper.style.overflow = 'hidden';
        paper.style.height = Math.ceil(bottomOf(firstNode) + padB) + 'px';
      },
      to: function (node) { paper.style.height = Math.ceil(bottomOf(node) + padB) + 'px'; },
      finish: function () {
        paper.style.height = paper.scrollHeight + 'px';
        timer = setTimeout(function () { paper.style.height = ''; paper.style.overflow = ''; }, BS.reduced ? 0 : 900);
      }
    };
  };

  // Gently keeps the newest line in view while text appears (unless the reader scrolls)
  var lastUserScroll = 0;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) {
    window.addEventListener(ev, function () { lastUserScroll = Date.now(); }, { passive: true });
  });
  BS.follow = function (node) {
    if (BS.reduced || Date.now() - lastUserScroll < 3500) return;
    var r = node.getBoundingClientRect();
    var limit = window.innerHeight * 0.78;
    if (r.bottom > limit) window.scrollBy({ top: r.bottom - limit + 40, behavior: 'smooth' });
  };

  /* ------------------------------------------------------------------
     Scrolling / observing / fitting
     ------------------------------------------------------------------ */
  BS.scrollToEl = function (node, block) {
    node.scrollIntoView({ behavior: BS.reduced ? 'auto' : 'smooth', block: block || 'start' });
  };

  BS.observe = function (node, cb, opts) {
    opts = opts || {};
    if (!('IntersectionObserver' in window)) { cb(node); return function () {}; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          cb(e.target, e);
          if (opts.once !== false) io.unobserve(e.target);
        }
      });
    }, { threshold: opts.threshold || 0, rootMargin: opts.rootMargin || '0px' });
    io.observe(node);
    return function () { io.disconnect(); };
  };

  // Shrinks font-size until the element fits inside `box` on one line
  BS.fitText = function (el, box, minPx) {
    el.style.fontSize = '';
    var size = parseFloat(getComputedStyle(el).fontSize) || 48;
    var guard = 80;
    while (guard-- > 0 && size > minPx && el.scrollWidth > box.clientWidth + 1) {
      size -= 2;
      el.style.fontSize = size + 'px';
    }
  };

  BS.debounce = function (fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  };

  /* ------------------------------------------------------------------
     Photos: shows a soft placeholder when a file is missing or still loading
     ------------------------------------------------------------------ */
  var PH_BG = [
    'radial-gradient(70% 60% at 28% 24%, rgba(233,163,180,.50), transparent 70%), linear-gradient(160deg,#4B2B66,#22143A)',
    'radial-gradient(70% 60% at 72% 28%, rgba(244,166,122,.42), transparent 70%), linear-gradient(160deg,#432452,#1E1232)',
    'radial-gradient(70% 60% at 50% 78%, rgba(123,98,196,.50), transparent 70%), linear-gradient(160deg,#35244F,#1A1030)',
    'radial-gradient(70% 60% at 24% 72%, rgba(242,223,192,.32), transparent 70%), linear-gradient(160deg,#502A55,#26153A)'
  ];

  // opts: { src, alt, index, eager, minAr, maxAr, onSize }
  BS.photo = function (opts) {
    var wrap = BS.el('div', { class: 'photo' });
    var ph = BS.el('div', {
      class: 'photo__ph',
      style: 'background:' + PH_BG[(opts.index || 0) % PH_BG.length],
      html: BS.icon('camera') + '<span>' + BS.esc(BS.t('photoSoon')) + '</span>'
    });
    wrap.appendChild(ph);

    if (!opts.src) { wrap.classList.add('is-missing'); return wrap; }

    var img = new Image();
    img.className = 'photo__img';
    img.alt = opts.alt || '';
    img.decoding = 'async';
    img.draggable = false;
    if (!opts.eager) img.loading = 'lazy';
    img.onload = function () {
      var ar = img.naturalWidth / (img.naturalHeight || 1);
      if (opts.minAr || opts.maxAr) ar = BS.clamp(ar, opts.minAr || 0.1, opts.maxAr || 10);
      if (opts.fitRatio !== false) wrap.style.setProperty('--ar', ar.toFixed(4));
      wrap.classList.add('is-loaded');
      if (opts.onSize) opts.onSize(ar, img);
    };
    img.onerror = function () {
      wrap.classList.add('is-missing');
      if (img.parentNode) img.parentNode.removeChild(img);
    };
    img.src = opts.src;
    wrap.appendChild(img);
    return wrap;
  };

})();
