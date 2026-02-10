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
  const [result, setResult] = useState(null)

  useEffect(() => {
    // 1. Parse Input
    const inputValue = parseInt(incomeDisplay.replace(/\./g, '') || '0', 10)

    if (inputValue === 0) {
      setResult(null)
      return
    }

    // 2. Calculate based on Method
    let res = null

    if (method === 'real') {
      // Input is Monthly Gross
      res = calculateRealMonthlyTax(inputValue, status)
    } else if (method === 'ter') {
      // Input is Monthly Gross
      res = calculateTER(inputValue, status)
    } else if (method === 'reverse') {
      // Input is Desired Monthly Tax
      // Convert to Annual Tax first
      const annualTax = inputValue * 12
      res = calculateGrossFromAnnualTax(annualTax, status)
    }

    // 3. Update Result
    setResult(res)

  }, [incomeDisplay, status, method])

  return (
    <div className="container">
      <Header />
      <TaxForm
        method={method}
        setMethod={setMethod}
        incomeDisplay={incomeDisplay}
        setIncomeDisplay={setIncomeDisplay}
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
