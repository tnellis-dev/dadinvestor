
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

  const inputClass =
    "w-full bg-[#FFFCF6] border border-[#E3D8C8] rounded-xl px-4 py-3 text-[#18251F] text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#164B35]/20 focus:border-[#164B35] transition";

  const labelClass =
    "block text-base font-semibold text-[#26312B] mb-2";

  return (
    <div className="space-y-8">

      {/* Input Form */}
      <div className="bg-[#FFFCF6] border border-[#E3D8C8] rounded-2xl p-6 md:p-8 shadow-sm space-y-7">

        <div className="border-b border-[#E3D8C8] pb-4">
          <h2 className="text-2xl font-bold text-[#18251F]">
            Enter Your Numbers
          </h2>
          <p className="text-base text-[#626B64] mt-2">
            Adjust the figures below to explore how your investments could grow.
          </p>
        </div>

        {/* Deposit Inputs */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#164B35]">
            Contributions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                Initial Deposit ($)
              </label>
              <input
                type="number"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Regular Deposit ($)
              </label>
              <input
                type="number"
                value={regularDeposit}
                onChange={(e) => setRegularDeposit(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Deposit Frequency
              </label>
              <select
                value={depositFrequency}
                onChange={(e) => setDepositFrequency(e.target.value)}
                className={inputClass}
              >
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Compound Frequency
              </label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
                className={inputClass}
              >
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
        </div>

        {/* Growth Assumptions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#164B35]">
            Growth assumptions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>
                Years (max 50)
              </label>
              <input
                type="number"
                max={50}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Annual Return (%)
              </label>
              <input
                type="number"
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Variance (+/- %)
              </label>
              <input
                type="number"
                step={0.1}
                value={variance}
                onChange={(e) => setVariance(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full bg-[#164B35] hover:bg-[#103B2A] !text-[#FFFCF6] font-bold py-4 rounded-xl transition shadow-sm text-lg cursor-pointer"
        >
          Calculate Growth →
        </button>
      </div>

      {/* Output Results */}
      {results && (
        <div className="space-y-6">

          {/* Projected Outcome */}
          <div className="bg-[#103B2A] text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-7">

            <div>
              <span className="text-sm uppercase font-bold tracking-wider text-[#D5E2D8]">
                Projected outcome
              </span>

              <div className="text-4xl sm:text-5xl font-bold !text-[#FFFCF6] mt-2 tabular-nums">
                {fmtMoney(results.finalTotal)}
              </div>

              <p className="text-base text-[#E1E8E2] mt-2">
                Projected portfolio value in {results.calculatedYears} years based on your inputs.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-5 border-t border-white/20">

              <div>
                <span className="block text-sm text-[#D5E2D8] font-medium">
                  Initial Principal
                </span>
                <span className="text-lg sm:text-xl font-bold !text-[#FFFCF6] mt-1 block tabular-nums">
                  {fmtMoney(initialDeposit)}
                </span>
              </div>

              <div>
                <span className="block text-sm text-[#D5E2D8] font-medium">
                  Total Deposits
                </span>
                <span className="text-lg sm:text-xl font-bold !text-[#FFFCF6] mt-1 block tabular-nums">
                  {fmtMoney(results.totalDeposits)}
                </span>
              </div>

              <div>
                <span className="block text-sm text-[#D5E2D8] font-medium">
                  Interest Earned
                </span>
                <span className="text-lg sm:text-xl font-bold !text-[#D5E2D8] mt-1 block tabular-nums">
                  {fmtMoney(results.totalInterest)}
                </span>
              </div>

              <div>
                <span className="block text-sm text-[#D5E2D8] font-medium">
                  Variance Range
                </span>
                <span className="text-sm sm:text-base font-bold !text-[#FFFCF6] mt-2 block tabular-nums">
                  {fmtMoney(results.finalLow)} – {fmtMoney(results.finalHigh)}
                </span>
              </div>

            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-[#FFFCF6] border border-[#E3D8C8] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">

            <div>
              <h3 className="text-2xl font-bold text-[#18251F]">
                Portfolio Growth Over Time
              </h3>
              <p className="text-base text-[#626B64] mt-2">
                See how your projected balance changes year by year.
              </p>
            </div>

            <CompoundInterestChart data={results.chartData} />

            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#E3D8C8] gap-2 text-sm text-[#626B64]">
              <span>Estimates only. Assumes compounding returns over time.</span>
              <span className="font-semibold text-[#164B35]">
                DadInvestor Framework
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
