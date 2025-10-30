interface ConnectionStatusProps {
  isConnected: boolean;
  address?: string;
}

export function ConnectionStatus({ isConnected, address }: ConnectionStatusProps) {
  return (
    <div
      className="connection-status"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 500,
        background: isConnected ? '#4caf50' : '#f44336',
        color: 'white',
        zIndex: 1000,
      }}
    >
      {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Disconnected'}
    </div>
  );
}
