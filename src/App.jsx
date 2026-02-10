import { useState, useEffect } from 'react'
import Header from './components/Header'
import TaxForm from './components/TaxForm'
import ResultCard from './components/ResultCard'
import { calculateMonthlyTax, calculateGrossUp, calculateIncomeFromTax } from './utils/calculator'
import './App.css'

function App() {
  const [mode, setMode] = useState('monthly') // 'monthly', 'net-gross', 'tax-gross'
  const [status, setStatus] = useState('TK/0')
  const [incomeDisplay, setIncomeDisplay] = useState('')
  const [result, setResult] = useState(null)
  const [gross, setGross] = useState(0)

  useEffect(() => {
    // 1. Parse Income
    const incomeValue = parseInt(incomeDisplay.replace(/\./g, '') || '0', 10)

    if (incomeValue === 0) {
      setResult(null)
      return
    }

    // 2. Calculate based on mode
    let res = { tax: 0, rate: 0 }
    let calculatedGross = incomeValue

    if (mode === 'monthly') {
      res = calculateMonthlyTax(incomeValue, status)
      calculatedGross = incomeValue
    } else if (mode === 'net-gross') {
      const grossUp = calculateGrossUp(incomeValue, status)
      res = { tax: grossUp.tax, rate: grossUp.rate }
      calculatedGross = grossUp.gross
    } else if (mode === 'tax-gross') {
      const taxToGross = calculateIncomeFromTax(incomeValue, status)
      res = { tax: taxToGross.tax, rate: taxToGross.rate }
      calculatedGross = taxToGross.gross
    }

    // 3. Update Result State
    setResult(res)
    setGross(calculatedGross)

  }, [incomeDisplay, status, mode])

  // Reset input when mode changes (optional, but cleaner)
  useEffect(() => {
    setIncomeDisplay('')
    setResult(null)
  }, [mode])

  return (
    <div className="container">
      <Header />
      <TaxForm
        mode={mode}
        setMode={setMode}
        incomeDisplay={incomeDisplay}
        setIncomeDisplay={setIncomeDisplay}
        status={status}
        setStatus={setStatus}
      />

      <ResultCard
        result={result}
        mode={mode}
        gross={gross}
        incomeValue={parseInt(incomeDisplay.replace(/\./g, '') || '0', 10)}
      />
    </div>
  )
}

export default App
