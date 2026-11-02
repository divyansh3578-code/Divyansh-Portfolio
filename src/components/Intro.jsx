import { useEffect, useMemo, useState } from "react";
const ROWS = 8, COLS = 14;
export const introMs = (n) => (.25 + n * .09 + .6 + .7) * 1000 + 300;
export default function Intro({ name }) {
  const [go, setGo] = useState(false), [done, setDone] = useState(false);
  const delays = useMemo(() => Array.from({ length: ROWS * COLS }, (_, k) => ((k % COLS) * .04 + (ROWS - Math.floor(k / COLS)) * .05 + Math.random() * .08).toFixed(2)), []);
  useEffect(() => {
    const hold = introMs(name.length) - 300;
    document.documentElement.style.overflow = "hidden";
    const a = setTimeout(() => setGo(true), hold);
    const b = setTimeout(() => { setDone(true); document.documentElement.style.overflow = ""; }, hold + 1500);
    return () => { clearTimeout(a); clearTimeout(b); document.documentElement.style.overflow = ""; };
  }, [name]);
  if (done) return null;
  return (
    <div id="intro" className={go ? "go" : ""} aria-hidden="true">
      <div className="cells" style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gridTemplateRows: `repeat(${ROWS},1fr)` }}>
        {delays.map((d, i) => <i key={i} style={{ transitionDelay: d + "s" }} />)}
      </div>
      <div className="nm">{[...name].map((c, i) => <span className="m" key={i}><span style={{ animationDelay: `${(.25 + i * .09).toFixed(2)}s` }}>{c === " " ? "\u00a0" : c}</span></span>)}</div>
    </div>
  );
}
