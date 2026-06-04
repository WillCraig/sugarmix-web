export default function ConcentrationSlider({ conc, wv, onChange }) {
  const pct = ((conc - 400) / (950 - 400)) * 100;

  return (
    <div className="sec">
      <div className="lbl">
        <span>Concentration target</span>
        <span className="mono">
          {conc} g/L · {wv}% w/v
        </span>
      </div>
      <div className="scale">
        <input
          type="range"
          min={400}
          max={950}
          step={10}
          value={conc}
          onChange={(e) => onChange(+e.target.value)}
          style={{ '--pct': pct + '%' }}
        />
        <div className="ticks">
          <span>400 · light</span>
          <span>800 · standard</span>
          <span>950 · NERO</span>
        </div>
      </div>
      <div className="chips">
        {[
          ['Light', 600],
          ['Standard', 800],
          ['NERO', 900],
        ].map(([label, v]) => (
          <button
            key={v}
            type="button"
            className={'chip' + (conc === v ? ' on' : '')}
            onClick={() => onChange(v)}
          >
            {label} · {v}
          </button>
        ))}
      </div>
    </div>
  );
}
