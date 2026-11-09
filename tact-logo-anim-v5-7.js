/* tact logo build animation, rebuilt from "Tact Logo An-w.mp4".
   Usage: tactLogoAnim(svg, { delay: 0, loop: false }) -> returns Animation[]; cancel them to stop.
   Works on the 18-path tact lockup (LOGO_PATHS order) and on any other icon SVG (generic build). */
(function () {
  var EASE = "cubic-bezier(.65,0,.35,1)";
  // [start ms, duration ms, kind] per LOGO_PATHS index
  var LOGO = {
    1: [0, 520, "down"], 0: [110, 600, "left"], 3: [200, 560, "down"], 2: [300, 520, "down"],
    4: [120, 320, "left"], 5: [300, 220, "down"], 6: [380, 200, "pop"], 7: [440, 380, "left"],
    8: [700, 220, "down"], 9: [780, 200, "pop"], 10: [940, 300, "left"], 11: [1150, 320, "left"], 12: [1450, 260, "down"],
    13: [150, 420, "left"], 14: [560, 460, "left"], 15: [980, 520, "left"], 16: [1500, 600, "left"],
    17: [2350, 650, "dot"]
  };
  var FROM = { down: { clipPath: "inset(0 0 100% 0)" }, left: { clipPath: "inset(0 100% 0 0)" }, pop: { opacity: 0, transform: "scale(.2)" }, dot: { opacity: 0, transform: "scale(0)" } };
  var TO = { down: { clipPath: "inset(0 0 0 0)" }, left: { clipPath: "inset(0 0 0 0)" }, pop: { opacity: 1, transform: "scale(1)" }, dot: { opacity: 1, transform: "scale(1)" } };
  function mid(kind) { return kind === "dot" ? [{ opacity: 1, transform: "scale(.5)", f: .12 }, { opacity: 1, transform: "scale(3.4)", f: .55 }] : []; }
  function plan(svg) {
    var ps = Array.prototype.slice.call(svg.querySelectorAll("path"));
    if (ps.length === 18 && !svg.hasAttribute("data-draw")) return ps.map(function (p, i) { return [p].concat(LOGO[i]); });
    return ps.map(function (p, i) { return [p, i * 90, i ? 300 : 420, i ? "pop" : "down"]; });
  }
  function frames(kind, s, d, C, loop) {
    var a = FROM[kind], b = TO[kind], ks = [];
    var o0 = loop ? s / C : 0, o1 = loop ? (s + d) / C : 1;
    if (loop && o0 > 0) ks.push(Object.assign({ offset: 0 }, a));
    ks.push(Object.assign({ offset: o0, easing: kind === "dot" ? "cubic-bezier(.3,.7,.3,1)" : EASE }, a));
    mid(kind).forEach(function (m) { ks.push({ offset: o0 + (o1 - o0) * m.f, opacity: m.opacity, transform: m.transform, easing: "cubic-bezier(.45,0,.3,1)" }); });
    ks.push(Object.assign({ offset: o1 }, b));
    if (loop) { ks.push(Object.assign({ offset: .9, opacity: 1 }, b)); ks.push(Object.assign({}, b, { offset: .97, opacity: 0 })); ks.push(Object.assign({ offset: 1 }, a)); }
    return ks;
  }
  window.tactLogoAnim = function (svg, opt) {
    opt = opt || {};
    if (!svg || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return [];
    var loop = !!opt.loop, delay = opt.delay || 0, rows = plan(svg);
    var end = rows.reduce(function (m, r) { return Math.max(m, r[1] + r[2]); }, 0), C = Math.round(end / .82);
    return rows.map(function (r) {
      var p = r[0], kind = r[3];
      p.style.transformBox = "fill-box"; p.style.transformOrigin = "50% 50%";
      p.style.strokeOpacity = "0"; p.style.fillOpacity = "";
      try {
        return loop
          ? p.animate(frames(kind, r[1], r[2], C, true), { duration: C, delay: delay, iterations: Infinity, fill: "both" })
          : p.animate(frames(kind, r[1], r[2], 0, false), { duration: r[2], delay: delay + r[1], fill: "both" });
      } catch (e) { return null; }
    }).filter(Boolean);
  };
  window.tactLogoHide = function (svg) { plan(svg).forEach(function (r) { var k = r[3]; Object.assign(r[0].style, k === "down" || k === "left" ? { clipPath: FROM[k].clipPath } : { opacity: "0" }); }); };
  window.tactLogoShow = function (svg) { plan(svg).forEach(function (r) { r[0].style.clipPath = ""; r[0].style.opacity = ""; }); };
})();
