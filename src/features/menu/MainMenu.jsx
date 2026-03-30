import { HOUSE_RULES, FUTURE_RULESETS } from '../../core/rulesets/houseRules';

export default function MainMenu({ onStart, onReset }) {
  return (
    <section className="screen screen-menu">
      <p className="eyebrow">Kentucky Rook Reimagined</p>
      <h1>DUNK</h1>
      <p className="sub">Arcade drama. Big bids. Loud tricks.</p>

      <div className="card-panel">
        <h2>Default Mode: {HOUSE_RULES.label}</h2>
        <ul>
          <li>Rook always trump and ranks as 10.5</li>
          <li>Kitty in play and counts toward round points</li>
          <li>No forced trump when void in led suit</li>
          <li>Min bid: 80 • round total: 200 • first to 500</li>
        </ul>
        <button className="cta" onClick={onStart}>Start New Round</button>
      </div>

      <div className="card-panel muted">
        <h3>Roadmap Modes</h3>
        <ul>
          {FUTURE_RULESETS.map((mode) => (
            <li key={mode.id}>{mode.label} (planned)</li>
          ))}
        </ul>
      </div>

      <button className="link" onClick={onReset}>Reset Local Save</button>
    </section>
  );
}
