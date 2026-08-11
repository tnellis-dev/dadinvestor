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
      <div className="mb-1 text-xs font-semibold text-slate-600">{label}</div>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[#10B981] focus-within:bg-white transition">
        {prefix ? <span className="text-slate-400 text-sm font-medium">{prefix}</span> : null}
        <input
          className="w-full bg-transparent text-sm sm:text-base text-slate-900 font-semibold outline-none"
          inputMode="decimal"
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix ? <span className="text-slate-400 text-sm font-medium">{suffix}</span> : null}
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
    <div className="grid gap-8 lg:grid-cols-12 items-start">
      {/* LEFT COLUMN: Inputs (5 Columns) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-[#0F291E]">Your Numbers</h2>
          <p className="text-xs text-slate-500 mt-0.5">Adjust inputs to update projections instantly.</p>
        </div>

        <div className="space-y-6">
          {/* Assets Group */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">1. Assets</span>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cash" value={cash} prefix="$" onChange={setCash} />
              <Field label="Investments" value={investments} prefix="$" onChange={setInvestments} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Super Balance" value={superBal} prefix="$" onChange={setSuperBal} />
              <Field label="Home Value" value={homeValue} prefix="$" onChange={setHomeValue} />
            </div>
          </div>

          {/* Contributions Group */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">2. Contributions</span>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Monthly ETF/Inv" value={invMonthlyContrib} prefix="$" onChange={setInvMonthlyContrib} />
              <Field label="Monthly Super" value={superMonthlyContrib} prefix="$" onChange={setSuperMonthlyContrib} />
            </div>
          </div>

          {/* Assumptions Group */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">3. Growth Assumptions</span>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Inv Return" value={invReturnPct} suffix="%" onChange={setInvReturnPct} />
              <Field label="Super Return" value={superReturnPct} suffix="%" onChange={setSuperReturnPct} />
              <Field label="Home Growth" value={homeGrowthPct} suffix="%" onChange={setHomeGrowthPct} />
            </div>
          </div>

          {/* Mortgage Group */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">4. Mortgage & Debt</span>


            <Field label="Balance" value={mortgageBal} prefix="$" onChange={setMortgageBal} />

            
            <div className="grid grid-cols-2 gap-3">
              
              <Field label="Rate" value={mortgageRatePct} suffix="%" onChange={setMortgageRatePct} />
              <Field label="Yrs Left" value={mortgageYearsLeft} onChange={setMortgageYearsLeft} />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Results & Chart (7 Columns) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Results Banner Box */}
        <div className="bg-[#0F291E] text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-900/60 pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#10B981] font-bold">Projected Outcome</span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-0.5 font-mono">
                {fmtMoney(results.netWorth)}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Net worth {years === 0 ? "today" : `projected in ${years} years`} based on your inputs.
              </p>
            </div>

            {/* Time Horizon Selector Pills */}
            <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-emerald-900/40 self-start sm:self-auto">
              {[0, 5, 10, 20].map((y) => (
                <button
                  key={y}
                  onClick={() => setYears(y as Years)}
                  className={[
                    "px-3 py-1.5 text-xs font-bold rounded-xl transition",
                    years === y
                      ? "bg-[#10B981] text-[#0F291E] shadow-sm"
                      : "text-slate-300 hover:text-white",
                  ].join(" ")}
                >
                  {y === 0 ? "Now" : `${y}y`}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Card label="Total Assets" value={fmtMoney(results.totalAssets)} />
            <Card label="Liabilities" value={fmtMoney(results.totalLiabilities)} />
            <Card label="Home Equity" value={fmtMoney(results.homeEquity)} />
            <Card label="Loan Balance" value={fmtMoney(results.mort)} />
          </div>
        </div>

        {/* Visual Chart Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <NetWorthChart data={chartData} />
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Estimates only. Assumes compounding growth over time.</span>
            <span className="font-semibold text-slate-600">DadInvestor Framework</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-900/50 p-3 border border-emerald-900/30">
      <div className="text-slate-400 text-[11px] font-medium">{label}</div>
      <div className="font-bold text-white text-sm font-mono mt-0.5">{value}</div>
    </div>
  );
}