import { useEffect, useRef } from "react";
import { EDU } from "../data.js";
/* Pinned section: cards appear one by one as you scroll through it */
export default function Education() {
  const sec = useRef(null), line = useRef(null), cards = useRef([]);
  useEffect(() => {
    const N = EDU.length, cl = (v) => Math.max(0, Math.min(1, v));
    const upd = () => {
      const r = sec.current.getBoundingClientRect(), p = cl(-(r.top - 60) / (r.height - innerHeight)), seg = p * N;
      line.current.style.setProperty("--p", p);
      cards.current.forEach((c, i) => {
        const f = seg - i, o = f < 0 ? 0 : i === N - 1 ? Math.min(f / .2, 1) : f > 1 ? 0 : Math.min(f / .2, 1, (1 - f) / .2);
        c.style.opacity = o; c.style.transform = `translateY(calc(-50% + ${(1 - o) * 18}px))`;
      });
    };
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
    return () => { removeEventListener("scroll", upd); removeEventListener("resize", upd); };
  }, []);
  return (
    <section id="education" ref={sec} aria-label="Education"><div className="stage">
      <h2 className="eh">Education</h2><div id="eline" ref={line} />
      {EDU.map((e, i) => (
        <article className="ec" key={e.t} ref={(el) => (cards.current[i] = el)}>
          <div className="dt">{e.d}</div><h3>{e.t}</h3><p>{e.p}</p><div className="bd"><span>{e.i}</span></div>
        </article>
      ))}
    </div></section>
  );
}
