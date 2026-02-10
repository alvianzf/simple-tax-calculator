import React from 'react';
import { getSarcasticComment, formatCurrency } from '../utils/calculator';

const ResultCard = ({ result, mode, gross, incomeValue }) => {
  if (!result || incomeValue === 0) return null;

  const { tax, rate } = result;
  const sarcasticComment = getSarcasticComment(tax);

  return (
    <div className="result-section">
      <div className="result-label">Estimated PPh 21 Tax</div>
      <div className="result-amount">{formatCurrency(tax)}</div>
      <div className="result-rate">Rate: {(rate * 100).toFixed(2)}%</div>

      <div className="sarcastic-box">
        <p>"{sarcasticComment}"</p>
      </div>

      {/* Extra details for Reverse modes */}
      {(mode === 'net-gross' || mode === 'tax-gross') && (
        <div style={{ display: 'none', marginTop: '1rem', textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {mode === 'net-gross' ? 'Target Net:' : 'Target Tax:'}
            </span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {formatCurrency(incomeValue)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Required Gross:</span>
            <span style={{ color: 'var(--brand-red)', fontWeight: 600 }}>
              {formatCurrency(gross)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
