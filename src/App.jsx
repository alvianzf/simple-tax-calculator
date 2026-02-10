import { useState, useEffect } from 'react'
import Header from './components/Header'
import TaxForm from './components/TaxForm'
import ResultCard from './components/ResultCard'
import { calculateRealMonthlyTax, calculateTER, calculateGrossFromAnnualTax } from './utils/calculator'
import './App.css'

function App() {
  const [method, setMethod] = useState('real') // 'real', 'ter', 'reverse'
  const [status, setStatus] = useState('TK/0')
  const [incomeDisplay, setIncomeDisplay] = useState('')
  const [bonusDisplay, setBonusDisplay] = useState('') // New State
  const [result, setResult] = useState(null)

  useEffect(() => {
    // 1. Parse Inputs
    const inputValue = parseInt(incomeDisplay.replace(/\./g, '') || '0', 10)
    const bonusValue = parseInt(bonusDisplay.replace(/\./g, '') || '0', 10)

    if (inputValue === 0 && method !== 'reverse') { // Reverse can try to calc for 0 but usually needs input
      setResult(null)
      return
    }

    // 2. Calculate based on Method
    let res = null

    if (method === 'real') {
      // Input: Monthly Gross + Bonus
      res = calculateRealMonthlyTax(inputValue, status, bonusValue)
    } else if (method === 'ter') {
      // Input: Monthly Gross (TER ignores annual bonus for monthly withholding usually, or treats it per Masa Pajak)
      // For simplicity we just calc TER on the monthly part
      res = calculateTER(inputValue, status)
    } else if (method === 'reverse') {
      // Input: Desired Monthly Tax
      if (inputValue > 0) {
        const annualTax = inputValue * 12
        res = calculateGrossFromAnnualTax(annualTax, status)
      }
    }

    // 3. Update Result
    setResult(res)

  }, [incomeDisplay, bonusDisplay, status, method])

  return (
    <div className="container">
      <Header />
      <TaxForm
        method={method}
        setMethod={setMethod}
        incomeDisplay={incomeDisplay}
        setIncomeDisplay={setIncomeDisplay}
        bonusDisplay={bonusDisplay}
        setBonusDisplay={setBonusDisplay}
        status={status}
        setStatus={setStatus}
      />

      <ResultCard
        result={result}
        mode={method}
        inputTax={parseInt(incomeDisplay.replace(/\./g, '') || '0', 10)}
      />
    </div>
  )
}

export default App
