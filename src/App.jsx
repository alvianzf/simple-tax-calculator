import { useState, useEffect } from 'react'
import Header from './components/Header'
import TaxForm from './components/TaxForm'
import ResultCard from './components/ResultCard'
import { calculateRealMonthlyTax, calculateTER } from './utils/calculator'
import './App.css'

function App() {
  const [method, setMethod] = useState('real') // 'real' (True Cost) vs 'ter' (Payroll)
  const [status, setStatus] = useState('TK/0')
  const [incomeDisplay, setIncomeDisplay] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    // 1. Parse Income
    const incomeValue = parseInt(incomeDisplay.replace(/\./g, '') || '0', 10)

    if (incomeValue === 0) {
      setResult(null)
      return
    }

    // 2. Calculate based on Method
    let res = null

    if (method === 'real') {
      res = calculateRealMonthlyTax(incomeValue, status)
    } else {
      res = calculateTER(incomeValue, status)
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
      />
    </div>
  )
}

export default App
