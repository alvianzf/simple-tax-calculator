import { useState, useEffect } from 'react'
import Header from './components/Header'
import TaxForm from './components/TaxForm'
import ResultCard from './components/ResultCard'
import Footer from './components/Footer'
import { calculateRealMonthlyTax, calculateTER, calculateGrossFromNet, calculateGrossFromAnnualTax } from './utils/calculator'
import './App.css'

function App() {
  const [method, setMethod] = useState('real') // 'real', 'ter', 'reverse'
  const [status, setStatus] = useState('TK/0')
  const [incomeDisplay, setIncomeDisplay] = useState('')
  const [thrDisplay, setThrDisplay] = useState('') // THR State
  const [bonusDisplay, setBonusDisplay] = useState('') // Bonus State
  const [result, setResult] = useState(null)

  useEffect(() => {
    // 1. Parse Inputs
    const inputValue = parseInt(incomeDisplay.replace(/\./g, '') || '0', 10)
    const thrValue = parseInt(thrDisplay.replace(/\./g, '') || '0', 10)
    const bonusValue = parseInt(bonusDisplay.replace(/\./g, '') || '0', 10)
    const totalBonus = thrValue + bonusValue

    if (inputValue === 0 && method !== 'reverse') {
      setResult(null)
      return
    }

    // 2. Calculate based on Method
    let res = null

    if (method === 'real') {
      // Input: Monthly Gross + Total Bonus (THR + Yearly Bonus)
      res = calculateRealMonthlyTax(inputValue, status, totalBonus)
      res.mode = 'real'
    } else if (method === 'netToGross') {
      // Input: Monthly NET Salary
      // Calculate gross from net using Real Tax Burden (Iterative)
      res = calculateGrossFromNet(inputValue, status)
      res.mode = 'netToGross'
    } else if (method === 'taxToGross') {
      // Input: Monthly Tax
      if (inputValue > 0) {
        const annualTax = inputValue * 12
        res = calculateGrossFromAnnualTax(annualTax, status)
        res.mode = 'taxToGross'
      }
    }

    // 3. Update Result
    setResult(res)

  }, [incomeDisplay, thrDisplay, bonusDisplay, status, method])

  return (
    <div className="container">
      <Header />
      <TaxForm
        method={method}
        setMethod={setMethod}
        incomeDisplay={incomeDisplay}
        setIncomeDisplay={setIncomeDisplay}
        thrDisplay={thrDisplay}
        setThrDisplay={setThrDisplay}
        bonusDisplay={bonusDisplay}
        setBonusDisplay={setBonusDisplay}
        status={status}
        setStatus={setStatus}
      />

      <ResultCard
        result={result}
        mode={method}
        inputVal={parseInt(incomeDisplay.replace(/\./g, '') || '0', 10)}
        thrInput={parseInt(thrDisplay.replace(/\./g, '') || '0', 10)}
        bonusInput={parseInt(bonusDisplay.replace(/\./g, '') || '0', 10)}
      />

      <Footer />
    </div>
  )
}

export default App
