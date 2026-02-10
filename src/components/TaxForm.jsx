import React from 'react';

const TaxForm = ({
  mode, setMode,
  incomeDisplay, setIncomeDisplay,
  status, setStatus
}) => {

  const handleIncomeChange = (e) => {
    // Remove non-digits
    let val = e.target.value.replace(/\D/g, '');
    if (val === '') {
      setIncomeDisplay('');
    } else {
      // Store as formatted string in display
      const num = parseInt(val, 10);
      setIncomeDisplay(new Intl.NumberFormat('id-ID').format(num));
    }
  };

  return (
    <div className="card">
      {/* Calculation Mode Switch */}
      <div className="switch-group">
        <button
          className={`switch-btn ${mode === 'monthly' ? 'active' : ''}`}
          onClick={() => setMode('monthly')}
        >
          Monthly Gross
        </button>
        <button
          className={`switch-btn ${mode === 'net-gross' ? 'active' : ''}`}
          onClick={() => setMode('net-gross')}
        >
          Net to Gross
        </button>
        <button
          className={`switch-btn ${mode === 'tax-gross' ? 'active' : ''}`}
          onClick={() => setMode('tax-gross')}
        >
          Tax to Gross
        </button>
      </div>

      <div id="calculator-form">
        <div className="form-group">
          <label>
            {mode === 'monthly' && 'Monthly Gross Income'}
            {mode === 'net-gross' && 'Desired Monthly Net Income'}
            {mode === 'tax-gross' && 'Monthly Tax Amount'}
          </label>
          <div className="input-wrapper">
            <span className="currency-symbol">Rp</span>
            <input
              type="text"
              placeholder="0"
              value={incomeDisplay}
              onChange={handleIncomeChange}
              autoComplete="off"
            />
          </div>
        </div>

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
