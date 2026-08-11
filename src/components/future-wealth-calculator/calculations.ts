function clamp(n: number) {
  return Number.isFinite(n) ? n : 0;
}

function fmtMoney(n: number) {
  return clamp(n).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
}

function fv(principal: number, annualRate: number, years: number) {
  principal = clamp(principal);
  annualRate = clamp(annualRate);
  years = clamp(years);
  return years <= 0 ? principal : principal * Math.pow(1 + annualRate, years);
}

function fvWithAnnualContrib(
  principal: number,
  annualContrib: number,
  annualRate: number,
  years: number
) {
  principal = clamp(principal);
  annualContrib = clamp(annualContrib);
  annualRate = clamp(annualRate);
  years = clamp(years);

  if (years <= 0) return principal;
  if (annualRate === 0) return principal + annualContrib * years;

  const growth = Math.pow(1 + annualRate, years);
  const annuityFactor = (growth - 1) / annualRate;
  return principal * growth + annualContrib * annuityFactor;
}

function annualPayment(principal: number, annualRate: number, years: number) {
  principal = clamp(principal);
  annualRate = clamp(annualRate);
  years = clamp(years);

  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / years;

  const r = annualRate;
  return (principal * r) / (1 - Math.pow(1 + r, -years));
}

function remainingLoanBalance(
  principal: number,
  annualRate: number,
  yearsTotal: number,
  yearsElapsed: number
) {
  principal = clamp(principal);
  annualRate = clamp(annualRate);
  yearsTotal = clamp(yearsTotal);
  yearsElapsed = clamp(yearsElapsed);

  if (principal <= 0) return 0;
  if (yearsTotal <= 0) return principal;
  if (yearsElapsed <= 0) return principal;
  if (yearsElapsed >= yearsTotal) return 0;

  const pmt = annualPayment(principal, annualRate, yearsTotal);

  if (annualRate === 0) {
    return Math.max(0, principal - pmt * yearsElapsed);
  }

  const r = annualRate;
  const growth = Math.pow(1 + r, yearsElapsed);
  const annuityFactor = (growth - 1) / r;
  return Math.max(0, principal * growth - pmt * annuityFactor);
}

function pctToDec(pct: number) {
  return clamp(pct) / 100;
}
function decToPct(dec: number) {
  return clamp(dec) * 100;
}

export {
  clamp,
  fmtMoney,
  fv,
  fvWithAnnualContrib,
  annualPayment,
  remainingLoanBalance,
  pctToDec,
  decToPct,
};