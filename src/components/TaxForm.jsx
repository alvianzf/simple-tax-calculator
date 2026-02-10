import React, { useState } from 'react';
import { Calculator, TrendingUp, ArrowLeftRight, Wallet, Gift, Users, HelpCircle } from 'lucide-react';

const TaxForm = ({
  method, setMethod,
  incomeDisplay, setIncomeDisplay,
  thrDisplay, setThrDisplay,
  bonusDisplay, setBonusDisplay,
  status, setStatus
}) => {
  const [showHelp, setShowHelp] = useState(null);

  const handleNumberChange = (setter) => (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val === '') {
      setter('');
    } else {
      const num = parseInt(val, 10);
      setter(new Intl.NumberFormat('id-ID').format(num));
    }
  };

  const helpTexts = {
    real: "Calculates actual annual tax burden (PPh 21 Pasal 17) averaged over 12 months. Most accurate for understanding your real tax cost. Includes THR and bonus in annual calculation.",
    ter: "Reverse-calculates from your NET income (take-home pay) using TER 2024 tables to show gross income and tax withheld. Useful for understanding what your payslip means.",
    reverse: "Input your desired monthly tax amount to find out what gross income would result in that tax. Useful for tax planning and salary negotiations."
  };

  return (
    <div className="card">
      {/* Method Switch */}
      <div className="switch-group">
        <button
          className={`switch-btn ${method === 'real' ? 'active' : ''}`}
          onClick={() => setMethod('real')}
          onMouseEnter={() => setShowHelp('real')}
          onMouseLeave={() => setShowHelp(null)}
          style={{ position: 'relative' }}
        >
          <Calculator size={16} style={{ display: 'inline', marginRight: '4px' }} />
          True Cost
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(Annualized)</span>
          {showHelp === 'real' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              width: '250px',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              textAlign: 'left',
              lineHeight: '1.4'
            }}>
              {helpTexts.real}
            </div>
          )}
        </button>
        <button
          className={`switch-btn ${method === 'ter' ? 'active' : ''}`}
          onClick={() => setMethod('ter')}
          onMouseEnter={() => setShowHelp('ter')}
          onMouseLeave={() => setShowHelp(null)}
          style={{ position: 'relative' }}
        >
          <TrendingUp size={16} style={{ display: 'inline', marginRight: '4px' }} />
          Payroll Slip
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(TER 2024)</span>
          {showHelp === 'ter' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              width: '250px',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              textAlign: 'left',
              lineHeight: '1.4'
            }}>
              {helpTexts.ter}
            </div>
          )}
        </button>
        <button
          className={`switch-btn ${method === 'reverse' ? 'active' : ''}`}
          onClick={() => setMethod('reverse')}
          onMouseEnter={() => setShowHelp('reverse')}
          onMouseLeave={() => setShowHelp(null)}
          style={{ position: 'relative' }}
        >
          <ArrowLeftRight size={16} style={{ display: 'inline', marginRight: '4px' }} />
          Reverse
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(Tax → Income)</span>
          {showHelp === 'reverse' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              width: '250px',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              textAlign: 'left',
              lineHeight: '1.4'
            }}>
              {helpTexts.reverse}
            </div>
          )}
        </button>
      </div>

      <div id="calculator-form">
        <div className="form-group">
          <label>
            <Wallet size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            {method === 'reverse' ? 'Desired Monthly Tax Paid' :
              method === 'ter' ? 'Monthly NET Income (Take-Home)' :
                'Monthly Gross Income'}
          </label>
          <div className="input-wrapper">
            <span className="currency-symbol">Rp</span>
            <input
              type="text"
              placeholder="0"
              value={incomeDisplay}
              onChange={handleNumberChange(setIncomeDisplay)}
              autoComplete="off"
            />
          </div>
        </div>

        {/* THR and Bonus Inputs (Only for True Cost and TER) */}
        {(method === 'real' || method === 'ter') && (
          <>
            <div className="form-group" style={{ animation: 'fadeIn 0.5s' }}>
              <label>
                <Gift size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                THR (Tunjangan Hari Raya)
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">Rp</span>
                <input
                  type="text"
                  placeholder="0"
                  value={thrDisplay}
                  onChange={handleNumberChange(setThrDisplay)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="form-group" style={{ animation: 'fadeIn 0.5s' }}>
              <label>
                <Gift size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Yearly Bonus (Optional)
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">Rp</span>
                <input
                  type="text"
                  placeholder="0"
                  value={bonusDisplay}
                  onChange={handleNumberChange(setBonusDisplay)}
                  autoComplete="off"
                />
              </div>
            </div>
          </>
        )}

        <div className="options-grid">
          <div className="form-group">
            <label>
              <Users size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Marital Status
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="TK/0">TK/0 (Single, 0 Dep)</option>
              <option value="TK/1">TK/1 (Single, 1 Dep)</option>
              <option value="TK/2">TK/2 (Single, 2 Dep)</option>
              <option value="TK/3">TK/3 (Single, 3 Dep)</option>
              <option value="K/0">K/0 (Married, 0 Dep)</option>
              <option value="K/1">K/1 (Married, 1 Dep)</option>
              <option value="K/2">K/2 (Married, 2 Dep)</option>
              <option value="K/3">K/3 (Married, 3 Dep)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxForm;
