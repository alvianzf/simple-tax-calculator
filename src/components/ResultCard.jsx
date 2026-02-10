import React from 'react';
import { getSarcasticComment, formatCurrency } from '../utils/calculator';

const ResultCard = ({ result, mode }) => {
  if (!result) return null;

  // We assume 'result' now contains { taxMonthly, taxAnnual, rateEffective } for 'real' mode
  // or { tax, rate } for 'ter' mode. 
  // Adapting to handle both or primarily 'real' based on latest reqs.
  // Let's assume the App always passes the primary 'tax' to be displayed as main number.

  // Safe destructuring
  const mainTax = result.taxMonthly !== undefined ? result.taxMonthly : result.tax;
  const rate = result.rateEffective !== undefined ? result.rateEffective : result.rate;

  const sarcasticComment = getSarcasticComment(mainTax);

  return (
    <div className="result-section">
      <div className="result-label">
        {mode === 'ter' ? 'Monthly Deduction (TER)' : 'Real Monthly Cost (Avg)'}
      </div>

      <div className="result-amount">{formatCurrency(mainTax)}</div>

      <div className="result-rate">
        Effective Rate: {(rate * 100).toFixed(2)}%
      </div>

      {result.taxAnnual !== undefined && (
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Annual Burden: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(result.taxAnnual)}</span>
        </div>
      )}

      <div className="sarcastic-box">
        <p>"{sarcasticComment}"</p>
      </div>
    </div>
  );
};

export default ResultCard;
