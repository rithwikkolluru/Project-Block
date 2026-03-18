export const calculateRiskScore = (data: any) => {
  // Mock AI scanner logic
  const txRisk = data.txCount > 100 ? 20 : 0;
  const ageRisk = data.walletAge < 30 ? 30 : 0;
  const contractRisk = data.hasUnverifiedContracts ? 40 : 0;
  const communityRisk = data.reports > 5 ? 10 : 0;

  let totalRisk = txRisk + ageRisk + contractRisk + communityRisk;
  if (totalRisk > 100) totalRisk = 100;
  return totalRisk;
};

export const getWarpDuration = (score: number) => {
  if (score < 30) return 0.8; // Safe -> quick scan
  if (score < 70) return 1.5; // Warning -> careful scan
  return 3.0; // Danger -> deep scan
};
