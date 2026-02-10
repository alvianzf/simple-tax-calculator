import React, { useState } from 'react';
import { getSarcasticComment, formatCurrency } from '../utils/calculator';

const ResultCard = ({ result, mode, inputTax }) => {
  if (!result) return null;
  const [showDetails, setShowDetails] = useState(false);

  let monthly = 0;
  let annual = 0;
  let rate = 0;
  let isReverse = mode === 'reverse';

  if (mode === 'real') {
    monthly = result.taxMonthly;
    annual = result.taxAnnual;
    rate = result.rateEffective;
  } else if (mode === 'ter') {
    monthly = result.tax;
    annual = result.tax * 12;
    rate = result.rate;
  } else if (mode === 'reverse') {
    monthly = result.monthlyGross;
    annual = result.annualGross;
    rate = (inputTax * 12) / result.annualGross;
  }

  // Determine tax amount for sarcasm
  const taxForSarcasm = isReverse ? inputTax : monthly;
  const sarcasticComment = getSarcasticComment(taxForSarcasm);

  // Can we show breakdown?
  // 'real' mode has layers. 'reverse' mode now has layers too.
  const hasLayers = result.layers && result.layers.length > 0;

  return (
    <div className="result-section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            {isReverse ? 'Required Monthly Gross' : 'Monthly Tax'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(monthly)}
          </div>
        </div>
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            {isReverse ? 'Required Annual Gross' : 'Annual Tax'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(annual)}
          </div>
        </div>
      </div>

      {isReverse && (
        <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          To pay <span style={{ color: 'var(--brand-red)', fontWeight: 600 }}>{formatCurrency(inputTax)}</span> tax/month
        </div>
      )}

      <div className="result-rate">
        Effective Rate: {(rate * 100 || 0).toFixed(2)}%
      </div>

      <div className="sarcastic-box">
        <p>"{sarcasticComment}"</p>
      </div>

      {hasLayers && (
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
                <span>Annual Gross (Total)</span>
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

              {/* Total Summary */}
              {!isReverse && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total Annual Tax</span>
                    <span style={{ fontWeight: 600, color: 'var(--brand-red)' }}>{formatCurrency(result.taxAnnual)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span>÷ 12 Months</span>
                    <span>{formatCurrency(result.taxMonthly)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultCard;
