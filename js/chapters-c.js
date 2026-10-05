/* ==========================================================================
   chapters-c.js  -  the quiz, the secret message, the gift, the ending.
   ========================================================================== */
(function () {
  'use strict';
  var BS = window.BS;

  /* ======================================================================
     6) Quiz: "How well do you know us?"
     ====================================================================== */
  BS.defineChapter('quiz', {
    mood: 'dusk',
    available: function (d) { return d.quizQuestions.length > 0; },
    build: function (d, ctx) {
      ctx.title(BS.t('quizTitle'), BS.t('quizSub'));

      var qs = d.quizQuestions, total = qs.length;
      var letters = Array.from(BS.t('quizLetters'));
      var dots = BS.el('div', { class: 'quiz__dots', 'aria-hidden': 'true' }, qs.map(function () { return BS.el('i'); }));
      var stage = BS.el('div', { class: 'quiz__stage' });
      var quiz = BS.el('div', { class: 'quiz' }, [dots, stage]);
      ctx.inner.appendChild(quiz);

      var score = 0;

      function swap(view, scroll) {
        var old = stage.firstElementChild;
        function put() {
          stage.innerHTML = '';
          stage.appendChild(view);
          requestAnimationFrame(function () { view.classList.add('is-in'); });
          if (scroll) BS.scrollToEl(quiz, 'start');
        }
        if (old && !BS.reduced) { old.classList.add('is-out'); setTimeout(put, 300); } else put();
      }

      function questionView(i) {
        var q = qs[i], answered = false;
        var opts = [];
        var list = BS.el('ul', { class: 'q__opts' });
        var verdict = BS.el('p', { class: 'q__verdict', role: 'status' });
        var why = BS.el('p', { class: 'q__why', hidden: true });
        var isLast = i === total - 1;
        var nextBtn = BS.el('button', { class: 'btn btn--ghost q__next', type: 'button', text: isLast ? BS.t('quizFinish') : BS.t('quizNext') });
        var fb = BS.el('div', { class: 'q__fb', hidden: true }, [verdict, why, nextBtn]);

        q.options.forEach(function (label, k) {
          var mark = BS.el('span', { class: 'opt__mark', 'aria-hidden': 'true' });
          var b = BS.el('button', { class: 'opt', type: 'button' }, [
            BS.el('span', { class: 'opt__key', 'aria-hidden': 'true', text: letters[k] || '' }),
            BS.el('span', { class: 'opt__label', text: label }),
            mark
          ]);
          b._mark = mark;
          b.addEventListener('click', function () { choose(k); });
          opts.push(b);
          list.appendChild(BS.el('li', null, [b]));
        });

        function choose(k) {
          if (answered) return;
          answered = true;
          var ok = k === q.correct;
          if (ok) score++;
          opts.forEach(function (b, j) {
            b.setAttribute('aria-disabled', 'true');
            if (j === q.correct) { b.classList.add('is-correct'); b._mark.innerHTML = BS.icon('check'); }
            else if (j === k) { b.classList.add('is-wrong'); b._mark.innerHTML = BS.icon('cross'); }
            else b.classList.add('is-dim');
          });
          verdict.textContent = ok ? BS.t('quizRight') : BS.t('quizWrong');
          verdict.className = 'q__verdict ' + (ok ? 'is-right' : 'is-wrong');
          why.textContent = q.explanation;
          why.hidden = !q.explanation;
          fb.hidden = false;
          dots.children[i].className = ok ? 'is-right' : 'is-wrong';
          if (ok) BS.fx.pop(opts[k], 12); else BS.buzz(24);
          setTimeout(function () {
            fb.classList.add('is-in');
            nextBtn.focus({ preventScroll: true });
            var r = nextBtn.getBoundingClientRect();
            if (r.bottom > window.innerHeight - 20) window.scrollBy({ top: r.bottom - window.innerHeight + 90, behavior: BS.reduced ? 'auto' : 'smooth' });
          }, BS.reduced ? 0 : 60);
        }

        nextBtn.addEventListener('click', function () {
          if (isLast) swap(resultView(), true); else swap(questionView(i + 1), true);
        });

        return BS.el('div', { class: 'q' }, [
          BS.el('p', { class: 'q__count', text: BS.t('quizQ', { n: i + 1, total: total }) }),
          BS.el('h3', { class: 'q__text', text: q.question }),
          list, fb
        ]);
      }

      function resultView() {
        var pick = null;
        for (var r = 0; r < d.quizResults.length; r++) { if (score >= d.quizResults[r].minScore) { pick = d.quizResults[r]; break; } }
        var C = 2 * Math.PI * 54;
        var ring = BS.el('div', {
          class: 'score',
          html: '<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="score__bg" cx="60" cy="60" r="54"/><circle class="score__fg" cx="60" cy="60" r="54" stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + C.toFixed(2) + '"/></svg>'
        }, [BS.el('span', { class: 'score__num', text: BS.t('quizScore', { score: score, total: total }) })]);
        var again = BS.el('button', { class: 'link', type: 'button', text: BS.t('quizAgain') });
        var view = BS.el('div', { class: 'q q--result' }, [
          ring,
          BS.el('p', { class: 'q__count', text: BS.t('quizYouGot') }),
          pick && pick.title ? BS.el('h3', { class: 'q__rtitle', text: pick.title }) : null,
          pick && pick.message ? BS.el('p', { class: 'q__rmsg', text: pick.message }) : null,
          again
        ]);
        setTimeout(function () {
          var fg = ring.querySelector('.score__fg');
          if (fg) fg.style.strokeDashoffset = String(C * (1 - score / total));
        }, BS.reduced ? 0 : 500);
        setTimeout(function () {
          if (score === total) BS.fx.burst({ count: 60, kinds: ['heart', 'spark', 'dot'], speed: [180, 480], gravity: 420 });
          else if (score >= Math.ceil(total / 2)) BS.fx.pop(ring, 16);
        }, BS.reduced ? 0 : 900);
        again.addEventListener('click', function () {
          score = 0;
          Array.prototype.forEach.call(dots.children, function (dot) { dot.className = ''; });
          swap(questionView(0), true);
        });
        ctx.showNext();
        return view;
      }

      return {
        enter: function () { stage.appendChild(questionView(0)); var v = stage.firstElementChild; requestAnimationFrame(function () { v.classList.add('is-in'); }); }
      };
    }
  });

  /* ======================================================================
     7) The secret: a lock, a password, then the words
     ====================================================================== */
  function normPw(s) {
    return String(s == null ? '' : s)
      .normalize('NFKC').toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[\u0660-\u0669]/g, function (c) { return String(c.charCodeAt(0) - 0x0660); })
      .replace(/[\u06F0-\u06F9]/g, function (c) { return String(c.charCodeAt(0) - 0x06F0); })
      .replace(/[\u0623\u0625\u0622]/g, '\u0627')
      .replace(/\u0649/g, '\u064A')
      .replace(/[\s\-_.\/\\,\u060C:;'"]+/g, '');
  }

  var LOCK_SVG =
    '<svg class="vault__svg" viewBox="0 0 120 140" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<linearGradient id="vg-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E7CC"/><stop offset="1" stop-color="#E7A0B2"/></linearGradient>' +
    '<linearGradient id="vg-arc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E3C6"/><stop offset="1" stop-color="#D9A0B0"/></linearGradient>' +
    '</defs>' +
    '<g class="vault__shackle"><path d="M38 68V46a22 22 0 0 1 44 0v22" fill="none" stroke="url(#vg-arc)" stroke-width="9" stroke-linecap="round"/></g>' +
    '<rect x="20" y="64" width="80" height="62" rx="15" fill="url(#vg-body)"/>' +
    '<rect x="20" y="64" width="80" height="62" rx="15" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1"/>' +
    '<circle cx="60" cy="90" r="8.5" fill="#3A2452"/>' +
    '<path d="M56.6 94h6.8l-1.7 16h-3.4z" fill="#3A2452"/>' +
    '</svg>';

  BS.defineChapter('secret', {
    mood: 'vault',
    available: function (d) { return !!d.secretMessage; },
    build: function (d, ctx) {
      var hasPw = !!d.password;
      var head = ctx.title(BS.t('secretTitle'), hasPw ? BS.t('secretSub') : '');
      var subLine = head.querySelector('.chapter__sub');

      // --- the message (hidden until unlocked)
      var msgBody = BS.el('div', { class: 'secret__body' });
      var chunks = BS.buildText(msgBody, d.secretMessage);
      var paper = BS.el('article', { class: 'secret__paper', hidden: true, tabindex: '-1' }, [
        BS.el('p', { class: 'secret__badge', html: BS.icon('sparkle') + '<span>' + BS.esc(BS.t('secretOpen')) + '</span>' }),
        msgBody
      ]);

      // --- the lock + form
      var input = BS.el('input', {
        class: 'pw__input', id: 'secret-pw', type: 'password', name: 'secret-word', placeholder: BS.t('secretPlaceholder'),
        autocomplete: 'off', autocapitalize: 'none', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'go', 'aria-describedby': 'secret-err'
      });
      var eye = BS.el('button', { class: 'pw__eye', type: 'button', 'aria-label': BS.t('secretShow'), html: BS.icon('eye') });
      var field = BS.el('div', { class: 'pw__field' }, [
        BS.el('label', { class: 'sr-only', for: 'secret-pw', text: BS.t('secretPlaceholder') }),
        input, eye
      ]);
      var go = BS.el('button', { class: 'btn btn--primary pw__go', type: 'submit', text: BS.t('secretUnlock') });
      var err = BS.el('p', { class: 'pw__err', id: 'secret-err', role: 'alert' });
      var hintBtn = d.passwordHint ? BS.el('button', { class: 'link', type: 'button', text: BS.t('secretHintBtn') }) : null;
      var skipBtn = BS.el('button', { class: 'link', type: 'button', text: BS.t('secretSkip') });
      var hintText = d.passwordHint ? BS.el('p', { class: 'pw__hint', hidden: true, text: BS.fmt(d.passwordHint) }) : null;
      var form = BS.el('form', { class: 'pw', novalidate: 'novalidate', autocomplete: 'off' }, [
        field, go, err,
        BS.el('div', { class: 'pw__more' }, [hintBtn, skipBtn]),
        hintText
      ]);
      var lock = BS.el('div', { class: 'secret__lock' }, [BS.el('div', { class: 'vault', html: LOCK_SVG }), form]);

      var stage = BS.el('div', { class: 'secret__stage' }, [hasPw ? lock : null, paper]);
      var wrap = BS.el('div', { class: 'secret' }, [stage]);
      ctx.inner.appendChild(wrap);

      var unlocked = false;

      function reveal() {
        paper.hidden = false;
        var grow = BS.grower(paper);
        grow.init(paper.querySelector('.secret__badge'));
        wrap.classList.add('is-open');
        setTimeout(function () { lock.hidden = true; }, BS.reduced ? 0 : 1000);
        BS.sleep(800).then(function () {
          paper.focus({ preventScroll: true });
          BS.scrollToEl(paper, 'start');
          var p = BS.playText(chunks, { onChunk: function (c) { grow.to(c); BS.follow(c); } });
          paper.addEventListener('click', function () { p.skip(); });
          return p.done;
        }).then(function () { grow.finish(); return BS.sleep(600); }).then(function () { ctx.showNext(); });
      }

      function unlock() {
        if (unlocked) return;
        unlocked = true;
        input.blur();
        wrap.classList.add('is-unlocking');
        if (subLine) { subLine.classList.add('is-gone'); setTimeout(function () { subLine.hidden = true; }, BS.reduced ? 0 : 900); }
        BS.buzz([20, 40, 30]);
        var v = wrap.querySelector('.vault');
        setTimeout(function () { BS.fx.pop(v, 26); }, BS.reduced ? 0 : 380);
        BS.sleep(1300).then(reveal);
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (unlocked) return;
        if (normPw(input.value) === normPw(d.password) && normPw(input.value) !== '') {
          err.textContent = '';
          unlock();
        } else {
          err.textContent = BS.t('secretWrong');
          wrap.classList.remove('is-wrong');
          void wrap.offsetWidth;
          wrap.classList.add('is-wrong');
          BS.buzz(60);
          input.select();
        }
      });
      input.addEventListener('input', function () { err.textContent = ''; });

      eye.addEventListener('click', function () {
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        eye.innerHTML = BS.icon(show ? 'eyeoff' : 'eye');
        eye.setAttribute('aria-label', show ? BS.t('secretHide') : BS.t('secretShow'));
        input.focus({ preventScroll: true });
      });
      if (hintBtn) hintBtn.addEventListener('click', function () { hintText.hidden = !hintText.hidden; });
      skipBtn.addEventListener('click', function () {
        ctx.showNext();
        setTimeout(function () { if (ctx.nextWrap) BS.scrollToEl(ctx.nextWrap, 'center'); }, 200);
      });

      return {
        enter: function () {
          if (!hasPw) { unlocked = true; reveal(); }
        }
      };
    }
  });

  /* ======================================================================
     8) The gift box
     ====================================================================== */
  var GIFT_SVG =
    '<svg class="gift__svg" viewBox="0 0 220 250" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDA9BB"/><stop offset="1" stop-color="#B96B87"/></linearGradient>' +
    '<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5C3CF"/><stop offset="1" stop-color="#DA8FA6"/></linearGradient>' +
    '<linearGradient id="gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F0D3A8"/><stop offset=".5" stop-color="#FCEFD8"/><stop offset="1" stop-color="#E7C592"/></linearGradient>' +
    '</defs>' +
    '<ellipse class="gift__shadow" cx="110" cy="232" rx="78" ry="9" fill="rgba(6,2,12,.45)"/>' +
    '<g class="gift__base">' +
    '<rect x="34" y="112" width="152" height="114" rx="10" fill="url(#gb)"/>' +
    '<rect x="98" y="112" width="24" height="114" fill="url(#gr)"/>' +
    '<rect x="34" y="112" width="152" height="10" fill="rgba(0,0,0,.14)"/>' +
    '</g>' +
    '<g class="gift__lid">' +
    '<rect x="24" y="84" width="172" height="36" rx="10" fill="url(#gl)"/>' +
    '<rect x="98" y="84" width="24" height="36" fill="url(#gr)"/>' +
    '<path d="M110 84C90 50 54 46 60 70c4 15 34 14 50 14z" fill="url(#gr)"/>' +
    '<path d="M110 84C130 50 166 46 160 70c-4 15-34 14-50 14z" fill="url(#gr)"/>' +
    '<path d="M110 84C98 66 78 62 72 72" fill="none" stroke="rgba(150,100,60,.35)" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M110 84C122 66 142 62 148 72" fill="none" stroke="rgba(150,100,60,.35)" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="110" cy="82" r="10" fill="#E6C48E"/>' +
    '</g></svg>';

  BS.defineChapter('gift', {
    mood: 'champagne',
    available: function (d) { return !!(d.finalThanks || d.finalMessage); },
    build: function (d, ctx) {
      var head = ctx.title(BS.t('giftTitle'));

      var rays = BS.el('div', { class: 'gift__rays', 'aria-hidden': 'true' });
      var box = BS.el('button', { class: 'gift__box', type: 'button', 'aria-label': BS.t('giftAria'), html: GIFT_SVG });
      var hint = BS.el('p', { class: 'gift__hint', text: BS.t('giftHint') });
      var stage = BS.el('div', { class: 'gift__stage' }, [rays, box]);

      var msg = BS.el('div', { class: 'gift__msg' });
      var chunks = [];
      if (d.finalThanks) {
        var th = BS.el('p', { class: 'gift__thanks' });
        var thc = BS.el('span', { class: 'ck', text: BS.fmt(d.finalThanks), 'data-end': 'p' });
        th.appendChild(thc);
        chunks.push(thc);
        msg.appendChild(th);
      }
      chunks = chunks.concat(BS.buildText(msg, d.finalMessage));

      var heading = BS.el('h2', { class: 'gift__heading', tabindex: '-1' }, [
        BS.el('span', { text: BS.t('giftHeading') }),
        BS.el('span', { class: 'gift__heart', html: BS.icon('heartfill') })
      ]);
      var final = BS.el('div', { class: 'gift__final', hidden: true }, [heading, msg]);
      var wrap = BS.el('div', { class: 'gift' }, [stage, hint, final]);
      ctx.inner.appendChild(wrap);

      var opened = false;
      box.addEventListener('click', function () {
        if (opened) return;
        opened = true;
        BS.buzz([30, 30, 60]);
        hint.classList.add('is-gone');
        wrap.classList.add('is-shaking');

        BS.sleep(1000).then(function () {
          wrap.classList.remove('is-shaking');
          wrap.classList.add('is-open');
          BS.fx.burst({ count: 90, kinds: ['heart', 'spark', 'conf', 'dot'], speed: [260, 720], gravity: 620, life: [1.8, 3.2], size: [5, 11] });
          setTimeout(function () { BS.fx.burst({ count: 40, kinds: ['heart', 'spark'], speed: [140, 420], gravity: 300 }); }, BS.reduced ? 0 : 500);
          return BS.sleep(1700);
        }).then(function () {
          wrap.classList.add('is-fading');
          head.classList.add('is-gone');
          return BS.sleep(750);
        }).then(function () {
          wrap.classList.add('is-revealed');
          head.hidden = true;
          final.hidden = false;
          BS.scrollToEl(ctx.section, 'start');
          return BS.sleep(1000);
        }).then(function () {
          heading.classList.add('is-in');
          heading.focus({ preventScroll: true });
          return BS.sleep(1200);
        }).then(function () {
          var p = BS.playText(chunks, { onChunk: BS.follow, perChar: 24 });
          final.addEventListener('click', function () { p.skip(); });
          return p.done;
        }).then(function () { return BS.sleep(800); }).then(function () { ctx.showNext(); });
      });

      return { enter: function () {} };
    }
  });

  /* ======================================================================
     9) The end
     ====================================================================== */
  BS.defineChapter('finale', {
    mood: 'champagne',
    last: true,
    available: function () { return true; },
    build: function (d, ctx) {
      var line = BS.el('p', { class: 'finale__line' });
      BS.t('finaleLine').split(/\s+/).filter(Boolean).forEach(function (w, i, all) {
        line.appendChild(BS.el('span', { class: 'fw', style: '--i:' + i, text: w }));
        if (i < all.length - 1) line.appendChild(document.createTextNode(' '));
      });
      var nameLine = BS.el('p', { class: 'finale__name' }, [
        BS.el('span', { text: d.recipientName }),
        BS.el('span', { class: 'finale__heart', html: BS.icon('heartfill') })
      ]);
      var made = BS.el('p', { class: 'finale__made', text: BS.t('finaleMade') });
      var replay = BS.el('button', { class: 'link finale__replay', type: 'button', html: BS.icon('replay') + '<span>' + BS.esc(BS.t('finaleReplay')) + '</span>' });
      replay.addEventListener('click', function () {
        document.body.classList.add('is-leaving');
        setTimeout(function () { window.scrollTo(0, 0); location.reload(); }, BS.reduced ? 0 : 700);
      });
      ctx.inner.appendChild(line);
      ctx.inner.appendChild(nameLine);
      ctx.inner.appendChild(made);
      ctx.inner.appendChild(replay);

      return {
        enter: function () {
          ctx.section.classList.add('is-playing');
          BS.fx.setAmbientMode('stars');
        }
      };
    }
  });

})();
