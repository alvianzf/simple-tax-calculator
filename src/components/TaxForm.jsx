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
    real: "You know your Gross Salary, and want to know how much Tax (PPh 21) will be cut and what your Net Salary is.",
    netToGross: "You know your Net Salary (Take Home Pay), and want to know what your Gross Salary implies and how much Tax is paid.",
    taxToGross: "You see a specific Tax amount on your slip, and want to reverse-calculate what Gross Salary generates that tax."
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
          Gross → Net
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(True Cost)</span>
          {showHelp === 'real' && (
            <div className="tooltip-popup" style={{
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
          className={`switch-btn ${method === 'netToGross' ? 'active' : ''}`}
          onClick={() => setMethod('netToGross')}
          onMouseEnter={() => setShowHelp('netToGross')}
          onMouseLeave={() => setShowHelp(null)}
          style={{ position: 'relative' }}
        >
          <TrendingUp size={16} style={{ display: 'inline', marginRight: '4px' }} />
          Net → Gross
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(Real Burden)</span>
          {showHelp === 'netToGross' && (
            <div className="tooltip-popup" style={{
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
              {helpTexts.netToGross}
            </div>
          )}
        </button>
        <button
          className={`switch-btn ${method === 'taxToGross' ? 'active' : ''}`}
          onClick={() => setMethod('taxToGross')}
          onMouseEnter={() => setShowHelp('taxToGross')}
          onMouseLeave={() => setShowHelp(null)}
          style={{ position: 'relative' }}
        >
          <ArrowLeftRight size={16} style={{ display: 'inline', marginRight: '4px' }} />
          Tax → Gross
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(Reverse Inc)</span>
          {showHelp === 'taxToGross' && (
            <div className="tooltip-popup" style={{
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
              {helpTexts.taxToGross}
            </div>
          )}
        </button>
      </div>

      <div id="calculator-form">
        <div className="form-group">
          <label>
            <Wallet size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            {method === 'taxToGross' ? 'Monthly Tax Paid' :
              method === 'netToGross' ? 'Monthly Net Salary (Take Home Pay)' :
                'Monthly Gross Salary'}
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

        {/* THR and Bonus Inputs (Real & Net -> Gross) */}
        {(method === 'real' || method === 'netToGross') && (
          <>
            <div className="form-group" style={{ animation: 'fadeIn 0.5s' }}>
              <label>
                <Gift size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                {method === 'netToGross' ? 'Net THR (Take Home)' : 'THR (Tunjangan Hari Raya)'}
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
                {method === 'netToGross' ? 'Net Bonus (Take Home)' : 'Yearly Bonus (Optional)'}
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
