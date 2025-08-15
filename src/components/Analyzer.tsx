import React, { useEffect, useMemo, useState } from 'react'
import { splitIntoClaims, extractEntities, simpleSimilarity, languageRiskScore } from '../lib/text'
import { searchWikipedia, getSummaryByTitle } from '../lib/wiki'
import { computeVerdict } from '../lib/scoring'
import { exportPDF } from '../lib/pdf'
import { useNavigate } from 'react-router-dom'

export default function Analyzer({ initialText='' }: { initialText?: string }){
  const [text, setText] = useState(initialText || '')
  const [loading, setLoading] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [nlp, setNlp] = useState<any>(null)
  const [history, setHistory] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('nc:history') || '[]') } catch { return [] }
  })
  const nav = useNavigate()

  useEffect(()=>{ setText(initialText || '') }, [initialText])
  useEffect(()=>{ localStorage.setItem('nc:history', JSON.stringify(history)) }, [history])

  const entities = useMemo(()=> extractEntities(text), [text])

  async function ensureModel(){
    if (nlp) return nlp
    setModelLoading(true)
    try {
      const transformers = await import('@xenova/transformers')
      const modelId = 'Xenova/distilroberta-base-mnli'
      const tokenizer = await transformers.AutoTokenizer.from_pretrained(modelId)
      const model = await transformers.AutoModelForSequenceClassification.from_pretrained(modelId)
      const pipeline = await transformers.pipeline('text-classification', model, tokenizer, { task: 'mnli' })
      setNlp(() => pipeline)
      setModelReady(true)
      setModelLoading(false)
      return pipeline
    } catch (e) {
      console.warn('Model load failed', e)
      setModelLoading(false)
      setModelReady(false)
      return null
    }
  }

  async function runNLI(pipeline:any, premise:string, hypothesis:string){
    if (!pipeline) return null
    try {
      const out = await pipeline(hypothesis + ' <-> ' + premise)
      if (!out) return null
      if (Array.isArray(out)) {
        const map:any = {}
        out.forEach((o:any)=>{ map[o.label.toLowerCase()] = o.score })
        return { entail: map['entailment']||map['entail']||0, contra: map['contradiction']||map['contradict']||0, neu: map['neutral']||0 }
      }
      return null
    } catch (e) {
      console.warn('NLI failed', e)
      return null
    }
  }

  async function analyze(){
    if (!text || !text.trim()) return alert('Paste a headline or claim before analyzing.')
    setLoading(true)
    try {
      const claims = splitIntoClaims(text)
      const trimmed = claims.length ? claims : [text]
      const pipeline = await ensureModel()

      const evid:any[] = []
      const queries = [...new Set([...(entities.slice(0,6)), ...text.split(' ').slice(0,12)])].filter(Boolean).slice(0,10)
      for (const q of queries){
        const hits = await searchWikipedia(q)
        for (const h of hits.slice(0,2)){
          const sum = await getSummaryByTitle(h.title)
          evid.push({ title: h.title, url: h.url, snippet: (sum.extract||'').slice(0,550) })
        }
      }

      const claimResults:any[] = []
      for (const c of trimmed){
        const similarity = evid.length ? Math.max(...evid.map(e=>simpleSimilarity(c, e.snippet))) : 0
        const sims = evid.map(e=>simpleSimilarity(c, e.snippet))
        const bestIdx = sims.length? sims.reduce((iMax, x, i, arr)=> x>arr[iMax]?i:iMax,0) : -1
        const best = bestIdx>=0? evid[bestIdx] : null
        let nli = null
        if (pipeline && best) {
          nli = await runNLI(pipeline, best.snippet, c)
        }
        claimResults.push({ text: c, similarity, languageRisk: languageRiskScore(c), best, nli })
      }

      const verdict = computeVerdict(text, claimResults, evid)
      const createdAt = new Date().toISOString()
      const out = { createdAt, input: text, entities, claims: claimResults, evidence: evid, verdict }
      setHistory([out, ...history].slice(0,30))
      nav('/report', { state: { report: out } })
    } catch (e:any){
      console.error(e)
      alert('Analysis failed: ' + (e?.message || e))
    } finally {
      setLoading(false)
    }
  }

  function demoTrue(){ setText('NASA confirms water on the Moon surface after rover detects ice deposits.') }
  function demoFake(){ setText('Scientists discover chocolate cures all cancer in 24 hours!') }

  function exportJSON(r:any){
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'novacheck-report.json'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div style={{width:'100%'}}>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button className="btn" onClick={analyze} disabled={loading}>{loading? 'Analyzing…' : 'Analyze'}</button>
        <button className="btn ghost" onClick={demoTrue}>Demo (True)</button>
        <button className="btn ghost" onClick={demoFake}>Demo (Sensational)</button>
      </div>

      <div style={{marginTop:10}} className="small">Entities: {entities.slice(0,6).join(', ') || '—'}</div>
      <div style={{marginTop:8}} className="small">{modelLoading? 'Loading NLI model (first run) — this may take some seconds.' : modelReady? 'NLI model ready.' : 'NLI model will be loaded on demand.'}</div>

      <div style={{marginTop:12}} className="small"><b>History</b></div>
      <div style={{marginTop:8}}>
        {history.length? history.map((h,i)=> (
          <div key={i} style={{marginBottom:8, padding:8, borderRadius:8, background:'rgba(255,255,255,0.02)'}}>
            <div style={{fontWeight:700}}>{h.verdict.label} — {(Math.round(h.verdict.score*100))}%</div>
            <div className="small">{h.input}</div>
            <div style={{marginTop:6}}>
              <button className="btn ghost" onClick={()=>exportJSON(h)}>Export JSON</button>
            </div>
          </div>
        )) : <div className="small">No history yet.</div>}
      </div>
    </div>
  )
}
