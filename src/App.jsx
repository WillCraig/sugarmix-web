import { useState } from 'react';
import { compute, steps } from './utils/calc';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import InputPanel from './components/InputPanel';
import ConcentrationSlider from './components/ConcentrationSlider';
import TempToggle from './components/TempToggle';
import AdvancedPanel from './components/AdvancedPanel';
import ResultsSection from './components/results/ResultsSection';

export default function App() {
  const [mode, setMode] = useState('rate');
  const [conc, setConc] = useState(800);
  const [temp, setTemp] = useState('hot');
  const [finalVolume, setFinalVolume] = useState(500);
  const [totalCarbs, setTotalCarbs] = useState(90);
  const [carbsPerHour, setCarbsPerHour] = useState(90);
  const [durationHours, setDurationHours] = useState(4);
  const [numBottles, setNumBottles] = useState(2);
  const [bottleSize, setBottleSize] = useState(500);
  const [pricePerKg, setPricePerKg] = useState(1.1);
  const [adv, setAdv] = useState(false);
  const [saltOn, setSaltOn] = useState(true);
  const [lemonOn, setLemonOn] = useState(false);

  const r = compute({
    mode,
    concentration: conc,
    temp,
    finalVolume,
    totalCarbs,
    carbsPerHour,
    durationHours,
    numBottles,
    bottleSize,
    pricePerKg,
    saltPerL: saltOn ? 1.0 : 0,
    lemonPct: lemonOn ? 3 : 0,
    currency: '$',
  });

  const stepsList = steps(r);

  return (
    <div className="lab-outer">
      <div className="lab-shell">
        <div className="lab-left">
          <div className="lab">
            <Header />
            <ModeSelector mode={mode} onChange={setMode} />
            <InputPanel
              mode={mode}
              finalVolume={finalVolume}
              setFinalVolume={setFinalVolume}
              totalCarbs={totalCarbs}
              setTotalCarbs={setTotalCarbs}
              carbsPerHour={carbsPerHour}
              setCarbsPerHour={setCarbsPerHour}
              durationHours={durationHours}
              setDurationHours={setDurationHours}
              numBottles={numBottles}
              setNumBottles={setNumBottles}
              bottleSize={bottleSize}
              setBottleSize={setBottleSize}
            />
            <ConcentrationSlider conc={conc} wv={r.wv} onChange={setConc} />
            <TempToggle temp={temp} onChange={setTemp} />
            <AdvancedPanel
              open={adv}
              onToggleOpen={() => setAdv((v) => !v)}
              bottleSize={bottleSize}
              setBottleSize={setBottleSize}
              pricePerKg={pricePerKg}
              setPricePerKg={setPricePerKg}
              saltOn={saltOn}
              setSaltOn={setSaltOn}
              lemonOn={lemonOn}
              setLemonOn={setLemonOn}
            />
          </div>
        </div>
        <div className="lab-right">
          <ResultsSection r={r} stepsList={stepsList} />
        </div>
      </div>
    </div>
  );
}
