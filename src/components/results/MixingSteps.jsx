const NUMBER_TOKEN = /(\d[\d.]*\s?(?:g|ml|°C)?)/;

function formatStep(step) {
  return step.split(NUMBER_TOKEN).map((part, index) => {
    if (NUMBER_TOKEN.test(part)) {
      return <b key={index}>{part}</b>;
    }
    return part;
  });
}

export default function MixingSteps({ stepsList, tempLabel }) {
  return (
    <>
      <div className="sec" style={{ paddingBottom: 0 }}>
        <div className="lbl">Method · {tempLabel}</div>
      </div>
      <div className="steps">
        {stepsList.map((s, i) => (
          <div className="step" key={i}>
            <div className="no">{i + 1}</div>
            <div className="tx">{formatStep(s)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
