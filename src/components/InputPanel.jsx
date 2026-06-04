import NumField from './NumField';

export default function InputPanel({
  mode,
  finalVolume,
  setFinalVolume,
  totalCarbs,
  setTotalCarbs,
  carbsPerHour,
  setCarbsPerHour,
  durationHours,
  setDurationHours,
  numBottles,
  setNumBottles,
  bottleSize,
  setBottleSize,
}) {
  return (
    <div className="sec">
      {mode === 'volume' && (
        <>
          <div className="lbl">Final bottle volume</div>
          <NumField
            value={finalVolume}
            onChange={setFinalVolume}
            unit="millilitres"
            step={50}
          />
          <div className="chips">
            {[500, 600, 750, 950].map((v) => (
              <button
                key={v}
                type="button"
                className={'chip' + (finalVolume === v ? ' on' : '')}
                onClick={() => setFinalVolume(v)}
              >
                {v} ml
              </button>
            ))}
          </div>
        </>
      )}
      {mode === 'carbs' && (
        <>
          <div className="lbl">Total carbohydrate</div>
          <NumField
            value={totalCarbs}
            onChange={setTotalCarbs}
            unit="grams of carbs"
            step={5}
          />
          <div className="chips">
            {[60, 90, 120, 150].map((v) => (
              <button
                key={v}
                type="button"
                className={'chip' + (totalCarbs === v ? ' on' : '')}
                onClick={() => setTotalCarbs(v)}
              >
                {v} g
              </button>
            ))}
          </div>
        </>
      )}
      {mode === 'rate' && (
        <>
          <div className="lbl">Carbs per hour × ride time</div>
          <div className="two">
            <NumField
              value={carbsPerHour}
              onChange={setCarbsPerHour}
              unit="g / hour"
              step={5}
            />
            <NumField
              value={durationHours}
              onChange={setDurationHours}
              unit="hours"
              step={1}
              min={1}
            />
          </div>
          <div className="chips">
            {[60, 80, 90, 100, 120].map((v) => (
              <button
                key={v}
                type="button"
                className={'chip' + (carbsPerHour === v ? ' on' : '')}
                onClick={() => setCarbsPerHour(v)}
              >
                {v} g/h
              </button>
            ))}
          </div>
        </>
      )}
      {mode === 'bottles' && (
        <>
          <div className="lbl">Bottles × size</div>
          <div className="two">
            <NumField
              value={numBottles}
              onChange={setNumBottles}
              unit="bottles"
              step={1}
              min={1}
            />
            <NumField
              value={bottleSize}
              onChange={setBottleSize}
              unit="ml each"
              step={50}
              min={1}
            />
          </div>
          <div className="chips">
            {[500, 600, 750, 950].map((v) => (
              <button
                key={v}
                type="button"
                className={'chip' + (bottleSize === v ? ' on' : '')}
                onClick={() => setBottleSize(v)}
              >
                {v} ml
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
