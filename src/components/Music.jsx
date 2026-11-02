import { useEffect, useRef, useState } from "react";
import { TRACK_LINKS } from "../data.js";
import Tile from "./Tile.jsx";

const MAX = 12;
const IDS = [...new Set([...TRACK_LINKS.matchAll(/track\/([A-Za-z0-9]+)/g)].map((m) => m[1]))].slice(0, MAX);
const pos = (k, n) => { const cols = Math.ceil(n / 2), r = k % 2, c = Math.floor(k / 2), j = ((k * 37) % 11) / 11; return [4 + (c + .5) / cols * 84 + (j - .5) * 6, r ? 52 + j * 10 : 6 + j * 14, ((k * 7) % 13) - 6, .5 + ((k * 3) % 6) / 10]; };

export default function Music() {
  const [cur, setCur] = useState(0), [info, setInfo] = useState({}), sc = useRef(null), box = useRef(null), ctrl = useRef(null);
  useEffect(() => {
    IDS.forEach((id) => fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent("https://open.spotify.com/track/" + id)}`)
      .then((r) => r.json()).then((j) => setInfo((p) => ({ ...p, [id]: { t: j.title, img: j.thumbnail_url } }))).catch(() => {}));
  }, []);
  useEffect(() => {
  const make = (API) => {
    if (!box.current || box.current.firstChild) return;
    const el = document.createElement("div"); box.current.appendChild(el);
    API.createController(el, { uri: `spotify:track:${IDS[0]}`, width: "100%", height: 152 }, (c) => { ctrl.current = c; });
  };
  if (window.__spApi) return make(window.__spApi);
  window.onSpotifyIframeApiReady = (API) => { window.__spApi = API; make(API); };
  if (!document.getElementById("sp-api")) {
    const tag = document.createElement("script"); tag.id = "sp-api"; tag.async = true; tag.src = "https://open.spotify.com/embed/iframe-api/v1"; document.body.appendChild(tag);
  }
}, []);
const pick = (k) => { setCur(k); const c = ctrl.current; if (!c) return; c.loadUri(`spotify:track:${IDS[k]}`); setTimeout(() => c.play(), 400); };
  const move = (e) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = sc.current.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
    [...sc.current.children].forEach((b) => { const d = +b.dataset.d; b.style.setProperty("--x", -dx * d * 50 + "px"); b.style.setProperty("--y", -dy * d * 50 + "px"); });
  };
  return (
    <section id="music"><div className="wrap">
      <h2>Music I might be listening to</h2>
      <div className="mono">Move your cursor to explore · click a cover to load it below</div>
      <div className="card scat" ref={sc} onPointerMove={move}>
        {IDS.map((tid, k) => { const q = pos(k, IDS.length), t = info[tid] || { t: "Track" }; return (
          <button key={tid} className={"alb" + (k === cur ? " on" : "")} data-d={q[3]} style={{ left: q[0] + "%", top: q[1] + "%", "--r": q[2] + "deg" }} onClick={() => pick(k)} aria-label={`Load ${t.t}`}><Tile t={t.t} i={k + 2} img={t.img} /></button>
        ); })}
      </div>
      <div className="card embed">
        <div ref={box} />
      </div>
    </div></section>
  );
}