const MODES = [
  ['rate', 'Per hr', 'g/h'],
  ['volume', 'Volume', 'ml'],
  ['carbs', 'Carbs', 'g'],
  ['bottles', 'Bottles', '×'],
];

export default function ModeSelector({ mode, onChange }) {
  return (
    <div className="sec">
      <div className="lbl">Start from</div>
      <div className="modes">
        {MODES.map(([m, label, unit]) => (
          <button
            key={m}
            type="button"
            className={'mode' + (mode === m ? ' on' : '')}
            aria-pressed={mode === m}
            onClick={() => onChange(m)}
          >
            {label}
            <small>{unit}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
