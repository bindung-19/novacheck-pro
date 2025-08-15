import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function Report(){
  const { state } = useLocation() as any
  const r = state?.report
  if (!r) return (<div className="container"><div className="card">No report. Go <Link to="/">home</Link>.</div></div>)
  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <img src="/logo.svg" className="logo" alt="logo" />
          <div>
            <div className="title">NovaCheck Pro — Report</div>
            <div className="subtitle">Explainable analysis snapshot</div>
          </div>
        </div>
        <div className="small">Created: {new Date(r.createdAt).toLocaleString()}</div>
      </div>

      <div className="grid" style={{marginTop:20}}>
        <div className="card">
          <div className="kpi">
            <div>
              <div style={{fontWeight:800,fontSize:18}}>{r.verdict.label}</div>
              <div className="small">{r.verdict.reason}</div>
            </div>
            <div className="gauge">
              <svg viewBox="0 0 120 120" width="100" height="100">
                <defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stopColor="#7be2ff"/><stop offset="1" stopColor="#6bd6a5"/></linearGradient></defs>
                <circle cx="60" cy="60" r="44" stroke="#071428" strokeWidth="16" fill="none"></circle>
                <circle cx="60" cy="60" r="44" stroke="url(#g1)" strokeWidth="16" fill="none" strokeDasharray={Math.round(r.verdict.score*276)} strokeDashoffset={276 - Math.round(r.verdict.score*276)} transform="rotate(-90 60 60)"></circle>
                <text x="60" y="64" fontSize="16" textAnchor="middle" fill="#eaf6ff" fontWeight="700">{Math.round(r.verdict.score*100)}</text>
              </svg>
            </div>
          </div>

          <div style={{marginTop:12}} className="small"><b>Input</b></div>
          <pre className="trace">{r.input}</pre>
        </div>

        <div className="card">
          <div className="small"><b>Claims & Evidence</b></div>
          <div className="small" style={{marginTop:8}}>
            {r.claims.map((c:any,i:number)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{fontWeight:700}}>Claim {i+1}</div>
                <div className="small">{c.text}</div>
                <div className="small">Similarity: {(c.similarity*100).toFixed(1)} | Lang risk: {(c.languageRisk*100).toFixed(0)}</div>
                <div style={{marginTop:6}} className="small"><b>Top match:</b> {c.best? <><a href={c.best.url} target="_blank" rel="noreferrer">{c.best.title}</a> — <span className="small">{c.best.snippet}</span></> : 'None'}</div>
                <div style={{marginTop:6}} className="small"><b>NLI:</b> {c.nli? `entail:${(c.nli.entail*100).toFixed(1)} | contra:${(c.nli.contra*100).toFixed(1)} | neutral:${(c.nli.neu*100).toFixed(1)}` : '—'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="small"><b>Evidence</b></div>
          <div className="evidence-list">
            {r.evidence.map((e:any,i:number)=>(
              <div key={i} className="evidence-item">
                <a href={e.url} target="_blank" rel="noreferrer">{e.title}</a>
                <div className="small" style={{marginTop:6}}>{e.snippet}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="small"><b>Full trace</b></div>
          <pre className="trace">{JSON.stringify(r, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
