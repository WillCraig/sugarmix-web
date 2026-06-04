import RecipeGrid from './RecipeGrid';
import MetricsStrip from './MetricsStrip';
import RiskBadge from './RiskBadge';
import MixingSteps from './MixingSteps';
import PerBottleFooter from './PerBottleFooter';

export default function ResultsSection({ r, stepsList }) {
  if (!r.ok) return null;

  return (
    <div className="res">
      <div className="resh">
        <h2>The Recipe</h2>
        <span className="fv mono">
          → {r.finalVolume} ml final ·{' '}
          {r.bottles > 1 ? r.bottles + ' bottles' : '1 bottle'}
        </span>
      </div>
      <RecipeGrid r={r} />
      <MetricsStrip gPerL={r.gPerL} wv={r.wv} />
      <RiskBadge
        risk={r.risk}
        per100Water={r.per100Water}
        ceiling={r.ceiling}
      />
      <MixingSteps stepsList={stepsList} tempLabel={r.tempLabel} />
      <PerBottleFooter r={r} />
    </div>
  );
}
