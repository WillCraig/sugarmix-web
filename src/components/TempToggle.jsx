export default function TempToggle({ temp, onChange }) {
  return (
    <div className="sec">
      <div className="lbl">Water temperature</div>
      <div className="temp">
        <button
          type="button"
          className={temp === 'room' ? 'on' : ''}
          aria-pressed={temp === 'room'}
          onClick={() => onChange('room')}
        >
          Room temp
          <small>~20°C · ceiling 200</small>
        </button>
        <button
          type="button"
          className={temp === 'hot' ? 'on hot' : ''}
          aria-pressed={temp === 'hot'}
          onClick={() => onChange('hot')}
        >
          Hot water
          <small>~60°C · ceiling 280</small>
        </button>
      </div>
    </div>
  );
}
