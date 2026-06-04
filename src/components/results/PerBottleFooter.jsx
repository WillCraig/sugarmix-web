export default function PerBottleFooter({ r }) {
  return (
    <>
      <div className="sec" style={{ paddingBottom: 0 }}>
        <div className="lbl">Per bottle · {r.perBottleVol} ml</div>
      </div>
      <div className="foot">
        <div className="c">
          <div className="k">Carbs</div>
          <div className="n">
            {r.perBottleCarbs}
            <span style={{ fontSize: 11 }}> g</span>
          </div>
        </div>
        <div className="c">
          <div className="k">Energy</div>
          <div className="n">
            {r.perBottleKcal}
            <span style={{ fontSize: 11 }}> kcal</span>
          </div>
        </div>
        <div className="c">
          <div className="k">Cost</div>
          <div className="n">
            {r.currency}
            {(r.cost / r.bottles).toFixed(2)}
          </div>
        </div>
      </div>
      <div className="pb mono">
        Batch total: {r.carbs} g carbs · {r.kcal} kcal · {r.currency}
        {r.cost.toFixed(2)}
      </div>
    </>
  );
}
