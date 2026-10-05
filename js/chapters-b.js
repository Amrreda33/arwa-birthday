/* ==========================================================================
   chapters-b.js  -  "Our story" (scroll timeline) and "Things I love"
   (cards you turn over one by one).
   ========================================================================== */
(function () {
  'use strict';
  var BS = window.BS;

  /* ======================================================================
     4) Our story: a thread of light that fills as you scroll
     ====================================================================== */
  BS.defineChapter('story', {
    mood: 'dusk',
    available: function (d) { return d.timeline.length > 0; },
    build: function (d, ctx) {
      ctx.title(BS.t('storyTitle'), BS.t('storySub'));

      var fill = BS.el('span', { class: 'tl__fill' });
      var line = BS.el('span', { class: 'tl__line', 'aria-hidden': 'true' }, [fill]);
      var list = BS.el('ol', { class: 'tl' }, [line]);
      var last = d.timeline.length - 1;

      var items = d.timeline.map(function (t, i) {
        var node = BS.el('span', { class: 'tl__node', 'aria-hidden': 'true', html: i === last ? BS.icon('heartfill') : '' });
        var card = BS.el('div', { class: 'tl__card' });
        if (t.image) {
          card.appendChild(BS.el('div', { class: 'tl__media' }, [
            BS.photo({ src: t.image, alt: t.title || t.description || '', index: i + 2, minAr: 0.7, maxAr: 1.8 })
          ]));
        }
        if (t.date) card.appendChild(BS.el('p', { class: 'tl__date', text: t.date }));
        if (t.title) card.appendChild(BS.el('h3', { class: 'tl__title', text: t.title }));
        if (t.description) card.appendChild(BS.el('p', { class: 'tl__text', text: t.description }));
        var li = BS.el('li', { class: 'tl__item', 'data-side': i % 2 === 0 ? 'a' : 'b' }, [node, card]);
        list.appendChild(li);
        BS.observe(li, function () {
          li.classList.add('is-in');
          // reaching the last moment of the story unlocks the way forward
          if (i === last) setTimeout(function () { ctx.showNext(); }, BS.reduced ? 0 : 1800);
        }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
        return { li: li, node: node };
      });

      ctx.inner.classList.add('is-timeline');
      ctx.inner.appendChild(list);

      var ticking = false;
      function update() {
        ticking = false;
        var h = list.offsetHeight;
        if (!h) return;
        var r = list.getBoundingClientRect();
        var mid = window.innerHeight * 0.55;
        list.style.setProperty('--p', BS.clamp((mid - r.top) / h, 0, 1).toFixed(4));
        items.forEach(function (it) {
          var nr = it.node.getBoundingClientRect();
          it.li.classList.toggle('is-lit', nr.top + nr.height / 2 < mid);
        });
      }
      function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', BS.debounce(update, 150));

      return { enter: function () { update(); } };
    }
  });

  /* ======================================================================
     5) Things I love about you: a dealt hand of cards
     ====================================================================== */
  BS.defineChapter('loves', {
    mood: 'rose',
    autoNext: 1600,
    available: function (d) { return d.thingsILove.length > 0; },
    build: function (d, ctx) {
      var total = d.thingsILove.length;
      ctx.title(BS.t('lovesTitle', { count: total }), BS.t('lovesSub'));

      var deck = BS.el('ul', { class: 'deck' });
      var progress = BS.el('p', { class: 'loves__progress', role: 'status' });
      var done = BS.el('p', { class: 'loves__done', text: BS.t('lovesDone') });
      var rnd = BS.rng(5);
      var seen = 0;
      var textEls = [];

      function updateProgress() {
        progress.textContent = BS.t('lovesProgress', { done: seen, total: total });
        progress.style.setProperty('--w', (seen / total * 100).toFixed(1) + '%');
      }

      d.thingsILove.forEach(function (t, i) {
        var tilt = ((rnd() - 0.5) * 3).toFixed(2);
        var front = BS.el('span', { class: 'card__face card__face--front' }, [
          BS.el('span', { class: 'card__orn', html: BS.icon('sparkle') }),
          BS.el('span', { class: 'card__title', text: t.title }),
          BS.el('span', { class: 'card__foot', html: BS.icon('heartfill') })
        ]);
        var inner = BS.el('span', { class: 'card__textin', text: t.text || t.title });
        var textEl = BS.el('span', { class: 'card__text' }, [inner]);
        textEls.push(textEl);
        var back = BS.el('span', { class: 'card__face card__face--back' }, [
          textEl,
          BS.el('span', { class: 'card__foot', html: BS.icon('heartfill') })
        ]);
        var btn = BS.el('button', {
          class: 'card', type: 'button', 'aria-pressed': 'false',
          'aria-label': BS.t('lovesCard', { n: i + 1, title: t.title })
        }, [BS.el('span', { class: 'card__inner' }, [front, back])]);
        var li = BS.el('li', { class: 'deck__item', style: '--tilt:' + tilt + 'deg;--i:' + i }, [btn]);

        var counted = false;
        btn.addEventListener('click', function () {
          var flipped = btn.classList.toggle('is-flipped');
          btn.setAttribute('aria-pressed', flipped ? 'true' : 'false');
          btn.setAttribute('aria-label', flipped ? (t.title + ': ' + (t.text || '')) : BS.t('lovesCard', { n: i + 1, title: t.title }));
          BS.buzz(10);
          if (flipped && !counted) {
            counted = true;
            seen++;
            updateProgress();
            setTimeout(function () { BS.fx.pop(btn, 12); }, BS.reduced ? 0 : 380);
            if (seen === total) {
              done.classList.add('is-in');
              if (ctx.nextBtn) ctx.nextBtn.classList.remove('btn--ghost');
              setTimeout(function () { BS.fx.burst({ count: 44, kinds: ['heart', 'spark', 'dot'], speed: [160, 420], gravity: 380 }); }, 450);
              ctx.showNext();
            }
          }
        });
        deck.appendChild(li);
      });

      updateProgress();
      ctx.inner.classList.add('is-deck');
      ctx.inner.appendChild(deck);
      ctx.inner.appendChild(BS.el('div', { class: 'loves__foot' }, [progress, done]));
      if (ctx.nextBtn) ctx.nextBtn.classList.add('btn--ghost');

      // make every card's message fit nicely
      function fitAll() {
        textEls.forEach(function (te) {
          var inn = te.firstChild;
          te.style.fontSize = '';
          var size = parseFloat(getComputedStyle(te).fontSize) || 20;
          var guard = 40;
          while (guard-- > 0 && size > 12 && inn.offsetHeight > te.clientHeight + 1) {
            size -= 1;
            te.style.fontSize = size + 'px';
          }
        });
      }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
      window.addEventListener('resize', BS.debounce(fitAll, 200));

      return {
        enter: function () {
          fitAll();
          deck.classList.add('is-dealt');
        }
      };
    }
  });

})();
