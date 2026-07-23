// Hero background: a field of short lines that turn to face a target.
// The target is the cursor on desktop, or a slow drifting point when idle
// or on touch. Dim by design so the hero copy stays readable.
// Vanilla canvas (no p5). Pauses off-screen. Honors prefers-reduced-motion.
// This is the club's own creative-coding on the homepage.
(function () {
  var canvas = document.getElementById('hero-bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var spacing = 46;
  var target = { x: 0, y: 0 };
  var pointer = { x: 0, y: 0, active: false };
  var t = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!target.x) { target.x = W / 2; target.y = H / 2; }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (var y = spacing / 2; y < H; y += spacing) {
      for (var x = spacing / 2; x < W; x += spacing) {
        var dx = target.x - x, dy = target.y - y;
        var ang = Math.atan2(dy, dx);
        var d = Math.sqrt(dx * dx + dy * dy);
        var len = Math.max(6, 24 - d / 24);
        // Dim: alpha fades with distance, capped low so text stays legible.
        var a = Math.max(0.05, 0.4 - d / 950);
        // Violet (near) to a cooler blue-violet (far), kept subdued.
        var mix = Math.min(1, d / 640);
        var rr = Math.round(168 + (107 - 168) * mix);
        var gg = Math.round(85 + (139 - 85) * mix);
        var bb = 250;
        ctx.strokeStyle = 'rgba(' + rr + ',' + gg + ',' + bb + ',' + a + ')';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
        ctx.stroke();
      }
    }
  }

  var running = false, rafId = null;
  function loop() {
    t += 0.008;
    if (pointer.active) {
      target.x += (pointer.x - target.x) * 0.08;
      target.y += (pointer.y - target.y) * 0.08;
    } else {
      // Gentle drifting target so the field is alive without a cursor.
      var tx = W / 2 + Math.cos(t * 0.7) * W * 0.30;
      var ty = H / 2 + Math.sin(t * 1.1) * H * 0.28;
      target.x += (tx - target.x) * 0.03;
      target.y += (ty - target.y) * 0.03;
    }
    drawFrame();
    rafId = requestAnimationFrame(loop);
  }
  function start() { if (running) return; running = true; rafId = requestAnimationFrame(loop); }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }

  window.addEventListener('resize', function () {
    resize();
    if (reduce) drawFrame();
  }, { passive: true });

  window.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    if (e.clientY >= r.top && e.clientY <= r.bottom) {
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    }
  }, { passive: true });
  window.addEventListener('pointerout', function () { pointer.active = false; }, { passive: true });

  resize();

  if (reduce) {
    // Static single frame: a calm fixed fan, no animation.
    target.x = W * 0.5; target.y = H * 0.42;
    drawFrame();
    return;
  }

  // Only run while the hero is on screen.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { en.isIntersecting ? start() : stop(); });
    }, { threshold: 0 });
    io.observe(canvas);
  } else {
    start();
  }
})();
