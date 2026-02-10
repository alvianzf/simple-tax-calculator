import React, { useState } from 'react';
import { getSarcasticComment, formatCurrency } from '../utils/calculator';
import { NO_THR_NO_BONUS_COMMENTS, NO_BONUS_COMMENTS, NO_THR_COMMENTS } from '../utils/tax-data';
import { ChevronDown, ChevronUp, Calendar, Percent } from 'lucide-react';

const ResultCard = ({ result, mode, inputTax, thrInput = 0, bonusInput = 0 }) => {
  if (!result) return null;
  const [showDetails, setShowDetails] = useState(false);

  let monthly = 0;
  let annual = 0;
  let rate = 0;
  let isReverse = mode === 'reverse';
  let isTER = mode === 'ter';

  if (mode === 'real') {
    monthly = result.taxMonthly;
    annual = result.taxAnnual;
    rate = result.rateEffective;
  } else if (mode === 'ter') {
    // TER mode shows gross income (not tax)
    monthly = result.grossMonthly;
    annual = result.grossMonthly * 12;
    rate = result.rate;
  } else if (mode === 'reverse') {
    monthly = result.monthlyGross;
    annual = result.annualGross;
    rate = (inputTax * 12) / result.annualGross;
  }

  const taxForSarcasm = isTER ? result.tax : (isReverse ? inputTax : monthly);
  const sarcasticComment = getSarcasticComment(taxForSarcasm);

  const hasLayers = result.layers && result.layers.length > 0;

  // Visual Comparison Logic — brackets match sarcastic comment thresholds
  const COMPARISONS = [
    { max: 0, items: [{ item: "Absolutely Nothing", icon: "🎉", desc: "The government doesn't even want your money.", isZero: true }], color: "#22c55e" },
    {
      max: 50000, items: [
        { item: "10 Packs of Indomie", icon: "🍜", desc: "Gourmet student dining for a week." },
        { item: "A Grab Ride Across Town", icon: "🛵", desc: "One way. No return. Just like your money." }
      ], color: "#a3e635"
    },
    {
      max: 150000, items: [
        { item: "A Fancy Nasi Padang Lunch", icon: "🍛", desc: "Extra rendang, extra sambal, extra pain." },
        { item: "3 Boba Drinks", icon: "🧋", desc: "Large, extra pearls, no sweetness left in life." }
      ], color: "#84cc16"
    },
    {
      max: 300000, items: [
        { item: "A Month of Spotify Premium", icon: "🎵", desc: "Soundtrack for your financial sorrow." },
        { item: "10 Liters of Pertamax", icon: "⛽", desc: "Enough to drive to the tax office and cry." }
      ], color: "#facc15"
    },
    {
      max: 500000, items: [
        { item: "50 Cups of Instant Coffee", icon: "☕", desc: "Caffeine addiction, fully funded." },
        { item: "A Decent Pair of Sneakers", icon: "👟", desc: "For running away from your tax obligations." }
      ], color: "#fbbf24"
    },
    {
      max: 1000000, items: [
        { item: "1 Year of Netflix Premium", icon: "🎬", desc: "Binge-watching taken away from you." },
        { item: "A Nice Dinner for Two", icon: "🍽️", desc: "Romantic evening, funded by the state now." }
      ], color: "#fb923c"
    },
    {
      max: 2000000, items: [
        { item: "Monthly Gym Membership", icon: "💪", desc: "Getting ripped while your wallet gets stripped." },
        { item: "A Weekend Getaway to Bandung", icon: "🏔️", desc: "Fresh air, fresh tears." }
      ], color: "#f97316"
    },
    {
      max: 3500000, items: [
        { item: "A Budget Tablet", icon: "📱", desc: "A decent Android, gone every month." },
        { item: "3 Months of Coworking Space", icon: "💻", desc: "Working hard so the government doesn't have to." }
      ], color: "#ef4444"
    },
    {
      max: 5000000, items: [
        { item: "A Mid-Range Smartphone", icon: "📱", desc: "Flagship dreams, budget reality." },
        { item: "A Round-Trip Flight to Bali", icon: "✈️", desc: "Vacation mode: cancelled by taxation." }
      ], color: "#e50914"
    },
    {
      max: 7500000, items: [
        { item: "A Gaming Console", icon: "🎮", desc: "Game over for your savings." },
        { item: "A Home Appliance Set", icon: "🏠", desc: "Washing machine AND dryer. Gone." }
      ], color: "#dc2626"
    },
    {
      max: 10000000, items: [
        { item: "A Designer Handbag", icon: "👜", desc: "Fashion week? No, tax week." },
        { item: "A Premium Watch", icon: "⌚", desc: "Time is money. You just ran out of both." }
      ], color: "#ec4899"
    },
    {
      max: 15000000, items: [
        { item: "A High-End Laptop", icon: "💻", desc: "MacBook money, Chromebook life." },
        { item: "A Semester of Private Uni", icon: "🎓", desc: "Education: priceless. Your tax: very priced." }
      ], color: "#a855f7"
    },
    {
      max: 25000000, items: [
        { item: "A New iPhone", icon: "📱", desc: "Pro Max Ultra money. Gone Ultra Fast." },
        { item: "A Used Motor Gede", icon: "🏍️", desc: "Big bike energy, empty wallet vibes." }
      ], color: "#8b5cf6"
    },
    {
      max: 40000000, items: [
        { item: "A Down Payment on a House", icon: "🏡", desc: "Homeownership dreams, government funded." },
        { item: "A Business Class Flight to Tokyo", icon: "✈️", desc: "First class tax, economy class life." }
      ], color: "#6366f1"
    },
    {
      max: 60000000, items: [
        { item: "A Used Japanese Car", icon: "🚗", desc: "Vroom vroom... straight to the treasury." },
        { item: "A Full Home Renovation", icon: "🔨", desc: "New kitchen, new bathroom. For someone else." }
      ], color: "#64748b"
    },
    {
      max: Infinity, items: [
        { item: "A Brand New Car", icon: "🚙", desc: "Off the showroom, into the government." },
        { item: "A Year of Luxury Living", icon: "🏰", desc: "Castle vibes. Tax bill reality." }
      ], color: "#475569"
    }
  ];

  const getComparison = (taxAmount) => {
    for (const bracket of COMPARISONS) {
      if (taxAmount <= bracket.max) {
        const pick = bracket.items[Math.floor(Math.random() * bracket.items.length)];
        return { ...pick, color: bracket.color };
      }
    }
    const last = COMPARISONS[COMPARISONS.length - 1];
    const pick = last.items[Math.floor(Math.random() * last.items.length)];
    return { ...pick, color: last.color };
  };

  const comparison = getComparison(taxForSarcasm);

  return (
    <div className="result-section">
      {comparison && (
        <div style={{
          marginBottom: '1.5rem',
          background: 'var(--bg-card)',
          borderRadius: '1rem',
          // overflow: 'hidden', // Removed to prevent clipping on mobile
          border: `1px solid ${comparison.color}33`,
          boxShadow: `0 0 20px ${comparison.color}15`,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${comparison.color}, ${comparison.color}cc)`,
            padding: '0.75rem',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.1rem',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem'
          }}>
            {comparison.isZero ? '🎊 Congratulations! 🎊' : 'You could afford these...'}
          </div>
          <div style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            background: `linear-gradient(180deg, ${comparison.color}08, var(--bg-input))`,
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem'
          }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1rem', lineHeight: 1 }}>{comparison.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              {comparison.item}
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "{comparison.desc}"
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: comparison.isZero ? '#22c55e' : 'var(--text-secondary)', opacity: 0.8, fontWeight: comparison.isZero ? 600 : 400 }}>
              {comparison.isZero ? 'Your wallet lives to fight another day.' : 'But you paid taxes instead.'}
            </div>
          </div>
        </div>
      )}

      {isTER ? (
        // TER Mode: Show Gross, Tax, Net breakdown
        <>
          <div className="result-grid-3" style={{ marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Required Gross
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatCurrency(result.grossMonthly)}
              </div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Tax Withheld
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-red)' }}>
                {formatCurrency(result.tax)}
              </div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Your Take-Home
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>
                {formatCurrency(result.netMonthly)}
              </div>
            </div>
          </div>
          {(result.thrGross > 0 || result.bonusGross > 0) && (
            <div style={{
              background: 'var(--bg-input)',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Irregular Income Breakdown
              </div>

              {result.thrGross > 0 && (
                <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border-color)' }}>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>THR (Tunjangan Hari Raya)</div>
                  <div className="breakdown-grid">
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Gross</div>
                      <div style={{ fontWeight: 600 }}>{formatCurrency(result.thrGross)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Tax</div>
                      <div style={{ fontWeight: 600, color: 'var(--brand-red)' }}>{formatCurrency(result.thrTax)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Take-Home</div>
                      <div style={{ fontWeight: 600, color: '#22c55e' }}>{formatCurrency(result.thrTakeHome)}</div>
                    </div>
                  </div>
                </div>
              )}

              {result.bonusGross > 0 && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Yearly Bonus</div>
                  <div className="breakdown-grid">
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Gross</div>
                      <div style={{ fontWeight: 600 }}>{formatCurrency(result.bonusGross)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Tax</div>
                      <div style={{ fontWeight: 600, color: 'var(--brand-red)' }}>{formatCurrency(result.bonusTax)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Take-Home</div>
                      <div style={{ fontWeight: 600, color: '#22c55e' }}>{formatCurrency(result.bonusTakeHome)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontWeight: 600, textAlign: 'center' }}>
                Total Annual Tax: {formatCurrency(result.totalAnnualTax)}
              </div>
            </div>
          )}
        </>
      ) : (
        // Real Cost and Reverse Mode: Show Monthly/Annual
        <>
          <div className="result-grid-2" style={{ marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                {isReverse ? 'Required Monthly Gross' : 'Monthly Tax'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatCurrency(monthly)}
              </div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                {isReverse ? 'Required Annual Gross' : 'Annual Tax'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatCurrency(annual)}
              </div>
            </div>
          </div>

          {isReverse && (
            <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              To pay <span style={{ color: 'var(--brand-red)', fontWeight: 600 }}>{formatCurrency(inputTax)}</span> tax/month
            </div>
          )}
        </>
      )}

      <div className="result-rate">
        <Percent size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
        Effective Rate: {(rate * 100 || 0).toFixed(2)}%
      </div>

      <div className="sarcastic-box">
        <p>"{sarcasticComment}"</p>
      </div>

      {/* No THR/Bonus remarks — works on all modes with THR/Bonus fields */}
      {mode !== 'reverse' && thrInput === 0 && bonusInput === 0 && (
        <div className="sarcastic-box" style={{ marginTop: '1rem', borderColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.05)' }}>
          <p style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
            💸 "{NO_THR_NO_BONUS_COMMENTS[Math.floor(Math.random() * NO_THR_NO_BONUS_COMMENTS.length)]}"
          </p>
        </div>
      )}

      {mode !== 'reverse' && thrInput > 0 && bonusInput === 0 && (
        <div className="sarcastic-box" style={{ marginTop: '1rem', borderColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.05)' }}>
          <p style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
            💸 "{NO_BONUS_COMMENTS[Math.floor(Math.random() * NO_BONUS_COMMENTS.length)]}"
          </p>
        </div>
      )}

      {mode !== 'reverse' && thrInput === 0 && bonusInput > 0 && (
        <div className="sarcastic-box" style={{ marginTop: '1rem', borderColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.05)' }}>
          <p style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
            💸 "{NO_THR_COMMENTS[Math.floor(Math.random() * NO_THR_COMMENTS.length)]}"
          </p>
        </div>
      )}
      {hasLayers && (
        <div style={{ marginTop: '2rem', textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'none', border: 'none', color: 'var(--brand-red)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showDetails ? 'Choose Ignorance (Hide Details)' : 'How did we get here? (Show Details)'}
          </button>

          {showDetails && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Annual Gross (Total)</span>
                <span>{formatCurrency(result.annualGross)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>- PTKP (Tax Free)</span>
                <span style={{ color: '#22c55e' }}>({formatCurrency(result.ptkp)})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Taxable Income (PKP)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(result.pkp)}</span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                {result.layers.map((layer, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Tier {index + 1} ({(layer.rate * 100)}% x {formatCurrency(layer.amount)})</span>
                    <span style={{ color: 'var(--brand-red)' }}>{formatCurrency(layer.tax)}</span>
                  </div>
                ))}
              </div>

              {!isReverse && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total Annual Tax</span>
                    <span style={{ fontWeight: 600, color: 'var(--brand-red)' }}>{formatCurrency(result.taxAnnual)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span>÷ 12 Months</span>
                    <span>{formatCurrency(result.taxMonthly)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultCard;
