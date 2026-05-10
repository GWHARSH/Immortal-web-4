export default function PremiumLoader({ text = 'Loading', size = 'md' }) {
  const scale = size === 'sm' ? 0.65 : size === 'lg' ? 1.4 : 1;
  return (
    <div className="orbital-wrap" style={{ '--orbital-scale': scale }}>
      <div className="orbital">
        {/* Central glowing core */}
        <div className="orbital__core" />

        {/* Ring 1 — hot pink, fast, tilted on X */}
        <div className="orbital__ring orbital__ring--1">
          <div className="orbital__track" />
          <div className="orbital__dot orbital__dot--1" />
        </div>

        {/* Ring 2 — magenta, medium, tilted on Y */}
        <div className="orbital__ring orbital__ring--2">
          <div className="orbital__track orbital__track--2" />
          <div className="orbital__dot orbital__dot--2" />
        </div>

        {/* Ring 3 — light pink, slower, diagonal */}
        <div className="orbital__ring orbital__ring--3">
          <div className="orbital__track orbital__track--3" />
          <div className="orbital__dot orbital__dot--3" />
        </div>
      </div>

      {text && <p className="orbital__label">{text}</p>}
    </div>
  );
}
