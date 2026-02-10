import React from 'react';
import { getSarcasticComment, formatCurrency } from '../utils/calculator';

const ResultCard = ({ result, mode }) => {
  if (!result) return null;

  // Determine values to display
  // For 'real' mode: taxMonthly, taxAnnual
  // For 'ter' mode: tax (monthly), and we imply annual = tax * 12 for display purposes (or just hide it if strictly monthly)

  let monthly = 0;
  let annual = 0;
  let rate = 0;

  if (mode === 'real') {
    monthly = result.taxMonthly;
    annual = result.taxAnnual;
    rate = result.rateEffective;
  } else {
    // TER Mode
    monthly = result.tax;
    annual = result.tax * 12; // Estimation for display
    rate = result.rate;
  }

  const sarcasticComment = getSarcasticComment(monthly);

  return (
    <div className="result-section">

      {/* Dual Display Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* Monthly Box */}
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Monthly
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(monthly)}
          </div>
        </div>

        {/* Annual Box */}
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Annual
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(annual)}
          </div>
        </div>

      </div>

      {/* Effective Rate Pill */}
      <div className="result-rate">
        Effective Rate: {(rate * 100).toFixed(2)}%
      </div>

      {/* Sarcastic Comment */}
      <div className="sarcastic-box">
        <p>"{sarcasticComment}"</p>
      </div>
    </div>
  );
};

export default ResultCard;
