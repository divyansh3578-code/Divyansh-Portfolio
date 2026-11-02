import { useEffect, useRef } from "react";
/* 3D universe: you sit inside a sphere of stars. Cursor steers the spin, scroll adds turns,
   and a few stars sit close to the camera so they "pop out" with parallax. */
export default function Sky() {
  const cv = useRef(null), cur = useRef(null);
  useEffect(() => {
    const RM = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(pointer:fine)").matches;
    const x = cv.current.getContext("2d"), D = Math.min(devicePixelRatio || 1, 2), TAU = 6.2832;
    let W, H, F, pts = [], ox = 0, oy = 0, mx = .5, my = .5, yaw = 0, pit = 0, vy = 0, vp = 0, last = scrollY, raf, cx = 0, cy = 0, tx = 0, ty = 0;
    const mk = () => {
      W = innerWidth; H = innerHeight; F = Math.max(W, H) * .85;
      const c = cv.current; c.width = W * D; c.height = H * D; c.style.width = W + "px"; c.style.height = H + "px"; x.setTransform(D, 0, 0, D, 0, 0);
      const n = W < 700 ? 800 : 1500;
      pts = Array.from({ length: n + 8 }, (_, i) => {
        const u = Math.random() * 2 - 1, t = Math.random() * TAU, q = Math.sqrt(1 - u * u), pop = i < n && Math.random() < .12;
        const d = pop ? .14 + Math.random() * .22 : 1;
        return { x: q * Math.cos(t), y: u, z: q * Math.sin(t), pop, d, d0: d, ph: Math.random() * TAU, ring: i >= n, a: Math.random() * TAU, s: Math.random() * .03 + .005,
          r: pop ? 1.1 + Math.random() * .9 : Math.random() < .05 ? 1.7 : Math.random() * .8 + .35, c: Math.random() < .5 ? "255,31,61" : "255,255,255" };
      });
    };
    const draw = () => {
      const ca = Math.cos(yaw), sa = Math.sin(yaw), cb = Math.cos(pit), sb = Math.sin(pit);
      x.clearRect(0, 0, W, H); x.fillStyle = "#fff";
      for (const s of pts) {
        const x1 = s.x * ca + s.z * sa, z1 = -s.x * sa + s.z * ca, y2 = s.y * cb - z1 * sb, z2 = s.y * sb + z1 * cb;
        let dd = s.d; if (s.pop && !RM) dd = s.d0 + .04 * Math.sin(s.ph += .012);
        const zv = z2 * dd; if (zv < (s.pop ? .03 : .12)) continue;
        const px = W / 2 + (x1 * dd - ox) / zv * F * .5, py = H / 2 + (y2 * dd - oy) / zv * F * .5;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) continue;
        const k = s.pop ? Math.min(.05 / zv, 3) + .5 : .6 + .8 * Math.min(z2, 1);
        if (s.ring) { x.globalAlpha = .6; x.strokeStyle = `rgb(${s.c})`; x.lineWidth = 1.2; x.beginPath(); x.arc(px, py, 6 * k + 3, 0, TAU); x.stroke(); }
        else {
          if (!RM) s.a += s.s;
          x.globalAlpha = (.35 + .65 * Math.abs(Math.sin(s.a))) * Math.min(1, z2 * 1.6);
          if (s.pop) { x.globalAlpha = .95; x.shadowBlur = 14; x.shadowColor = `rgb(${s.c})`; x.fillStyle = `rgb(${s.c})`; }
          x.beginPath(); x.arc(px, py, s.r * k, 0, TAU); x.fill();
          if (s.pop) { x.shadowBlur = 0; x.fillStyle = "#fff"; }
        }
      }
    };
    const move = (e) => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; tx = e.clientX; ty = e.clientY; if (fine && !RM && cur.current) cur.current.style.opacity = 1; };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const ds = scrollY - last; last = scrollY;
      vy += ((mx - .5) * .004 + .00012 + ds * .001 - vy) * .05; yaw += vy;
      vp += ((my - .5) * .004 + .00006 + ds * .0004 - vp) * .05; pit += vp;
      ox += ((mx - .5) * .1 - ox) * .05; oy += ((my - .5) * .07 - oy) * .05;
      cx += (tx - cx) * .18; cy += (ty - cy) * .18;
      if (cur.current) cur.current.style.transform = `translate(${cx}px,${cy}px)`;
      draw();
    };
    mk(); addEventListener("resize", mk); addEventListener("pointermove", move);
    if (RM) draw(); else loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", mk); removeEventListener("pointermove", move); };
  }, []);
  return <><canvas id="sky" ref={cv} aria-hidden="true" /><div className="cur" ref={cur} aria-hidden="true" /></>;
}
