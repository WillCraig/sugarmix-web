const RISK_COLOR = {
  low: 'var(--low)',
  moderate: 'var(--mod)',
  high: 'var(--high)',
  exceeds: 'var(--ex)',
};
const RISK_ICON = { low: 'L', moderate: 'M', high: 'H', exceeds: '!' };

export default function RiskBadge({ risk, per100Water, ceiling }) {
  const color = RISK_COLOR[risk.level];
  return (
    <div className="risk" style={{ borderColor: color }}>
      <div className="ic" style={{ background: color }}>
        {RISK_ICON[risk.level]}
      </div>
      <div>
        <div className="t" style={{ color }}>
          {risk.label}
        </div>
        <div className="d">
          {risk.note}{' '}
          <span className="mono">
            {isFinite(per100Water) ? per100Water : '∞'} g / 100 ml water ·
            ceiling {ceiling}
          </span>
        </div>
      </div>
    </div>
  );
}
