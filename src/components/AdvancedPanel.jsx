import NumField from './NumField';

function Toggle({ on, onToggle, label, detail }) {
  return (
    <div className="tog-row">
      <div className="tog-label">
        {label}
        {detail && <small>{detail}</small>}
      </div>
      <button
        type="button"
        className={'tog' + (on ? ' on' : '')}
        aria-pressed={on}
        onClick={onToggle}
      />
    </div>
  );
}

export default function AdvancedPanel({
  open,
  onToggleOpen,
  bottleSize,
  setBottleSize,
  pricePerKg,
  setPricePerKg,
  saltOn,
  setSaltOn,
  lemonOn,
  setLemonOn,
}) {
  return (
    <div className="adv">
      <button type="button" className="advtog" onClick={onToggleOpen}>
        <span>Advanced · bottle &amp; cost</span>
        <span>{open ? '–' : '+'}</span>
      </button>
      {open && (
        <div className="advbody">
          <div className="two" style={{ marginBottom: 16 }}>
            <div>
              <div className="lbl">Bottle size</div>
              <NumField
                value={bottleSize}
                onChange={setBottleSize}
                unit="ml"
                step={50}
                min={1}
              />
            </div>
            <div>
              <div className="lbl">Sugar price /kg</div>
              <NumField
                value={pricePerKg}
                onChange={setPricePerKg}
                unit="$ per kg"
                step={0.1}
              />
            </div>
          </div>
          <Toggle
            on={saltOn}
            onToggle={() => setSaltOn((v) => !v)}
            label="Add salt"
            detail="1 g per litre"
          />
          <Toggle
            on={lemonOn}
            onToggle={() => setLemonOn((v) => !v)}
            label="Add lemon juice"
            detail="3% of final volume"
          />
        </div>
      )}
    </div>
  );
}
