export default function BottomNav({ current, onNavigate }) {
  const items = [
    { id: 'menu', label: 'Menu' },
    { id: 'table', label: 'Table' },
    { id: 'stats', label: 'Stats' },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <button
          key={item.id}
          className={current === item.id ? 'is-active' : ''}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
