/**
 * Esports Dossiers dataset for Homework 3: Fair-Play Appeal Tribunal
 * Case Study: Himass & TanVuu (Slide 21 & Slide 32/33).
 */

export const DOSSIERS = {
  himass: {
    id: 'himass',
    playerName: 'La Vu Hoai An (Himass)',
    team: 'Cerberus Esports / Team Flash',
    role: 'Entry Fragger & High-Impact Striker',
    title: 'Himass Case Study: Macro Disconnect & Movement Anomaly',
    caseNumber: 'TRIB-2024-HIMASS-09',
    penaltyApplied: '6-Month Competitive Suspension & Prize Deduction',
    offenseType: 'Alleged Software Tick Interpolation & Unverified Netcode Desync',
    offenseSeverity: 8.5,
    benchmarkOffenseSeverity: 4.2,
    evidenceItems: [
      { id: 'ev-1', type: 'Packet Trace', name: 'Server-side 64-tick network packet dump during Match 3' },
      { id: 'ev-2', type: 'Hardware Log', name: 'Mouse firmware 8000Hz polling rate conflict report' },
      { id: 'ev-3', type: 'Referee POV', name: 'Stage referee screen recording showing zero unauthorized background process' },
    ],
    appealDeadlineHours: 48,
    statement:
      'The observed positional snapping coincided precisely with a localized LAN switch packet queue drop. LAN referee logs corroborate zero third-party software was loaded.',
  },
  tanvuu: {
    id: 'tanvuu',
    playerName: 'Nguyen Tan Vu (TanVuu)',
    team: 'The Dice Esports / New Generation',
    role: 'In-Game Leader (IGL) & Tactical Anchor',
    title: 'TanVuu Case Study: Communication Channel Overlap',
    caseNumber: 'TRIB-2024-TANVUU-14',
    penaltyApplied: '3-Month Regional Suspension',
    offenseType: 'Discord Sub-Channel Voice Transmission Leak during Technical Pause',
    offenseSeverity: 6.0,
    benchmarkOffenseSeverity: 2.5,
    evidenceItems: [
      { id: 'ev-4', type: 'Audio Log', name: 'Tournament Discord audio channel packet recording' },
      { id: 'ev-5', type: 'Tactical Replay', name: 'Map overview replay during the 4-minute technical timeout' },
    ],
    appealDeadlineHours: 72,
    statement:
      'Voice activation was triggered accidentally by ambient stage noise during hardware headset replacement. No game-state intelligence was transmitted.',
  },
};

/**
 * Slide 32 Code Contract: Disproportionality Derived Matrix computation
 * Pure computation during render pass without useEffect.
 */
export function computeMatrix(dossier) {
  if (!dossier) return null;

  const ratio = (dossier.offenseSeverity / dossier.benchmarkOffenseSeverity).toFixed(2);
  const isExcessive = parseFloat(ratio) > 1.5;

  return {
    ratio,
    isExcessive,
    varianceScore: Math.round((dossier.offenseSeverity - dossier.benchmarkOffenseSeverity) * 20),
    recommendation: isExcessive
      ? 'High Disproportionality Detected: Recommended 60% penalty reduction to conditional probation.'
      : 'Standard Severity Variance: Within standard judicial discretion limits.',
    parityStatus: isExcessive ? 'UNBALANCED // DISPROPORTIONATE' : 'CALIBRATED',
  };
}

export default DOSSIERS;
