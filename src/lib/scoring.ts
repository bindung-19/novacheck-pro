export function computeVerdict(input: string, claims: any[], evidence: any[]) {
  const avgSim = claims.length? claims.reduce((s,c)=>s+c.similarity,0)/claims.length : 0
  const avgLang = claims.length? claims.reduce((s,c)=>s+c.languageRisk,0)/claims.length : 0
  const coverage = Math.min(1, evidence.length / Math.max(1, claims.length))
  const uniq = new Set(evidence.map(e=>e.title)).size
  const diversity = Math.min(1, uniq/Math.max(1, claims.length))
  let score = 0.55*avgSim + 0.2*diversity + 0.15*coverage + 0.1*(1-avgLang)
  score = Math.max(0, Math.min(1, score))
  let label='Needs More Evidence', reason='Mixed signals; gather more sources.'
  if (score>=0.85) { label='Likely True'; reason='Multiple trusted summaries support the claim and language-risk is low.' }
  else if (score<=0.30) { label='Likely False'; reason='Low similarity to trusted summaries and/or high sensational language.' }
  return { score, label, reason }
}
