import React from 'react';

const TaxForm = ({
  method, setMethod,
  incomeDisplay, setIncomeDisplay,
  bonusDisplay, setBonusDisplay,
  status, setStatus
}) => {

  const handleNumberChange = (setter) => (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val === '') {
      setter('');
    } else {
      const num = parseInt(val, 10);
      setter(new Intl.NumberFormat('id-ID').format(num));
    }
  };

  return (
    <div className="card">
      {/* Method Switch */}
      <div className="switch-group">
        <button
          className={`switch-btn ${method === 'real' ? 'active' : ''}`}
          onClick={() => setMethod('real')}
        >
          True Cost
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(Annualized)</span>
        </button>
        <button
          className={`switch-btn ${method === 'ter' ? 'active' : ''}`}
          onClick={() => setMethod('ter')}
        >
          Payroll Slip
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(TER 2024)</span>
        </button>
        <button
          className={`switch-btn ${method === 'reverse' ? 'active' : ''}`}
          onClick={() => setMethod('reverse')}
        >
          Reverse
          <span style={{ display: 'block', fontSize: '0.7em', opacity: 0.8 }}>(Tax → Income)</span>
        </button>
      </div>

      <div id="calculator-form">
        <div className="form-group">
          <label>
            {method === 'reverse' ? 'Desired Monthly Tax Paid' : 'Monthly Gross Income'}
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

        {/* Bonus Input (Only for True Cost) */}
        {method === 'real' && (
          <div className="form-group" style={{ animation: 'fadeIn 0.5s' }}>
            <label>Yearly Bonus / THR (Optional)</label>
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
        )}

        <div className="options-grid">
          <div className="form-group">
            <label>Marital Status</label>
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
