/* ==========================================================================
   chapters-a.js  -  the first three chapters of the story:
   the name reveal, the letter, and the memories gallery.

   Every chapter is registered with BS.defineChapter(id, { mood, available,
   build }). app.js puts them in order and unlocks them one at a time.
   ========================================================================== */
(function () {
  'use strict';
  var BS = window.BS;

  BS.chapters = BS.chapters || {};
  BS.defineChapter = function (id, def) { def.id = id; BS.chapters[id] = def; };

  var HEART_PATH = 'M12 20.4s-7.6-4.6-9.2-9.5C1.6 7.4 3.8 4.4 7 4.4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.2 0 5.4 3 4.2 6.5-1.6 4.9-9.2 9.5-9.2 9.5z';
  BS.heartSvg = '<svg class="heart-draw" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path pathLength="1" d="' + HEART_PATH + '"/></svg>';

  // The front of the envelope: two side folds + the bottom fold (drawn as one small SVG)
  var POCKET_SVG =
    '<svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
    '<polygon points="0,0 0,200 150,108" fill="#CD8097"/>' +
    '<polygon points="300,0 300,200 150,108" fill="#C77992"/>' +
    '<polygon points="0,200 150,96 300,200" fill="#DE98AC"/>' +
    '<path d="M0 200L150 96L300 200" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>' +
    '</svg>';

  /* ======================================================================
     1) The reveal: "Happy Birthday" + the name, big
     ====================================================================== */
  BS.defineChapter('reveal', {
    mood: 'ember',
    autoNext: 5400,
    available: function () { return true; },
    build: function (d, ctx) {
      var name = d.recipientName;
      var arabic = BS.hasArabic(name);
      var words = name.split(/\s+/).filter(Boolean);

      var nameEl = BS.el('h1', { class: 'reveal__name' + (words.length > 1 ? ' is-multi' : ''), 'aria-label': name });
      var n = 0;
      words.forEach(function (word, wi) {
        var w = BS.el('span', { class: 'reveal__word', 'aria-hidden': 'true' });
        if (arabic) {
          // Arabic letters must stay joined, so the whole word appears at once
          w.appendChild(BS.el('span', { class: 'ch', style: '--i:' + (n * 3), text: word }));
          n++;
        } else {
          Array.from(word).forEach(function (chr) {
            w.appendChild(BS.el('span', { class: 'ch', style: '--i:' + n, text: chr }));
            n++;
          });
        }
        nameEl.appendChild(w);
        if (wi < words.length - 1) nameEl.appendChild(document.createTextNode(' '));
      });

      var inner = ctx.inner;
      inner.appendChild(BS.el('div', { class: 'reveal__bloom', 'aria-hidden': 'true' }));
      inner.appendChild(BS.el('p', { class: 'reveal__kicker', text: BS.t('revealKicker') }));
      inner.appendChild(nameEl);
      inner.appendChild(BS.el('span', { class: 'reveal__heart', html: BS.heartSvg }));
      if (d.personalLine) inner.appendChild(BS.el('p', { class: 'reveal__line', text: BS.fmt(d.personalLine) }));

      function fit() { BS.fitText(nameEl, inner, 40); }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
      window.addEventListener('resize', BS.debounce(fit, 150));

      return {
        enter: function () {
          fit();
          ctx.section.classList.add('is-playing');
          setTimeout(function () { BS.fx.rise(); }, BS.reduced ? 0 : 1100);
          setTimeout(function () { BS.fx.rise({ count: 18 }); }, BS.reduced ? 0 : 3600);
        }
      };
    }
  });

  /* ======================================================================
     2) The letter: an envelope that opens, then words that appear like ink
     ====================================================================== */
  BS.defineChapter('letter', {
    mood: 'rose',
    available: function (d) { return !!d.birthdayMessage; },
    build: function (d, ctx) {
      ctx.title(BS.t('letterTitle'));

      var env = BS.el('button', { class: 'envelope', type: 'button', 'aria-label': BS.t('letterOpenAria') }, [
        BS.el('span', { class: 'envelope__back' }),
        BS.el('span', { class: 'envelope__sheet' }),
        BS.el('span', { class: 'envelope__pocket', html: POCKET_SVG }),
        BS.el('span', { class: 'envelope__flap' }),
        BS.el('span', { class: 'envelope__seal', html: BS.icon('heartfill') })
      ]);

      var body = BS.el('div', { class: 'paper__body' });
      var chunks = BS.buildText(body, d.birthdayMessage);

      var sign = null;
      if (d.senderName) {
        var c1 = BS.el('span', { class: 'ck', text: BS.t('signoff'), 'data-end': 'l' });
        var c2 = BS.el('span', { class: 'ck paper__name', text: d.senderName, 'data-end': 'p' });
        sign = BS.el('p', { class: 'paper__sign' }, [BS.el('span', { class: 'txt__ln' }, [c1]), BS.el('span', { class: 'txt__ln' }, [c2])]);
        chunks.push(c1, c2);
      }

      var paper = BS.el('article', { class: 'paper', hidden: true, tabindex: '-1' }, [body, sign]);
      var stage = BS.el('div', { class: 'letter__stage' }, [env, paper]);
      var hint = BS.el('p', { class: 'letter__hint', text: BS.t('letterHint') });
      var wrap = BS.el('div', { class: 'letter' }, [stage, hint]);
      ctx.inner.appendChild(wrap);

      var opened = false, player = null;

      env.addEventListener('click', function () {
        if (opened) return;
        opened = true;
        BS.buzz(14);
        env.setAttribute('aria-expanded', 'true');
        wrap.classList.add('is-opening');

        var grow = null;
        BS.sleep(700).then(function () {
          wrap.classList.add('is-rising');
          return BS.sleep(800);
        }).then(function () {
          // the paper slides out and then "unrolls" as the words appear
          paper.hidden = false;
          grow = BS.grower(paper);
          grow.init(chunks[0]);
          wrap.classList.add('is-open');
          env.tabIndex = -1;
          env.setAttribute('aria-hidden', 'true');
          return BS.sleep(900);
        }).then(function () {
          paper.focus({ preventScroll: true });
          BS.fx.pop(chunks[0], 8);
          player = BS.playText(chunks, { onChunk: function (c) { grow.to(c); BS.follow(c); } });
          return player.done;
        }).then(function () {
          grow.finish();
          wrap.classList.add('is-done');
          return BS.sleep(700);
        }).then(function () { ctx.showNext(); });
      });

      // tap the paper while it's being written to show everything at once
      paper.addEventListener('click', function () { if (player) player.skip(); });

      return { enter: function () {} };
    }
  });

  /* ======================================================================
     3) Memories: a stream of polaroids + a full-screen viewer
     ====================================================================== */
  BS.defineChapter('memories', {
    mood: 'night',
    autoNext: 2200,
    available: function (d) { return d.memories.length > 0; },
    build: function (d, ctx) {
      ctx.section.classList.add('chapter--wide');
      ctx.title(BS.t('memTitle'), BS.t('memSub'));

      var track = BS.el('ul', { class: 'reel__track' });
      var reel = BS.el('div', { class: 'reel', role: 'region', 'aria-label': BS.t('memTitle'), tabindex: '0' }, [track]);
      var rnd = BS.rng(11);
      var dragMoved = false;

      var cards = d.memories.map(function (m, i) {
        var tilt = ((rnd() - 0.5) * 5.4).toFixed(2) + 'deg';
        var photo = BS.photo({ src: m.image, alt: m.title || m.caption || '', index: i, minAr: 0.74, maxAr: 1.36 });
        var cap = BS.el('span', { class: 'polaroid__cap' }, [
          m.title ? BS.el('span', { class: 'polaroid__title', text: m.title }) : null,
          m.date ? BS.el('span', { class: 'polaroid__date', text: m.date }) : null
        ]);
        var btn = BS.el('button', {
          class: 'polaroid__btn', type: 'button',
          'aria-label': BS.t('memOpen', { title: m.title || String(i + 1) })
        }, [BS.el('span', { class: 'polaroid__photo' }, [photo]), cap]);
        var li = BS.el('li', { class: 'polaroid', style: '--r:' + tilt }, [btn]);
        btn.addEventListener('click', function () {
          if (dragMoved) return;
          BS.lightbox.open(i, photo);
        });
        track.appendChild(li);
        return li;
      });

      var prev = BS.el('button', { class: 'reel__arrow', type: 'button', 'aria-label': BS.t('memPrev'), html: BS.icon('left') });
      var next = BS.el('button', { class: 'reel__arrow', type: 'button', 'aria-label': BS.t('memNext'), html: BS.icon('right') });
      var count = BS.el('span', { class: 'reel__count', 'aria-live': 'polite' });
      var nav = BS.el('div', { class: 'reel__nav' }, [prev, count, next]);
      ctx.inner.appendChild(reel);
      ctx.inner.appendChild(nav);
      ctx.inner.classList.add('is-wide');

      var current = 0, ticking = false;

      function update() {
        ticking = false;
        var rc = reel.getBoundingClientRect();
        var cx = rc.left + rc.width / 2, best = 0, bestD = Infinity;
        cards.forEach(function (li, i) {
          var r = li.getBoundingClientRect();
          var dist = Math.abs(r.left + r.width / 2 - cx);
          li.style.setProperty('--f', (1 - BS.clamp(dist / (r.width * 0.95), 0, 1)).toFixed(3));
          if (dist < bestD) { bestD = dist; best = i; }
        });
        current = best;
        count.textContent = BS.t('photoCount', { n: best + 1, total: cards.length });
        prev.disabled = best === 0;
        next.disabled = best === cards.length - 1;
      }
      function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
      reel.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', BS.debounce(update, 120));

      function goTo(i) {
        i = BS.clamp(i, 0, cards.length - 1);
        cards[i].scrollIntoView({ behavior: BS.reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      }
      prev.addEventListener('click', function () { goTo(current - 1); });
      next.addEventListener('click', function () { goTo(current + 1); });

      // desktop mouse: drag the reel sideways
      var down = false, startX = 0, startScroll = 0;
      reel.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        down = true; dragMoved = false; startX = e.clientX; startScroll = reel.scrollLeft;
      });
      window.addEventListener('pointermove', function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        if (!dragMoved && Math.abs(dx) > 6) { dragMoved = true; reel.classList.add('is-dragging'); }
        if (dragMoved) reel.scrollLeft = startScroll - dx;
      });
      window.addEventListener('pointerup', function () {
        if (!down) return;
        down = false;
        if (dragMoved) {
          reel.classList.remove('is-dragging');
          update();
          goTo(current);
          setTimeout(function () { dragMoved = false; }, 60);
        }
      });

      return { enter: function () { update(); } };
    }
  });

})();
