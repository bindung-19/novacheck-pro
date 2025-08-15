const STOP = new Set(['the','a','an','and','or','but','if','in','on','at','of','for','to','by','with','as','is','are','was','were','be','been','it','that','this','from','has','have','had','not','will','can','may'])

export function normalizeText(t: string) {
  return (t||'').toLowerCase().replace(/https?:\/\/\S+/g,' ').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()
}

export function tokenize(t: string) {
  return normalizeText(t).split(' ').filter(w=>w && !STOP.has(w))
}

export function splitIntoClaims(t: string): string[] {
  if (!t) return []
  const parts = t.replace(/\n+/g,' ').split(/(?<=[\.!?])\s+/g).map(s=>s.trim()).filter(Boolean)
  return parts.filter(p=>p.split(' ').length>=4)
}

export function extractEntities(t: string): string[] {
  const caps = Array.from(t.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g)).map(m=>m[0])
  const freq: Record<string,number> = {}
  for (const w of tokenize(t)) freq[w]=(freq[w]||0)+1
  const top = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,8).map(x=>x[0])
  return Array.from(new Set([...caps, ...top])).slice(0,10)
}

export function trigramShingles(words: string[], k=3) {
  const grams: string[] = []
  for (let i=0;i<=Math.max(0, words.length-k); i++) grams.push(words.slice(i,i+k).join(' '))
  return grams
}

export function jaccard(a: Set<string>, b: Set<string>) {
  let inter = 0
  for (const x of a) if (b.has(x)) inter++
  const union = a.size + b.size - inter
  return union? inter/union : 0
}

export function simpleSimilarity(a: string, b: string) {
  const aw = tokenize(a), bw = tokenize(b)
  if (aw.length<3 || bw.length<3) return 0
  const A = new Set(trigramShingles(aw)), B = new Set(trigramShingles(bw))
  return jaccard(A,B)
}

const CLICKBAIT = ['shocking','you won\'t believe','exposed','destroyed','devastating','miracle','secret','guaranteed','insane','leaked','proof','100%','click here']
export function languageRiskScore(t: string) {
  let score = 0
  if (/[A-Z]{6,}/.test(t)) score += 0.25
  if (/[!]{1,}/.test(t)) score += 0.18
  for (const w of CLICKBAIT) if (t.toLowerCase().includes(w)) score += 0.09
  return Math.min(1, score)
}
