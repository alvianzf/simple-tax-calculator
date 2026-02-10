import React from 'react';
import { Palmtree, Waves } from 'lucide-react';

const Header = () => {
  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <div className="header-icons" style={{ display: 'flex', alignItems: 'flex-end', gap: '0' }}>
          <Palmtree size={40} style={{ color: '#22c55e', opacity: 0.9 }} />
          <Palmtree size={120} style={{ color: '#22c55e', opacity: 0.9 }} />
          <Palmtree size={48} style={{ color: '#22c55e', opacity: 0.9 }} />
        </div>
        <h1>
          <span style={{ color: 'var(--brand-red)' }}>Simple</span>{' '}
          <span style={{ color: 'white' }}>Tax</span>
          <span style={{ color: 'var(--brand-red)' }}>.</span>
        </h1>
        <div className="header-icons" style={{ display: 'flex', alignItems: 'flex-end', gap: '0' }}>
          <Waves size={36} style={{ color: '#38bdf8', opacity: 0.9 }} />
          <Waves size={48} style={{ color: '#38bdf8', opacity: 0.9 }} />
          <Waves size={40} style={{ color: '#38bdf8', opacity: 0.9 }} />
        </div>
      </div>
      <p className="subtitle">Calculate your contribution to the nation.</p>
    </header>
  );
};

export default Header;
