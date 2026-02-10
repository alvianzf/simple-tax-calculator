import React from 'react';
import { Palmtree } from 'lucide-react';

const Header = () => {
  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <Palmtree size={48} style={{ color: 'var(--brand-red)', opacity: 0.8 }} />
        <h1>Simple Tax<span>.</span></h1>
        <Palmtree size={48} style={{ color: 'var(--brand-red)', opacity: 0.8 }} />
      </div>
      <p className="subtitle">Calculate your contribution to the nation (sadly).</p>
    </header>
  );
};

export default Header;
