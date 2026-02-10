import React from 'react';
import { Palmtree, Waves } from 'lucide-react';

const Header = () => {
  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <Palmtree size={48} style={{ color: '#22c55e', opacity: 0.9 }} />
        <h1>
          <span style={{ color: 'var(--brand-red)' }}>Simple</span>{' '}
          <span style={{ color: 'white' }}>Tax</span>
          <span style={{ color: 'var(--brand-red)' }}>.</span>
        </h1>
        <Waves size={48} style={{ color: '#38bdf8', opacity: 0.9 }} />
      </div>
      <p className="subtitle">Calculate your contribution to the nation.</p>
    </header>
  );
};

export default Header;
