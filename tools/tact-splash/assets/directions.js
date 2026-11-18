(()=>{
const EO = "cubic-bezier(.16,1,.3,1)", IO = "cubic-bezier(.77,0,.175,1)", BK = "cubic-bezier(.34,1.4,.64,1)", DR = "cubic-bezier(.65,0,.35,1)";
const FALL = "cubic-bezier(.55,0,1,.45)", RISE = "cubic-bezier(0,.55,.45,1)";
const PIECES = [
  { k: "ring", c: "#56b9ab", o: "50% 50%", d: "M17.48 2.15C25.93 2.15 32.8 9.02 32.8 17.47C32.8 25.92 25.93 32.79 17.48 32.79C9.03 32.79 2.16 25.92 2.16 17.47C2.16 9.02 9.03 2.15 17.48 2.15ZM17.48 0C7.83 0 0 7.82 0 17.48C0 27.14 7.82 34.96 17.48 34.96C27.14 34.96 34.96 27.14 34.96 17.48C34.96 7.82 27.14 0 17.48 0Z" },
  { k: "q1", c: "#e7531e", o: "0% 100%", d: "M76.86 34.95V34.99H41.91V0C61.21 0 76.86 15.69 76.86 34.95Z" },
  { k: "q2", c: "#e7531e", o: "0% 0%", d: "M34.99 42.64V42.6H0.04V77.59C19.34 77.59 34.99 61.9 34.99 42.64Z" },
  { k: "q3", c: "#e7531e", o: "100% 0%", d: "M41.91 42.64V42.6H76.86V77.59C57.56 77.59 41.91 61.9 41.91 42.64Z" },
  { k: "q4", c: "#e7531e", o: "100% 100%", d: "M83.78 34.95V34.99H118.73V0C99.43 0 83.78 15.69 83.78 34.95Z" },
  { k: "disc", c: "#56b9ab", o: "50% 50%", d: "M118.77 60.12A17.48 17.48 0 1 1 83.81 60.12A17.48 17.48 0 1 1 118.77 60.12Z" }
];
const LETTERS = [
  "M12.938 18.8768L12.9101 28.9794C12.8822 30.4194 13.2952 36.0289 21.7122 33.8242V40.5331C21.7122 40.5331 19.993 40.8792 18.6144 40.9518C14.0878 41.1862 8.69044 40.1648 6.1955 35.934C5.17966 34.2204 4.68849 32.0101 4.68849 29.3087V13.7753H0V7.1835H4.68849V0.0112305H12.9268V7.1835H21.7122V13.7753H11.0514C11.0514 13.7753 12.938 14.5567 12.938 18.8824",
  "M46.2544 34.3598C46.2433 34.6612 42.7437 34.9403 42.4702 34.9682C41.0748 35.1021 39.6571 35.1133 38.2784 34.851C37.0393 34.6166 35.6105 34.1589 34.7509 33.1877C34.0867 32.4342 33.8355 31.4351 33.8355 30.4471C33.8355 28.4434 35.0523 26.9978 36.8886 26.3224C38.7082 25.6582 40.6617 25.6582 42.5651 25.8201C42.8162 25.8424 46.2544 26.0768 46.2544 26.395V34.3598ZM53.7784 15.8235C52.9914 12.7649 50.8201 10.1025 47.9512 8.65685C47.3205 8.35545 46.6507 8.09312 45.9586 7.87544C45.953 7.87544 45.9475 7.87544 45.9419 7.86986C40.4552 6.15633 33.4337 7.01588 28.9405 8.63452V15.4942C30.0401 14.9137 31.2345 14.4728 32.4681 14.1547C35.0021 13.5072 37.7147 13.3788 40.232 13.5909C41.8897 13.736 44.0274 14.283 45.1102 15.6673C46.2489 17.1296 46.3158 19.3287 46.2544 21.0925C44.206 20.6851 42.1688 20.3613 40.0757 20.3613C36.777 20.3613 32.9257 20.7632 30.1406 22.767C27.6456 24.5642 26.133 27.5057 26.1274 30.5867V30.609C26.1665 33.8686 27.7907 36.9385 30.5424 38.719C33.2774 40.4883 36.8607 40.9516 40.0534 40.9739C43.5307 40.9962 46.9968 40.4213 50.3736 39.6009C51.4676 39.3329 53.2035 38.7804 54.1077 38.479V18.3352C54.1077 17.4813 53.996 16.6329 53.7839 15.818",
  "M66.794 23.9558C66.794 29.4816 71.2704 33.9579 76.7961 33.9579C76.7961 33.9579 80.4631 34.0975 83.84 32.9868V39.8465C81.0157 40.8065 78.4817 40.9795 75.4119 40.9795C66.007 40.9795 58.3882 33.3607 58.3882 23.9558V23.9224C58.3882 14.5231 66.007 6.89868 75.4119 6.89868C78.4761 6.89868 81.0157 7.07171 83.84 8.03173V14.8914C80.4631 13.7807 76.7961 13.9202 76.7961 13.9202C71.2759 13.9202 66.794 18.3966 66.794 23.9224V23.9558Z",
  "M88.2886 13.7696V29.303C88.2886 32.0101 88.7798 34.2148 89.7956 35.9283C92.285 40.1591 97.6879 41.1805 102.215 40.9461C103.593 40.8736 105.312 40.5275 105.312 40.5275V33.8185C96.8953 36.0232 96.4823 30.4138 96.5102 28.9737L96.5381 18.8712C96.5381 14.5511 94.6515 13.7641 94.6515 13.7641H105.312V7.17227H96.5269V0H88.2886V13.7641V13.7696Z"
];

function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function makeTiles(w, h, cell, seed) {
  const r = rng(seed), cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const ox = (w - cols * cell) / 2, oy = (h - rows * cell) / 2, cx = (cols - 1) / 2, cy = (rows - 1) / 2, out = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const v = r(), c = r(), rot = [0, 90, 180, 270][Math.floor(r() * 4)];
    if (v < 0.16) continue;
    const pad = cell * 0.1, s = +(cell - pad * 2).toFixed(1);
    let br = "50%", bg = "transparent", bd = "0px solid transparent";
    if (v < 0.62) { br = "100% 0 0 0"; bg = c < 0.55 ? "#e7531e" : c < 0.8 ? "#56b9ab" : "#282829"; }
    else if (v < 0.8) { bg = c < 0.5 ? "#56b9ab" : "#e7531e"; }
    else { bd = (cell * 0.055).toFixed(1) + "px solid #56b9ab"; }
    out.push({ x: +(ox + x * cell + pad).toFixed(1), y: +(oy + y * cell + pad).toFixed(1), s, br, bg, bd, r: rot, d: Math.hypot(x - cx, y - cy).toFixed(2) });
  }
  return out;
}
function frame(kind, label, w, h, r, mw, wh, lg, pad, hs, lh, cell, seed) {
  return { kind, label, w, h, r, mw, mh: +(mw * 78 / 119).toFixed(1), wh, ww: +(wh * 106 / 41).toFixed(1), wg: +(wh * 8 / 41).toFixed(1), cw: +(wh * 44 / 41).toFixed(1), cml: (-wh * 113 / 41).toFixed(1) + "px", lg, pad, hs, lh, tiles: makeTiles(w, h, cell, seed) };
}
const FRAMES = [
  frame("desktop", "Website splash, 16:9", 880, 495, 14, 150, 46, 34, 36, 40, 30, 55, 7),
  frame("mobile", "App splash", 270, 560, 38, 104, 34, 26, 22, 27, 24, 54, 11)
];

const word = (add, t0) => {
  add("[data-l]", [{ transform: "translateY(46px)" }, { transform: "none" }], (el, i) => ({ duration: 820, delay: t0 + i * 70, easing: EO }));
  add("[data-desc]", [{ opacity: 0, transform: "translateX(-10px)" }, { opacity: 1, transform: "none" }], { duration: 650, delay: t0 + 380, easing: EO });
};
const headline = (add, t0) => add("[data-ph]", [{ opacity: 0, transform: "translateY(22px)" }, { opacity: 1, transform: "none" }], { duration: 800, delay: t0, easing: EO });
const spinIn = (s, e) => [{ transform: "rotate(0deg)", offset: 0 }, { transform: "rotate(0deg)", offset: s, easing: IO }, { transform: "rotate(360deg)", offset: e }, { transform: "rotate(360deg)", offset: 1 }];


var EASE_LOGO = "cubic-bezier(.65,0,.35,1)";
var LOGO_BUILD = {
  1: [0, 520, "down"], 0: [110, 600, "left"], 3: [200, 560, "down"], 2: [300, 520, "down"],
  4: [120, 320, "left"], 5: [300, 220, "down"], 6: [380, 200, "pop"], 7: [440, 380, "left"],
  8: [700, 220, "down"], 9: [780, 200, "pop"], 10: [940, 300, "left"], 11: [1150, 320, "left"], 12: [1450, 260, "down"],
  13: [150, 420, "left"], 14: [560, 460, "left"], 15: [980, 520, "left"], 16: [1500, 600, "left"],
  17: [2350, 650, "dot"]
};
var FROM_LOGO = { down: { clipPath: "inset(0 0 100% 0)" }, left: { clipPath: "inset(0 100% 0 0)" }, pop: { opacity: 0, transform: "scale(.2)" }, dot: { opacity: 0, transform: "scale(0)" } };
var TO_LOGO = { down: { clipPath: "inset(0 0 0 0)" }, left: { clipPath: "inset(0 0 0 0)" }, pop: { opacity: 1, transform: "scale(1)" }, dot: { opacity: 1, transform: "scale(1)" } };
function midLogo(kind) { return kind === "dot" ? [{ opacity: 1, transform: "scale(.5)", f: .12 }, { opacity: 1, transform: "scale(3.4)", f: .55 }] : []; }
function planLogo(svg) {
  var ps = Array.prototype.slice.call(svg.querySelectorAll("path"));
  if (ps.length === 18 && !svg.hasAttribute("data-draw")) return ps.map(function (p, i) { return [p].concat(LOGO_BUILD[i]); });
  return ps.map(function (p, i) { return [p, i * 90, i ? 300 : 420, i ? "pop" : "down"]; });
}
function framesLogo(kind, s, d, C, loop) {
  var a = FROM_LOGO[kind], b = TO_LOGO[kind], ks = [];
  var o0 = loop ? s / C : 0, o1 = loop ? (s + d) / C : 1;
  if (loop && o0 > 0) ks.push(Object.assign({ offset: 0 }, a));
  ks.push(Object.assign({ offset: o0, easing: kind === "dot" ? "cubic-bezier(.3,.7,.3,1)" : EASE_LOGO }, a));
  midLogo(kind).forEach(function (m) { ks.push({ offset: o0 + (o1 - o0) * m.f, opacity: m.opacity, transform: m.transform, easing: "cubic-bezier(.45,0,.3,1)" }); });
  ks.push(Object.assign({ offset: o1 }, b));
  if (loop) { ks.push(Object.assign({ offset: .9, opacity: 1 }, b)); ks.push(Object.assign({}, b, { offset: .97, opacity: 0 })); ks.push(Object.assign({ offset: 1 }, a)); }
  return ks;
}
window.tactLogoAnim = function (svg, opt) {
  opt = opt || {};
  if (!svg || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return [];
  var loop = !!opt.loop, delay = opt.delay || 0, rows = planLogo(svg);
  var end = rows.reduce(function (m, r) { return Math.max(m, r[1] + r[2]); }, 0), C = Math.round(end / .82);
  return rows.map(function (r) {
    var p = r[0], kind = r[3];
    p.style.transformBox = "fill-box"; p.style.transformOrigin = "50% 50%";
    p.style.strokeOpacity = "0"; p.style.fillOpacity = "";
    try {
      return loop
        ? p.animate(framesLogo(kind, r[1], r[2], C, true), { duration: C, delay: delay, iterations: Infinity, fill: "both" })
        : p.animate(framesLogo(kind, r[1], r[2], 0, false), { duration: r[2], delay: delay + r[1], fill: "both" });
    } catch (e) { return null; }
  }).filter(Boolean);
};
window.tactLogoHide = function (svg) { planLogo(svg).forEach(function (r) { var k = r[3]; Object.assign(r[0].style, k === "down" || k === "left" ? { clipPath: FROM_LOGO[k].clipPath } : { opacity: "0" }); }); };
window.tactLogoShow = function (svg) { planLogo(svg).forEach(function (r) { r[0].style.clipPath = ""; r[0].style.opacity = ""; }); };

const SPEC = {
  a: {
    splash(add) {
      const off = { ring: [-200, -120, -200], q1: [10, -180, 180], q2: [-210, 130, -90], q3: [30, 190, 90], q4: [210, -140, 270], disc: [220, 140, 0] };
      add("[data-p]", (el) => { const o = off[el.dataset.p]; return [{ transform: `translate(${o[0]}px,${o[1]}px) rotate(${o[2]}deg) scale(.5)`, opacity: 0 }, { opacity: 1, offset: 0.3 }, { transform: "none", opacity: 1 }]; }, (el, i) => ({ duration: 1150, delay: 150 + i * 80, easing: EO }));
      add("[data-mark]", [{ transform: "scale(1)" }, { transform: "scale(1.05)", offset: 0.4 }, { transform: "scale(1)" }], { duration: 600, delay: 1250, easing: DR });
      word(add, 1350);
      add("[data-lockup]", [{ transform: "none", opacity: 1 }, { transform: "translateY(-48px)", opacity: 0 }], { duration: 700, delay: 3300, easing: IO, fill: "forwards" });
      add("[data-photo]", [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }], { duration: 950, delay: 3350, easing: IO });
      headline(add, 3900);
    },
    loader(add) { add('[data-p^="q"]', (el, i) => spinIn((i % 4) * 0.18, (i % 4) * 0.18 + 0.24), { duration: 2600 }); }
  },
  b: {
    splash(add) {
      add("[data-t]", (el) => {
        const d = +el.dataset.d, r = +el.dataset.r, T = 2600, R = (v) => `rotate(${v}deg)`;
        const t1 = d * 38, t2 = t1 + 520, t3 = 1000 + d * 26, t4 = t3 + 460, t5 = 1480 + d * 46, t6 = t5 + 420;
        return [
          { transform: R(r - 90) + " scale(.3)", opacity: 0, offset: 0 },
          { transform: R(r - 90) + " scale(.3)", opacity: 0, offset: t1 / T, easing: EO },
          { transform: R(r) + " scale(1)", opacity: 1, offset: t2 / T },
          { transform: R(r) + " scale(1)", opacity: 1, offset: t3 / T, easing: IO },
          { transform: R(r + 90) + " scale(1)", opacity: 1, offset: t4 / T },
          { transform: R(r + 90) + " scale(1)", opacity: 1, offset: t5 / T, easing: "cubic-bezier(.5,0,.75,0)" },
          { transform: R(r + 90) + " scale(.4)", opacity: 0, offset: t6 / T },
          { transform: R(r + 90) + " scale(.4)", opacity: 0, offset: 1 }
        ];
      }, { duration: 2600 });
      add("[data-p]", [{ transform: "scale(.5)", opacity: 0 }, { transform: "none", opacity: 1 }], (el, i) => ({ duration: 700, delay: 1650 + i * 70, easing: BK }));
      word(add, 2000);
      add("[data-lockup]", [{ transform: "none", opacity: 1 }, { transform: "scale(.96)", opacity: 0 }], { duration: 600, delay: 3300, easing: IO, fill: "forwards" });
      add("[data-photo]", [{ opacity: 0, transform: "scale(1.08)" }, { opacity: 1, transform: "none" }], { duration: 1000, delay: 3350, easing: EO });
      headline(add, 3800);
    },
    loader(add) { add('[data-p^="q"]', (el, i) => { el.style.transformOrigin = "50% 50%"; return spinIn((i % 4) * 0.12, (i % 4) * 0.12 + 0.36); }, { duration: 2200 }); }
  },
  c: {
    splash(add) {
      add('[data-p="ring"]', [{ transform: "scale(9)", opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: "none", opacity: 1 }], { duration: 1300, delay: 100, easing: IO });
      add('[data-p^="q"]', (el) => { el.style.transformBox = "view-box"; el.style.transformOrigin = "59.4px 38.8px"; return [{ transform: "rotate(-240deg) scale(.3)", opacity: 0 }, { opacity: 1, offset: 0.3 }, { transform: "none", opacity: 1 }]; }, (el, i) => ({ duration: 1250, delay: 650 + i * 90, easing: EO }));
      add('[data-p="disc"]', [{ transform: "translateY(-140px)", opacity: 0, easing: FALL }, { transform: "translateY(0)", opacity: 1, offset: 0.55, easing: RISE }, { transform: "translateY(-10px)", offset: 0.75, easing: FALL }, { transform: "none", opacity: 1 }], { duration: 850, delay: 1400 });
      word(add, 1750);
      add("[data-lockup]", [{ transform: "none", opacity: 1 }, { transform: "scale(.92)", opacity: 0 }], { duration: 700, delay: 3300, easing: IO, fill: "forwards" });
      add("[data-photo]", [{ clipPath: "circle(0% at 50% 44%)" }, { clipPath: "circle(80% at 50% 44%)" }], { duration: 1100, delay: 3300, easing: IO });
      headline(add, 3900);
    },
    loader(add) { add('[data-p^="q"], [data-p="disc"]', (el) => { el.style.transformBox = "view-box"; el.style.transformOrigin = "59.4px 38.8px"; return [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }]; }, { duration: 2400, easing: "linear" }); }
  },
  d: {
    splash(add) {
      const draw = [{ strokeDashoffset: 1, strokeOpacity: 1, fillOpacity: 0 }, { strokeDashoffset: 0, strokeOpacity: 1, fillOpacity: 0, offset: 0.62 }, { strokeDashoffset: 0, strokeOpacity: 0, fillOpacity: 1 }];
      add("[data-p]", draw, (el, i) => ({ duration: 1700, delay: 100 + i * 130, easing: DR }));
      add("[data-l]", draw, (el, i) => ({ duration: 1500, delay: 1000 + i * 110, easing: DR }));
      add("[data-desc]", [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 2000, easing: EO });
      add("[data-lockup]", [{ transform: "none", opacity: 1 }, { transform: "translateX(-40px)", opacity: 0 }], { duration: 700, delay: 3300, easing: IO, fill: "forwards" });
      add("[data-photo]", [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: 1000, delay: 3300, easing: IO });
      headline(add, 3850);
    },
    loader(add) {
      add("[data-p]", [{ strokeDashoffset: 1, strokeOpacity: 1, fillOpacity: 0 }, { strokeDashoffset: 0, strokeOpacity: 1, fillOpacity: 0, offset: 0.45 }, { strokeDashoffset: 0, strokeOpacity: 1, fillOpacity: 0, offset: 0.58 }, { strokeDashoffset: -1, strokeOpacity: 1, fillOpacity: 0 }], (el, i) => ({ duration: 2400, delay: (i % 6) * 120, easing: DR }));
    }
  },
  e: {
    splash(add) {
      add('[data-p="disc"]', (el) => { el.style.transformOrigin = "50% 100%"; return [
        { transform: "translate(-290px,-150px)", opacity: 0, offset: 0, easing: FALL },
        { transform: "translate(-190px,0) scale(1.15,.85)", opacity: 1, offset: 0.3, easing: RISE },
        { transform: "translate(-125px,-60px)", offset: 0.48, easing: FALL },
        { transform: "translate(-62px,0) scale(1.1,.9)", offset: 0.66, easing: RISE },
        { transform: "translate(-28px,-22px)", offset: 0.8, easing: FALL },
        { transform: "translate(0,0) scale(1.05,.95)", offset: 0.92, easing: EO },
        { transform: "none", opacity: 1, offset: 1 }]; }, { duration: 1500, delay: 150 });
      const pop = [{ transform: "scale(.02)" }, { transform: "none" }];
      add('[data-p="q2"]', pop, { duration: 650, delay: 650, easing: BK });
      add('[data-p="q3"]', pop, { duration: 650, delay: 1000, easing: BK });
      add('[data-p="ring"]', (el) => { el.style.transformOrigin = "50% 100%"; return [{ transform: "translateY(-160px)", opacity: 0, easing: FALL }, { transform: "translateY(0) scale(1.12,.88)", opacity: 1, offset: 0.55, easing: RISE }, { transform: "translateY(-14px)", offset: 0.75, easing: FALL }, { transform: "none", opacity: 1 }]; }, { duration: 900, delay: 1250 });
      add('[data-p="q1"]', pop, { duration: 650, delay: 1550, easing: BK });
      add('[data-p="q4"]', pop, { duration: 650, delay: 1700, easing: BK });
      word(add, 1900);
      add("[data-word]", [{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 3200, fill: "forwards" });
      add('[data-p="disc"]', [{ transform: "none" }, { transform: "scale(40)" }], { duration: 900, delay: 3250, easing: IO, fill: "forwards" });
      add("[data-photo]", [{ clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(80% at 50% 50%)" }], { duration: 1000, delay: 3850, easing: IO });
      headline(add, 4350);
    },
    loader(add) {
      add('[data-p="disc"]', (el) => { el.style.transformOrigin = "50% 100%"; return [
        { transform: "translate(-84px,0)", easing: RISE },
        { transform: "translate(-63px,-24px)", offset: 0.25, easing: FALL },
        { transform: "translate(-42px,0) scale(1.1,.9)", offset: 0.5, easing: RISE },
        { transform: "translate(-21px,-24px)", offset: 0.75, easing: FALL },
        { transform: "translate(0,0) scale(1.1,.9)" }]; }, { duration: 1300, direction: "alternate" });
    }
  },
  f: {
    splash(add) {
      const root = document.getElementById("tact-assembly-splash");
      const logo = root ? root.querySelector("[data-intro-logo]") : null;
      if (!logo) return;
      window.tactLogoHide(logo);
      requestAnimationFrame(() => {
        window.tactLogoShow(logo);
        window.tactLogoAnim(logo, { delay: 150 });
      });
      add("[data-intro-logo]", [
        { transform: "none", opacity: 1 },
        { transform: "scale(.97)", opacity: 0 }
      ], { duration: 500, delay: 3500, easing: "cubic-bezier(.77,0,.175,1)", fill: "forwards" });
    },
    loader(add) {
      const loader = document.getElementById("tact-assembly-loading");
      const svg = loader ? loader.querySelector("[data-intro-logo]") : null;
      if (!svg) return;
      window.tactLogoAnim(svg, { delay: 0, loop: true });
    }
  }
};
SPEC.v57 = SPEC.f;

window.TactSplashDirections={SPEC};
})();