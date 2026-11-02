export default function Tile({ t, i, img }) {
  const bg =
    i % 3 === 0
      ? "linear-gradient(145deg,#7a0f20,#1a0409)"
      : "linear-gradient(145deg,#4a4f57,#0e0f12)";

  return (
    <div className="tile">
      {img ? (
        <img src={img} alt={t} loading="lazy" />
      ) : (
        <div className="tile-placeholder" style={{ background: bg }}>
          {t[0]}
        </div>
      )}
    </div>
  );
}