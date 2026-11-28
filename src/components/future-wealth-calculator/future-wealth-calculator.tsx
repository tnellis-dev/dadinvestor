
"use client";

import { useMemo, useState } from "react";
import NetWorthChart from "./components/NetWorthChart.tsx";

type Years = 0 | 5 | 10 | 20;

import {
  fmtMoney,
  fv,
  fvWithAnnualContrib,
  remainingLoanBalance,
  pctToDec,
} from "./calculations.ts";

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#26312B]">{label}</div>
      <div className="flex items-center gap-2 rounded-xl border border-[#D8CCBB] bg-[#F8F3EA] px-4 py-3 focus-within:border-[#164B35] focus-within:ring-2 focus-within:ring-[#164B35]/10 transition">
        {prefix ? <span className="text-[#626B64] text-sm font-medium">{prefix}</span> : null}
        <input
          className="w-full min-w-0 bg-transparent text-base text-[#18251F] font-semibold outline-none"
          inputMode="decimal"
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix ? <span className="text-[#626B64] text-sm font-medium">{suffix}</span> : null}
      </div>
    </label>
  );
}

export default function FutureWealthCalculator() {
  const [years, setYears] = useState<Years>(0);

  // Inputs
  const [cash, setCash] = useState(10000);
  const [investments, setInvestments] = useState(10000);
  const [superBal, setSuperBal] = useState(140000);
  const [homeValue, setHomeValue] = useState(850000);

  const [invReturnPct, setInvReturnPct] = useState(6);
  const [superReturnPct, setSuperReturnPct] = useState(6);
  const [homeGrowthPct, setHomeGrowthPct] = useState(3);

  const [invMonthlyContrib, setInvMonthlyContrib] = useState(500);
  const [superMonthlyContrib, setSuperMonthlyContrib] = useState(700);

  const [mortgageBal, setMortgageBal] = useState(420000);
  const [mortgageRatePct, setMortgageRatePct] = useState(6);
  const [mortgageYearsLeft, setMortgageYearsLeft] = useState(25);

  const results = useMemo(() => {
    const inv = fvWithAnnualContrib(
      investments,
      invMonthlyContrib * 12,
      pctToDec(invReturnPct),
      years
    );

    const sup = fvWithAnnualContrib(
      superBal,
      superMonthlyContrib * 12,
      pctToDec(superReturnPct),
      years
    );

    const home = fv(homeValue, pctToDec(homeGrowthPct), years);
    const mort = remainingLoanBalance(
      mortgageBal,
      pctToDec(mortgageRatePct),
      mortgageYearsLeft,
      years
    );

    const totalAssets = cash + inv + sup + home;
    const totalLiabilities = mort;
    const homeEquity = home - mort;
    const netWorth = totalAssets - totalLiabilities;

    return {
      inv,
      sup,
      home,
      mort,
      totalAssets,
      totalLiabilities,
      homeEquity,
      netWorth,
    };
  }, [
    years,
    cash,
    investments,
    superBal,
    homeValue,
    invReturnPct,
    superReturnPct,
    homeGrowthPct,
    invMonthlyContrib,
    superMonthlyContrib,
    mortgageBal,
    mortgageRatePct,
    mortgageYearsLeft,
  ]);

  const chartData = [0, 5, 10, 20].map((y) => {
    const inv = fvWithAnnualContrib(
      investments,
      invMonthlyContrib * 12,
      pctToDec(invReturnPct),
      y
    );

    const sup = fvWithAnnualContrib(
      superBal,
      superMonthlyContrib * 12,
      pctToDec(superReturnPct),
      y
    );

    const home = fv(homeValue, pctToDec(homeGrowthPct), y);
    const mort = remainingLoanBalance(
      mortgageBal,
      pctToDec(mortgageRatePct),
      mortgageYearsLeft,
      y
    );

    return {
      years: y,
      netWorth: cash + inv + sup + home - mort,
    };
  });

  return (
    <div className="space-y-6">

      {/* Inputs */}
      <div className="bg-[#FFFCF6] border border-[#E3D8C8] rounded-2xl p-6 md:p-8 space-y-7">

        <div className="border-b border-[#E3D8C8] pb-4">
          <h2 className="text-xl font-bold text-[#18251F]">Your Numbers</h2>
          <p className="text-sm text-[#626B64] mt-1">
            Adjust your inputs to update your projections instantly.
          </p>
        </div>

        {/* Assets */}
        <div className="space-y-4">
          <span className="text-sm font-bold uppercase tracking-wider text-[#164B35]">
            1. Assets
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Cash" value={cash} prefix="$" onChange={setCash} />
            <Field label="Investments" value={investments} prefix="$" onChange={setInvestments} />
            <Field label="Super Balance" value={superBal} prefix="$" onChange={setSuperBal} />
            <Field label="Home Value" value={homeValue} prefix="$" onChange={setHomeValue} />
          </div>
        </div>

        {/* Contributions */}
        <div className="space-y-4 pt-6 border-t border-[#E3D8C8]">
          <span className="text-sm font-bold uppercase tracking-wider text-[#164B35]">
            2. Contributions
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Monthly ETF / Investments" value={invMonthlyContrib} prefix="$" onChange={setInvMonthlyContrib} />
            <Field label="Monthly Super" value={superMonthlyContrib} prefix="$" onChange={setSuperMonthlyContrib} />
          </div>
        </div>

        {/* Growth assumptions */}
        <div className="space-y-4 pt-6 border-t border-[#E3D8C8]">
          <span className="text-sm font-bold uppercase tracking-wider text-[#164B35]">
            3. Growth Assumptions
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Investment Return" value={invReturnPct} suffix="%" onChange={setInvReturnPct} />
            <Field label="Super Return" value={superReturnPct} suffix="%" onChange={setSuperReturnPct} />
            <Field label="Home Growth" value={homeGrowthPct} suffix="%" onChange={setHomeGrowthPct} />
          </div>
        </div>

        {/* Mortgage */}
        <div className="space-y-4 pt-6 border-t border-[#E3D8C8]">
          <span className="text-sm font-bold uppercase tracking-wider text-[#164B35]">
            4. Mortgage & Debt
          </span>

          <Field label="Mortgage Balance" value={mortgageBal} prefix="$" onChange={setMortgageBal} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Mortgage Rate" value={mortgageRatePct} suffix="%" onChange={setMortgageRatePct} />
            <Field label="Years Left" value={mortgageYearsLeft} onChange={setMortgageYearsLeft} />
          </div>
        </div>

      </div>

      {/* Results */}
      <div className="bg-[#164B35] text-[#FFFCF6] rounded-2xl p-6 md:p-8 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-white/15 pb-5">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#D5E4D9] font-semibold">
              Projected Outcome
            </span>

            <div className="text-3xl sm:text-4xl font-bold text-[#FFFCF6] mt-2">
              {fmtMoney(results.netWorth)}
            </div>

            <p className="text-sm text-[#E5EDE7] mt-2">
              Net worth {years === 0 ? "today" : `projected in ${years} years`} based on your inputs.
            </p>
          </div>

          {/* Time Horizon Selector */}
          <div className="flex bg-[#103B2A] p-1 rounded-xl border border-white/15 self-start sm:self-auto">
            {[0, 5, 10, 20].map((y) => (
              <button
                key={y}
                onClick={() => setYears(y as Years)}
                className={[
                  "px-4 py-2 text-sm font-semibold rounded-lg transition",
                  years === y
                    ? "bg-[#FFFCF6] text-[#164B35]"
                    : "text-[#E5EDE7] hover:text-white",
                ].join(" ")}
              >
                {y === 0 ? "Now" : `${y}y`}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card label="Total Assets" value={fmtMoney(results.totalAssets)} />
          <Card label="Liabilities" value={fmtMoney(results.totalLiabilities)} />
          <Card label="Home Equity" value={fmtMoney(results.homeEquity)} />
          <Card label="Loan Balance" value={fmtMoney(results.mort)} />
        </div>

      </div>

      {/* Chart */}
      <div className="bg-[#FFFCF6] border border-[#E3D8C8] rounded-2xl p-5 md:p-8">
        <NetWorthChart data={chartData} />

        <div className="mt-5 pt-4 border-t border-[#E3D8C8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-[#626B64]">
          <span>Estimates only. Assumes compounding growth over time.</span>
          <span className="font-semibold text-[#164B35]">DadInvestor Framework</span>
        </div>
      </div>

    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#103B2A] p-4 border border-white/15">
      <div className="text-[#D5E4D9] text-xs font-medium">{label}</div>
      <div className="font-bold text-[#FFFCF6] text-base mt-2">{value}</div>
    </div>
  );
}
