
import { useEffect, useRef } from "react";
/* Fades its element up when it scrolls into view */
export default function Rv({ as: T = "div", className = "", ...p }) {
  const r = useRef(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { r.current.classList.add("in"); o.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    o.observe(r.current);
    return () => o.disconnect();
  }, []);
  return <T ref={r} className={`rv ${className}`} {...p} />;
}
