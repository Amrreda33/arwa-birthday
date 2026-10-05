/* ==========================================================================
   fx.js  -  two small canvas effects
     1) ambient: very quiet floating dust (or twinkling stars at the end)
     2) burst:   hearts / sparkles / confetti for the celebration moments
   ========================================================================== */
(function () {
  'use strict';
  var BS = window.BS;
  var fx = (BS.fx = {});

  var COLORS = ['#F2DFC0', '#E9A3B4', '#F4A67A', '#FFF6E6'];
  var TAU = Math.PI * 2;

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function between(a, b) { return a + Math.random() * (b - a); }

  function sizeCanvas(canvas, ctx, maxDpr) {
    var dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    var w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h };
  }

  function heartPath(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.9);
    ctx.bezierCurveTo(-s * 1.6, -s * 0.1, -s * 0.9, -s * 1.1, 0, -s * 0.35);
    ctx.bezierCurveTo(s * 0.9, -s * 1.1, s * 1.6, -s * 0.1, 0, s * 0.9);
    ctx.closePath();
  }

  function sparkPath(ctx, s) {
    var k = s * 0.14;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(k, -k, s, 0);
    ctx.quadraticCurveTo(k, k, 0, s);
    ctx.quadraticCurveTo(-k, k, -s, 0);
    ctx.quadraticCurveTo(-k, -k, 0, -s);
    ctx.closePath();
  }

  /* ================================================================
     1) Ambient layer
     ================================================================ */
  var A = { c: null, ctx: null, w: 0, h: 0, p: [], mode: 'dust', raf: 0, last: 0, on: false };

  function seedAmbient() {
    var area = A.w * A.h;
    var n = Math.round(BS.clamp(area / (A.mode === 'stars' ? 9000 : 15000), 26, A.mode === 'stars' ? 120 : 64));
    A.p = [];
    for (var i = 0; i < n; i++) {
      A.p.push({
        x: Math.random() * A.w,
        y: Math.random() * A.h,
        r: A.mode === 'stars' ? between(0.5, 1.5) : between(0.6, 1.9),
        vy: A.mode === 'stars' ? 0 : -between(3, 12),
        sway: between(4, 16),
        ph: Math.random() * TAU,
        tw: between(0.5, 1.6),
        a: A.mode === 'stars' ? between(0.35, 0.95) : between(0.18, 0.55),
        c: pick(COLORS),
        big: Math.random() < 0.08
      });
    }
  }

  function drawAmbient(dt, t) {
    var ctx = A.ctx;
    ctx.clearRect(0, 0, A.w, A.h);
    for (var i = 0; i < A.p.length; i++) {
      var p = A.p[i];
      p.y += p.vy * dt;
      if (p.y < -10) { p.y = A.h + 10; p.x = Math.random() * A.w; }
      var x = p.x + Math.sin(t * 0.35 + p.ph) * p.sway;
      var a = p.a * (0.55 + 0.45 * Math.sin(t * p.tw + p.ph));
      ctx.fillStyle = p.c;
      if (A.mode === 'stars' && p.big) {
        ctx.save();
        ctx.translate(x, p.y);
        ctx.globalAlpha = a;
        sparkPath(ctx, p.r * 4.2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.globalAlpha = a * 0.16;
        ctx.beginPath(); ctx.arc(x, p.y, p.r * 3.4, 0, TAU); ctx.fill();
        ctx.globalAlpha = a;
        ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function tickAmbient(ts) {
    if (!A.on) return;
    A.raf = requestAnimationFrame(tickAmbient);
    var dt = Math.min(0.05, (ts - A.last) / 1000 || 0.016);
    A.last = ts;
    drawAmbient(dt, ts / 1000);
  }

  function startAmbient() {
    if (A.on || BS.reduced) { if (BS.reduced) drawAmbient(0, 0); return; }
    A.on = true;
    A.last = performance.now();
    A.raf = requestAnimationFrame(tickAmbient);
  }

  function stopAmbient() { A.on = false; cancelAnimationFrame(A.raf); }

  fx.initAmbient = function (canvas) {
    A.c = canvas;
    A.ctx = canvas.getContext('2d');
    var s = sizeCanvas(canvas, A.ctx, 1.75);
    A.w = s.w; A.h = s.h;
    seedAmbient();
    startAmbient();
    window.addEventListener('resize', BS.debounce(function () {
      var s2 = sizeCanvas(A.c, A.ctx, 1.75);
      A.w = s2.w; A.h = s2.h;
      seedAmbient();
      if (BS.reduced) drawAmbient(0, 0);
    }, 200));
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAmbient(); else startAmbient();
    });
  };

  fx.setAmbientMode = function (mode) {
    if (A.mode === mode || !A.c) return;
    A.mode = mode;
    seedAmbient();
    if (BS.reduced) drawAmbient(0, 0);
  };

  /* ================================================================
     2) Celebration bursts
     ================================================================ */
  var B = { c: null, ctx: null, w: 0, h: 0, p: [], raf: 0, last: 0, on: false };

  fx.initBurst = function (canvas) {
    B.c = canvas;
    B.ctx = canvas.getContext('2d');
    var s = sizeCanvas(canvas, B.ctx, 2);
    B.w = s.w; B.h = s.h;
    window.addEventListener('resize', BS.debounce(function () {
      var s2 = sizeCanvas(B.c, B.ctx, 2);
      B.w = s2.w; B.h = s2.h;
    }, 200));
  };

  function drawBurst(dt) {
    var ctx = B.ctx;
    ctx.clearRect(0, 0, B.w, B.h);
    var alive = [];
    for (var i = 0; i < B.p.length; i++) {
      var p = B.p[i];
      p.age += dt;
      if (p.age >= p.life) continue;
      p.vy += p.g * dt;
      p.vx *= Math.pow(p.drag, dt * 60);
      p.vy *= Math.pow(p.drag, dt * 60);
      p.x += p.vx * dt + Math.sin(p.age * 3 + p.ph) * p.sway * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      var fadeStart = p.life * 0.55;
      var a = p.age > fadeStart ? 1 - (p.age - fadeStart) / (p.life - fadeStart) : 1;
      var born = Math.min(1, p.age / 0.12);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, a) * born;
      ctx.fillStyle = p.color;
      if (p.kind === 'heart') {
        heartPath(ctx, p.size);
        ctx.fill();
      } else if (p.kind === 'spark') {
        sparkPath(ctx, p.size * 1.25);
        ctx.fill();
      } else if (p.kind === 'conf') {
        ctx.scale(1, Math.cos(p.age * 7 + p.ph));
        ctx.fillRect(-p.size * 0.7, -p.size * 0.28, p.size * 1.4, p.size * 0.56);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.42, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
      alive.push(p);
    }
    B.p = alive;
    ctx.globalAlpha = 1;
  }

  function tickBurst(ts) {
    var dt = Math.min(0.05, (ts - B.last) / 1000 || 0.016);
    B.last = ts;
    drawBurst(dt);
    if (B.p.length) {
      B.raf = requestAnimationFrame(tickBurst);
    } else {
      B.on = false;
      B.ctx.clearRect(0, 0, B.w, B.h);
    }
  }

  // Options: x, y, count, kinds[], colors[], speed[min,max], gravity, life[min,max],
  //          angle (radians, -PI/2 = up), spread (radians), drag, size[min,max]
  fx.burst = function (o) {
    if (BS.reduced || !B.c) return;
    o = o || {};
    var n = o.count || 50;
    var x = o.x != null ? o.x : B.w / 2;
    var y = o.y != null ? o.y : B.h / 2;
    var kinds = o.kinds || ['heart', 'spark', 'dot', 'conf'];
    var colors = o.colors || COLORS;
    var sp = o.speed || [180, 520];
    var life = o.life || [1.6, 2.8];
    var size = o.size || [5, 10];
    var g = o.gravity != null ? o.gravity : 700;
    var a0 = o.angle != null ? o.angle : -Math.PI / 2;
    var spread = o.spread != null ? o.spread : TAU;
    for (var i = 0; i < n; i++) {
      var ang = a0 + (Math.random() - 0.5) * spread;
      var v = between(sp[0], sp[1]);
      B.p.push({
        x: x, y: y,
        vx: Math.cos(ang) * v, vy: Math.sin(ang) * v,
        g: g, drag: o.drag || 0.985,
        kind: pick(kinds), color: pick(colors),
        size: between(size[0], size[1]),
        rot: Math.random() * TAU, vr: between(-4, 4),
        life: between(life[0], life[1]), age: 0,
        sway: between(-30, 30), ph: Math.random() * TAU
      });
    }
    if (!B.on) {
      B.on = true;
      B.last = performance.now();
      B.raf = requestAnimationFrame(tickBurst);
    }
  };

  // A soft float of hearts and light, rising slowly (used for the name reveal)
  fx.rise = function (o) {
    o = o || {};
    fx.burst({
      x: o.x != null ? o.x : B.w / 2, y: o.y != null ? o.y : B.h * 0.72,
      count: o.count || 26, kinds: ['heart', 'dot', 'spark'],
      speed: [30, 120], gravity: -34, drag: 0.992, spread: Math.PI * 0.9,
      life: [3.2, 5.2], size: [4, 8]
    });
  };

  // A tiny sparkle at an element (used when a card flips, an answer is right...)
  fx.pop = function (elm, n) {
    if (!elm) return;
    var r = elm.getBoundingClientRect();
    fx.burst({
      x: r.left + r.width / 2, y: r.top + r.height / 2, count: n || 14,
      kinds: ['spark', 'heart', 'dot'], speed: [70, 240], gravity: 260, life: [0.8, 1.5], size: [4, 8]
    });
  };

})();
