import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: '1px solid var(--border-color)',
      textAlign: 'center',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div style={{ marginBottom: '0.5rem' }}>
        Made with 💸 by <a
          href="https://alvianzf.id"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--brand-red)', textDecoration: 'none', fontWeight: 600 }}
        >
          Alvian Zachry Faturrahman
        </a>
      </div>
      <div>
        <a
          href="https://github.com/alvianzf/simple-tax-calculator"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--brand-red)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          <Github size={16} />
          View on GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
