import { useMemo, useState } from 'react';
import { HOUSE_RULES } from '../../core/rulesets/houseRules';
import { sanitizeBid } from '../../core/game/state';

export default function TableScreen({ state, onSubmitBid, onResolveRound, onStartNextRound }) {
  const [bidInput, setBidInput] = useState(HOUSE_RULES.minBid);

  const canScoreRound = state.phase === 'trick-preview';
  const bidPreview = sanitizeBid(bidInput);
  const bidInvalid = bidInput < HOUSE_RULES.minBid || bidInput > HOUSE_RULES.maxBid || bidInput % HOUSE_RULES.bidIncrement !== 0;

  const scoreBanner = useMemo(() => {
    if (!state.lastRoundSummary) return null;
    const { scored, raw } = state.lastRoundSummary;
    return `Team A ${raw[0]} → ${scored[0]} | Team B ${raw[1]} → ${scored[1]}`;
  }, [state.lastRoundSummary]);

  return (
    <section className="screen screen-table">
      <header>
        <h2>Round {state.roundNumber || '-'}</h2>
        <p>Team A: {state.teamTotals[0]} • Team B: {state.teamTotals[1]}</p>
      </header>

      <div className="table-stage">
        <div className="arc-lights" />
        <p className="moment">Winning Bid: {state.winningBid} by Seat {state.bidWinner + 1}</p>
        <p className="moment soft">Trump: {state.trumpSuit ?? 'TBD after bidding'}</p>
        {scoreBanner && <p className="result">Last Round: {scoreBanner}</p>}
      </div>

      <div className="card-panel">
        <h3>Bidding</h3>
        <label>
          Your bid
          <input
            type="number"
            min={HOUSE_RULES.minBid}
            max={HOUSE_RULES.maxBid}
            step={HOUSE_RULES.bidIncrement}
            value={bidInput}
            onChange={(e) => setBidInput(Number(e.target.value))}
          />
        </label>
        <p className="hint">Bid locks to {bidPreview} (House min 80, increments of 5)</p>
        <button
          className="cta"
          onClick={() => onSubmitBid(bidPreview)}
          disabled={state.phase !== 'bidding' || bidInvalid}
        >
          Throw Bid
        </button>
        {bidInvalid && <p className="error">Enter a bid from 80 to 200 in increments of 5.</p>}
        <ul className="log">
          {state.lastBidLog.map((line, idx) => <li key={`${line}-${idx}`}>{line}</li>)}
        </ul>
      </div>

      <div className="card-panel">
        <h3>Your Hand ({state.playerHand.length})</h3>
        <div className="hand-row">
          {state.playerHand.slice(0, 10).map((card) => (
            <span className={`card ${card.suit === 'Rook' ? 'rook' : ''}`} key={card.id}>
              {card.label}
              <small>{card.suit}</small>
            </span>
          ))}
        </div>
      </div>

      <div className="table-actions">
        <button className="cta alt" onClick={onResolveRound} disabled={!canScoreRound}>
          Resolve Round Score
        </button>
        <button className="cta" onClick={onStartNextRound} disabled={state.phase === 'bidding'}>
          Deal Next Round
        </button>
      </div>
    </section>
  );
}
