export default function RecipeGrid({ r }) {
  return (
    <div className="grid4">
      <div className="cell">
        <div className="k">
          <span className="dot" style={{ background: 'var(--ink)' }} />
          Sugar
        </div>
        <div className="n">
          {r.sugar}
          <small>g</small>
        </div>
      </div>
      <div className="cell">
        <div className="k">
          <span className="dot" style={{ background: '#6CA8E0' }} />
          {r.temp === 'hot' ? 'Hot water' : 'Water'}
        </div>
        <div className="n">
          {r.water}
          <small>ml</small>
        </div>
      </div>
      <div className="cell">
        <div className="k">
          <span className="dot" style={{ background: '#B7BDB9' }} />
          Salt
        </div>
        <div className="n">
          {r.salt}
          <small>g</small>
        </div>
      </div>
      <div className="cell">
        <div className="k">
          <span className="dot" style={{ background: '#E8C341' }} />
          Lemon
        </div>
        <div className="n">
          {r.lemon}
          <small>ml</small>
        </div>
      </div>
    </div>
  );
}
