interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'connect', label: 'Connect Wallet' },
    { id: 'cases', label: 'Case Management' },
    { id: 'evidence', label: 'Evidence Management' },
    { id: 'access', label: 'Access Control' },
    { id: 'stats', label: 'System Statistics' },
  ];

  return (
    <nav className="nav-tabs" style={{
      display: 'flex',
      background: 'rgba(15, 32, 39, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(99, 179, 237, 0.2)',
      borderRadius: '16px',
      padding: '6px',
      marginBottom: '2rem',
      gap: '6px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          style={{
            flex: 1,
            padding: '14px 24px',
            background: activeTab === tab.id
              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              : 'transparent',
            color: activeTab === tab.id ? 'white' : 'rgba(147, 197, 253, 0.7)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
