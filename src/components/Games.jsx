
import { GAMES } from "../data.js";
import Tile from "./Tile.jsx";

export default function Games() {
  const now = GAMES.find((g) => g.s === "playing");
  const done = GAMES.filter((g) => g.s === "done");

  return (
    <section id="games">
      <div className="wrap">
        <h2>When I'm AFK!</h2>

        {now && (
          <article className="card now">
            <div className="game-feature-cover">
              <Tile t={now.t} i={0} img={now.img} />
            </div>

            <div>
              <div className="mono live">
                <span className="dot" />
                Playing now · {now.p}
              </div>

              <h3>{now.t}</h3>
              <p>{now.note}</p>

              {now.hrs && now.hrs !== "—" && (
                <div className="mono">{now.hrs} hrs in</div>
              )}
            </div>
          </article>
        )}

        <div className="card shelf">
          <div className="mono">
            Collection · hover to explore
          </div>

          <div className="cov">
            {done.map((g, i) => (
              <figure
                className="cv"
                tabIndex={0}
                key={g.t}
                style={{
                  "--r":
                    (i % 2 ? 1 : -1) *
                    (2 + (i * 3) % 4) +
                    "deg",
                }}
              >
                <div className="game-cover">
                  <Tile t={g.t} i={i + 1} img={g.img} />
                </div>

                <figcaption>
                  {g.t}
                  {g.r != null && (
                    <span className="mono">{g.r}/10</span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
