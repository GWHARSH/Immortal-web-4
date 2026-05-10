export default function PremiumLoader({ text = 'Loading', size = 'md' }) {
  const containerSize = size === 'sm' ? '40px' : size === 'lg' ? '90px' : '65px';
  const innerRingInset = size === 'sm' ? '5px' : size === 'lg' ? '11px' : '8px';
  const coreInset = size === 'sm' ? '13px' : size === 'lg' ? '28px' : '20px';
  const labelSize = size === 'sm' ? '0.65rem' : size === 'lg' ? '0.85rem' : '0.75rem';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%' }}>
      <div style={{ position: 'relative', width: containerSize, height: containerSize }}>
        {/* Outer fast spinning ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: 'var(--accent, #f472b6)',
          borderBottomColor: 'var(--accent, #f472b6)',
          animation: 'premium-spin 1.1s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite'
        }} />

        {/* Inner reverse medium spinning ring */}
        <div style={{
          position: 'absolute',
          inset: innerRingInset,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderLeftColor: '#db2777',
          borderRightColor: '#db2777',
          opacity: 0.85,
          animation: 'premium-spin-reverse 1.1s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite'
        }} />

        {/* Central pulsing core */}
        <div style={{
          position: 'absolute',
          inset: coreInset,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent, #f472b6) 0%, rgba(244,114,182,0.3) 100%)',
          boxShadow: '0 0 15px var(--accent, #f472b6)',
          animation: 'premium-pulse 1.8s ease-in-out infinite'
        }} />
      </div>

      {text && (
        <p style={{
          margin: 0,
          color: 'var(--text-muted, #cbd5e1)',
          fontFamily: "'Outfit', sans-serif",
          fontSize: labelSize,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textAlign: 'center',
          animation: 'premium-pulse 1.8s ease-in-out infinite',
          textShadow: '0 0 8px rgba(244,114,182,0.2)'
        }}>
          {text}
        </p>
      )}

      {/* Embedded dynamic keyframes */}
      <style>{`
        @keyframes premium-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes premium-spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes premium-pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
