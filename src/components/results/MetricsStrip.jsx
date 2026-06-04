export default function MetricsStrip({ gPerL, wv }) {
  return (
    <div className="mx">
      <div className="mcard">
        <div className="k">Concentration</div>
        <div className="n">
          {gPerL}
          <small> g/L</small>
        </div>
      </div>
      <div className="mcard">
        <div className="k">Strength</div>
        <div className="n">
          {wv}
          <small>% w/v</small>
        </div>
      </div>
    </div>
  );
}
