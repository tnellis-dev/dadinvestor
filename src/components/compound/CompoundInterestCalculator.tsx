import React, { useState } from 'react';
import CompoundInterestChart, { type CompoundPoint } from './components/CompoundInterestChart';

function fmtMoney(n: number) {
  return Number(n).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  });
}

export default function CompoundInterestCalculator() {
  const [initialDeposit, setInitialDeposit] = useState<number>(10000);
  const [regularDeposit, setRegularDeposit] = useState<number>(500);
  const [depositFrequency, setDepositFrequency] = useState<string>('monthly');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('monthly');
  const [years, setYears] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [variance, setVariance] = useState<number>(2);

  const [results, setResults] = useState<{
    chartData: CompoundPoint[];
    finalTotal: number;
    finalHigh: number;
    finalLow: number;
    totalDeposits: number;
    totalInterest: number;
    calculatedYears: number;
  } | null>(null);

  const handleCalculate = () => {
    const rateDec = (interestRate || 0) / 100;
    const varDec = (variance || 0) / 100;
    const rateHigh = rateDec + varDec;
    const rateLow = Math.max(0, rateDec - varDec);

    const n = compoundFrequency === 'monthly' ? 12 : 1;
    let m = 12;
    switch (depositFrequency) {
      case 'monthly': m = 12; break;
      case 'annually': m = 1; break;
      case 'daily': m = 365; break;
      case 'weekly': m = 52; break;
      case 'fortnightly': m = 26; break;
      default: m = 12;
    }

    const points: CompoundPoint[] = [];

    for (let y = 0; y <= years; y++) {
      const factor = Math.pow(1 + rateDec / n, n * y);
      const expected =
        initialDeposit * factor +
        (rateDec > 0
          ? regularDeposit * ((factor - 1) / (rateDec / n)) * (m / n)
          : regularDeposit * m * y);

      const factorHigh = Math.pow(1 + rateHigh / n, n * y);
      const high =
        initialDeposit * factorHigh +
        (rateHigh > 0
          ? regularDeposit * ((factorHigh - 1) / (rateHigh / n)) * (m / n)
          : regularDeposit * m * y);

      const factorLow = Math.pow(1 + rateLow / n, n * y);
      const low =
        initialDeposit * factorLow +
        (rateLow > 0
          ? regularDeposit * ((factorLow - 1) / (rateLow / n)) * (m / n)
          : regularDeposit * m * y);

      points.push({ year: y, expected, high, low });
    }

    const endPoint = points[points.length - 1] || { expected: 0, high: 0, low: 0 };
    const depositsMade = regularDeposit * m * years;
    const interestEarned = endPoint.expected - (initialDeposit + depositsMade);

    setResults({
      chartData: points,
      finalTotal: endPoint.expected,
      finalHigh: endPoint.high,
      finalLow: endPoint.low,
      totalDeposits: depositsMade,
      totalInterest: interestEarned > 0 ? interestEarned : 0,
      calculatedYears: years,
    });
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-[#0F291E] border-b border-slate-100 pb-4">
          Enter Your Numbers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Initial Deposit ($)
            </label>
            <input
              type="number"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Regular Deposit ($)
            </label>
            <input
              type="number"
              value={regularDeposit}
              onChange={(e) => setRegularDeposit(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deposit Frequency
            </label>
            <select
              value={depositFrequency}
              onChange={(e) => setDepositFrequency(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#10B981]"
            >
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Compound Frequency
            </label>
            <select
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#10B981]"
            >
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Years (max 50)
            </label>
            <input
              type="number"
              max={50}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Annual Return (%)
            </label>
            <input
              type="number"
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Variance (+/- %)
            </label>
            <input
              type="number"
              step={0.1}
              value={variance}
              onChange={(e) => setVariance(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full bg-[#10B981] hover:bg-emerald-600 text-[#0F291E] font-bold py-4 rounded-xl transition shadow-sm text-center block mt-6 text-base cursor-pointer"
        >
          Calculate Growth
        </button>
      </div>

      {/* Output Results (Revealed on Button Click) */}
      {results && (
        <div className="space-y-6">
          <div className="bg-[#0F291E] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#10B981]">
                PROJECTED OUTCOME
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white mt-1 font-mono">
                {fmtMoney(results.finalTotal)}
              </div>
              <p className="text-slate-300 text-sm mt-1">
                Projected portfolio value in {results.calculatedYears} years based on your inputs.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <span className="block text-xs text-slate-400 font-medium">Initial Principal</span>
                <span className="text-base sm:text-xl font-bold text-white font-mono mt-0.5 block">
                  {fmtMoney(initialDeposit)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Total Deposits</span>
                <span className="text-base sm:text-xl font-bold text-white font-mono mt-0.5 block">
                  {fmtMoney(results.totalDeposits)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Interest Earned</span>
                <span className="text-base sm:text-xl font-bold text-[#10B981] font-mono mt-0.5 block">
                  {fmtMoney(results.totalInterest)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Variance Range</span>
                <span className="text-xs sm:text-sm font-bold text-slate-200 font-mono mt-1 block">
                  {fmtMoney(results.finalLow)} - {fmtMoney(results.finalHigh)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0F291E]">Portfolio Growth Over Time</h3>
            <CompoundInterestChart data={results.chartData} />
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-2 text-xs text-slate-400">
              <span>Estimates only. Assumes compounding returns over time.</span>
              <span className="font-semibold text-slate-600">DadInvestor Framework</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}