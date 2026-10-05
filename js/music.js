/* ==========================================================================
   music.js  -  one song, one small player that follows you through the story.
   Browsers only allow sound after a tap, so start() is called from the
   "Open Your Surprise" button. If it's ever blocked, the pill says
   "Tap to play music".
   ========================================================================== */
(function () {
  'use strict';
  var BS = window.BS;
  var M = (BS.music = {});

  var audio = null, root = null, ui = {};
  var state = 'off';               // off | ready | playing | paused | blocked
  var targetVol = 0.8, canSetVol = true, fadeTimer = null, dragging = false, shown = false;
  var CIRC = 2 * Math.PI * 19;

  function fmtTime(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function setState(next) {
    state = next;
    if (!root) return;
    root.setAttribute('data-state', next);
    var playing = next === 'playing';
    ui.icon.innerHTML = BS.icon(playing ? 'pause' : 'play');
    ui.toggle.setAttribute('aria-label', playing ? BS.t('musicPause') : BS.t('musicPlay'));
    ui.title.textContent = next === 'blocked' ? BS.t('musicTap') : ui.songTitle;
    root.classList.toggle('is-off', next === 'off' || !shown);
  }

  function fadeTo(v, ms) {
    clearInterval(fadeTimer);
    if (!canSetVol) return;
    var from = audio.volume, steps = Math.max(1, Math.round(ms / 60)), i = 0;
    fadeTimer = setInterval(function () {
      i++;
      audio.volume = BS.clamp(from + (v - from) * (i / steps), 0, 1);
      if (i >= steps) clearInterval(fadeTimer);
    }, 60);
  }

  function updateProgress() {
    if (!audio) return;
    var dur = audio.duration, cur = audio.currentTime;
    var p = isFinite(dur) && dur > 0 ? cur / dur : 0;
    ui.ring.style.strokeDashoffset = String(CIRC * (1 - p));
    ui.cur.textContent = fmtTime(cur);
    ui.dur.textContent = fmtTime(dur);
    if (!dragging) ui.seek.value = String(Math.round(p * 1000));
    ui.seek.style.setProperty('--fill', (p * 100).toFixed(1) + '%');
  }

  function updateVolIcon() {
    ui.volIcon.innerHTML = BS.icon(audio.volume === 0 || audio.muted ? 'mute' : 'volume');
  }

  function togglePanel(open) {
    var isOpen = open != null ? open : ui.panel.hidden;
    ui.panel.hidden = !isOpen;
    ui.meta.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    root.classList.toggle('is-open', isOpen);
  }

  M.init = function (d, mount) {
    if (!d.musicFile) return;

    audio = new Audio();
    audio.preload = 'metadata';
    audio.loop = true;
    audio.src = d.musicFile;

    // iOS ignores volume changes: detect it and hide the slider there
    try { audio.volume = 0.5; canSetVol = Math.abs(audio.volume - 0.5) < 0.01; audio.volume = 1; } catch (e) { canSetVol = false; }

    ui.songTitle = d.musicTitle || d.musicArtist || '';
    var ring = '<svg class="player__ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="player__ring-bg" cx="22" cy="22" r="19"/><circle class="player__ring-fg" cx="22" cy="22" r="19" stroke-dasharray="' + CIRC.toFixed(2) + '" stroke-dashoffset="' + CIRC.toFixed(2) + '"/></svg>';

    ui.icon = BS.el('span', { class: 'player__icon', html: BS.icon('play') });
    ui.toggle = BS.el('button', { class: 'player__toggle', type: 'button', 'aria-label': BS.t('musicPlay') }, [
      BS.el('span', { html: ring }), ui.icon
    ]);
    ui.ring = ui.toggle.querySelector('.player__ring-fg');
    ui.title = BS.el('span', { class: 'player__title', text: ui.songTitle });
    ui.meta = BS.el('button', { class: 'player__meta', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'player-panel', 'aria-label': BS.t('musicMore') }, [
      BS.el('span', { class: 'eq', 'aria-hidden': 'true' }, [BS.el('i'), BS.el('i'), BS.el('i')]),
      ui.title
    ]);

    ui.cur = BS.el('span', { class: 'player__time', text: '0:00' });
    ui.dur = BS.el('span', { class: 'player__time', text: '0:00' });
    ui.seek = BS.el('input', { class: 'range player__seek', type: 'range', min: '0', max: '1000', value: '0', 'aria-label': BS.t('musicSeek') });
    ui.vol = BS.el('input', { class: 'range player__vol', type: 'range', min: '0', max: '100', value: String(Math.round(targetVol * 100)), 'aria-label': BS.t('musicVolume') });
    ui.vol.style.setProperty('--fill', Math.round(targetVol * 100) + '%');
    ui.volIcon = BS.el('span', { class: 'player__vol-ic', html: BS.icon('volume') });

    var rowVol = BS.el('div', { class: 'player__row player__row--vol' }, [ui.volIcon, ui.vol]);
    if (!canSetVol) rowVol.hidden = true;

    ui.panel = BS.el('div', { class: 'player__panel', id: 'player-panel', hidden: true }, [
      BS.el('p', { class: 'player__now', text: BS.t('musicNow') }),
      BS.el('p', { class: 'player__song', text: d.musicTitle || '' }),
      d.musicArtist ? BS.el('p', { class: 'player__artist', text: d.musicArtist }) : null,
      BS.el('div', { class: 'player__row' }, [ui.cur, ui.seek, ui.dur]),
      rowVol
    ]);

    root = BS.el('div', { class: 'player is-off', 'data-state': 'off' }, [
      BS.el('div', { class: 'player__bar' }, [ui.toggle, ui.meta]),
      ui.panel
    ]);
    mount.appendChild(root);

    /* events */
    ui.toggle.addEventListener('click', function () { M.toggle(); });
    ui.meta.addEventListener('click', function () {
      if (state === 'blocked') { M.toggle(); return; }
      togglePanel();
    });
    document.addEventListener('click', function (e) {
      if (!ui.panel.hidden && !root.contains(e.target)) togglePanel(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !ui.panel.hidden) togglePanel(false);
    });

    ui.seek.addEventListener('pointerdown', function () { dragging = true; });
    ui.seek.addEventListener('input', function () {
      dragging = true;
      var dur = audio.duration;
      if (isFinite(dur) && dur > 0) audio.currentTime = (ui.seek.value / 1000) * dur;
      ui.seek.style.setProperty('--fill', (ui.seek.value / 10) + '%');
    });
    ui.seek.addEventListener('change', function () { dragging = false; });
    window.addEventListener('pointerup', function () { dragging = false; });

    ui.vol.addEventListener('input', function () {
      var v = ui.vol.value / 100;
      targetVol = v;
      clearInterval(fadeTimer);
      audio.volume = v;
      ui.vol.style.setProperty('--fill', ui.vol.value + '%');
      updateVolIcon();
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('durationchange', updateProgress);
    audio.addEventListener('play', function () { setState('playing'); });
    audio.addEventListener('pause', function () { if (state !== 'blocked' && state !== 'off') setState('paused'); });
    audio.addEventListener('error', function () { setState('off'); });

    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: d.musicTitle || '', artist: d.musicArtist || '' });
        navigator.mediaSession.setActionHandler('play', function () { M.play(); });
        navigator.mediaSession.setActionHandler('pause', function () { M.pause(); });
      } catch (e) { /* not supported */ }
    }

    setState('ready');
    root.classList.add('is-off');
  };

  // Start warming the file up in the background (so the tap feels instant)
  M.warm = function () {
    if (!audio) return;
    try { audio.preload = 'auto'; audio.load(); } catch (e) { /* ignore */ }
  };

  M.play = function () {
    if (!audio || state === 'off') return Promise.resolve(false);
    if (canSetVol && audio.paused && !started()) audio.volume = 0;
    var p;
    try { p = audio.play(); } catch (e) { p = Promise.reject(e); }
    return Promise.resolve(p).then(function () {
      markStarted();
      setState('playing');
      fadeTo(targetVol, 2600);
      updateVolIcon();
      return true;
    }).catch(function () {
      if (audio.error) { setState('off'); return false; }
      setState('blocked');
      return false;
    });
  };

  var _started = false;
  function started() { return _started; }
  function markStarted() { _started = true; }

  M.pause = function () { if (audio && !audio.paused) audio.pause(); };

  M.toggle = function () {
    if (!audio || state === 'off') return;
    if (state === 'playing') M.pause(); else M.play();
  };

  // Called by the "Open Your Surprise" tap
  M.start = function () {
    if (!audio || state === 'off') return Promise.resolve(false);
    shown = true;
    root.classList.remove('is-off');
    return M.play().then(function (ok) {
      root.classList.toggle('is-off', state === 'off');
      return ok;
    });
  };

  M.hasMusic = function () { return !!audio && state !== 'off'; };
})();
