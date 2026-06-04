export default function NumField({
  value,
  onChange,
  unit,
  step = 10,
  min = 0,
}) {
  const stepDecimals = String(step).split('.')[1]?.length ?? 0;
  const precision = Math.pow(10, stepDecimals);
  const updateBy = (delta) => {
    const nextValue = Math.round((value + delta) * precision) / precision;
    onChange(Math.max(min, nextValue));
  };

  return (
    <div className="field">
      <button type="button" className="stp" onClick={() => updateBy(-step)}>
        -
      </button>
      <div className="body">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(min, +e.target.value || 0))}
        />
        <div className="unit">{unit}</div>
      </div>
      <button type="button" className="stp" onClick={() => updateBy(step)}>
        +
      </button>
    </div>
  );
}
