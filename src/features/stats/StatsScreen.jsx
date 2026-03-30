export default function StatsScreen({ stats, achievements }) {
  const badges = [
    { id: 'firstBidWin', label: 'First Bid Win', unlocked: achievements.firstBidWin },
    { id: 'hit200', label: 'Perfect 200', unlocked: achievements.hit200 },
    { id: 'underdog', label: 'Underdog Comeback', unlocked: achievements.underdog },
  ];

  return (
    <section className="screen screen-stats">
      <h2>Stats + Achievements</h2>
      <div className="card-panel">
        <p>Games played: {stats.gamesPlayed}</p>
        <p>Rounds played: {stats.roundsPlayed}</p>
        <p>Highest bid seen: {stats.highestBid}</p>
        <p>Team A wins: {stats.winsByTeam[0]} | Team B wins: {stats.winsByTeam[1]}</p>
      </div>

      <div className="card-panel">
        <h3>Achievement Track (placeholder)</h3>
        <ul className="achievements">
          {badges.map((badge) => (
            <li key={badge.id} className={badge.unlocked ? 'on' : 'off'}>
              {badge.unlocked ? '🏆' : '🔒'} {badge.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
