/* ==========================================================================
   countdown.js  -  works out WHEN the birthday starts (in the birthday
   person's own time zone) and shows the countdown until then.
   ========================================================================== */
(function () {
  'use strict';
  var BS = window.BS;

  /* ------------------------------------------------------------------
     Time zones without any library
     ------------------------------------------------------------------ */
  function tzOffsetMs(utcMs, tz) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    var parts = {};
    dtf.formatToParts(new Date(utcMs)).forEach(function (p) { parts[p.type] = p.value; });
    var asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, (+parts.hour) % 24, +parts.minute, +parts.second);
    return asUTC - Math.floor(utcMs / 1000) * 1000;
  }

  function wallToUTC(y, mo, d, h, mi, s, tz) {
    var guess = Date.UTC(y, mo - 1, d, h, mi, s);
    var off = tzOffsetMs(guess, tz);
    var t = guess - off;
    var off2 = tzOffsetMs(t, tz);
    if (off2 !== off) t = guess - off2;
    return t;
  }

  // Returns the birthday moment as a UTC timestamp, or NaN if we can't read it
  BS.birthdayMoment = function (d) {
    var s = d.birthdayDate;
    if (!s) return NaN;
    if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(s) && /T/.test(s)) return Date.parse(s);
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(s);
    if (!m) { var t = Date.parse(s); return isNaN(t) ? NaN : t; }
    var y = +m[1], mo = +m[2], da = +m[3], h = +(m[4] || 0), mi = +(m[5] || 0), se = +(m[6] || 0);
    if (d.timezone) {
      try { return wallToUTC(y, mo, da, h, mi, se, d.timezone); } catch (e) { /* bad time zone name: use device time */ }
    }
    return new Date(y, mo - 1, da, h, mi, se).getTime();
  };

  /* ------------------------------------------------------------------
     The countdown screen
     ------------------------------------------------------------------ */
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  // Builds the screen. Returns { node, ready: Promise } - `ready` resolves when
  // the time has come AND the person has tapped "Begin".
  BS.buildCountdown = function (target, tz) {
    var cells = {};
    function cell(key, label) {
      var num = BS.el('span', { class: 'cd__num', text: '00' });
      cells[key] = num;
      return BS.el('div', { class: 'cd__cell' }, [num, BS.el('span', { class: 'cd__lbl', text: label })]);
    }

    var title = BS.el('h1', { class: 'cd__title', text: BS.t('cdTitle') });
    var grid = BS.el('div', { class: 'cd__grid', role: 'timer', 'aria-label': BS.t('cdLabel') }, [
      cell('d', BS.t('cdDays')), cell('h', BS.t('cdHours')), cell('m', BS.t('cdMinutes')), cell('s', BS.t('cdSeconds'))
    ]);
    var date = BS.el('p', { class: 'cd__date', text: BS.t('cdUnlocks', { date: BS.fmtDate(target, tz) }) });
    var wait = BS.el('div', { class: 'cd__wait' }, [title, grid, date]);

    var node = BS.el('section', { class: 'screen screen--countdown', 'aria-label': BS.t('cdTitle') }, [wait]);

    var timer = null, resolveReady;
    var ready = new Promise(function (r) { resolveReady = r; });

    function render() {
      var diff = Math.max(0, target - Date.now());
      if (diff <= 0) { celebrate(); return; }
      var s = Math.floor(diff / 1000);
      cells.d.textContent = pad(Math.floor(s / 86400));
      cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
      cells.m.textContent = pad(Math.floor((s % 3600) / 60));
      cells.s.textContent = pad(s % 60);
    }

    function celebrate() {
      clearInterval(timer);
      wait.classList.add('is-gone');
      var btn = BS.el('button', { class: 'btn btn--primary', type: 'button', text: BS.t('cdBegin') });
      var now = BS.el('div', { class: 'cd__now' }, [
        BS.el('h1', { class: 'cd__nowtitle', text: BS.t('cdItsYourDay') }),
        btn
      ]);
      setTimeout(function () {
        node.appendChild(now);
        requestAnimationFrame(function () { now.classList.add('is-in'); });
        if (BS.fx && BS.fx.burst) BS.fx.burst({ count: 46, kinds: ['heart', 'spark', 'dot'], speed: [160, 460], gravity: 420 });
        btn.focus({ preventScroll: true });
      }, BS.reduced ? 0 : 500);
      btn.addEventListener('click', function () { resolveReady(); });
    }

    render();
    timer = setInterval(render, 1000);
    return { node: node, ready: ready, stop: function () { clearInterval(timer); } };
  };
})();
