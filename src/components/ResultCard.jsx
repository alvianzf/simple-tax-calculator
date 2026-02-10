import React, { useState } from 'react';
import { getSarcasticComment, formatCurrency } from '../utils/calculator';

const ResultCard = ({ result, mode }) => {
  if (!result) return null;
  const [showDetails, setShowDetails] = useState(false);

  let monthly = 0;
  let annual = 0;
  let rate = 0;

  if (mode === 'real') {
    monthly = result.taxMonthly;
    annual = result.taxAnnual;
    rate = result.rateEffective;
  } else {
    monthly = result.tax;
    annual = result.tax * 12;
    rate = result.rate;
  }

  const sarcasticComment = getSarcasticComment(monthly);

  return (
    <div className="result-section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Monthly
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(monthly)}
          </div>
        </div>
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Annual
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(annual)}
          </div>
        </div>
      </div>

      <div className="result-rate">
        Effective Rate: {(rate * 100).toFixed(2)}%
      </div>

      <div className="sarcastic-box">
        <p>"{sarcasticComment}"</p>
      </div>

      {/* Detailed Breakdown (Only for True Cost mode) */}
      {mode === 'real' && result.layers && (
        <div style={{ marginTop: '2rem', textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'none', border: 'none', color: 'var(--brand-red)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            {showDetails ? 'Choose Ignorance (Hide Details)' : 'How did we get here? (Show Details)'}
          </button>

          {showDetails && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Annual Gross</span>
                <span>{formatCurrency(result.annualGross)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>- PTKP (Tax Free)</span>
                <span style={{ color: '#22c55e' }}>({formatCurrency(result.ptkp)})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Taxable Income (PKP)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(result.pkp)}</span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                {result.layers.map((layer, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Tier {index + 1} ({(layer.rate * 100)}% x {formatCurrency(layer.amount)})</span>
                    <span style={{ color: 'var(--brand-red)' }}>{formatCurrency(layer.tax)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total Annual Tax</span>
                <span style={{ fontWeight: 600, color: 'var(--brand-red)' }}>{formatCurrency(annual)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span>÷ 12 Months</span>
                <span>{formatCurrency(monthly)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultCard;
