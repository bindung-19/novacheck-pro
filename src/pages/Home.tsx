import React, { useEffect, useState } from 'react'
import Analyzer from '../components/Analyzer'

export default function Home(){
  const [text, setText] = useState('')
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('nc:theme') || 'dark')
  useEffect(()=>{ document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('nc:theme', theme) }, [theme])

  const trending = [
    'NASA confirms new water evidence on the Moon',
    'Global markets rally after trade deal',
    'Celebrity X misleading death hoax',
    'Study: coffee linked to reduced dementia risk'
  ]

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <img src="/logo.svg" className="logo" alt="logo" />
          <div>
            <div className="title">NovaCheck Pro</div>
            <div className="subtitle">Zero-cost • In-browser NLI • Explainable evidence</div>
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="small">History</div>
          <div className="toggle" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?'🌙 Dark':'🌤️ Light'}</div>
        </div>
      </div>

      <div className="grid">
        <div className="left">
          <div className="card">
            <h1 style={{margin:0}}>Polished verification — built to impress.</h1>
            <p className="small">Paste a headline or short paragraph. NovaCheck will pull trusted evidence and run local NLI to check support/contradiction.</p>

            <div style={{marginTop:12}}>
              <label className="small">Paste headline / claim</label>
              <textarea className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Try: NASA confirms water on the Moon surface." />
              <div style={{marginTop:10}} className="actions">
                <Analyzer initialText={text} />
              </div>
            </div>

            <div style={{marginTop:14}} className="small">Trending headlines</div>
            <div className="trending" style={{marginTop:8}}>
              {trending.map((t,i)=>(<div key={i} className="trend" onClick={()=>setText(t)}>{t}</div>))}
            </div>
          </div>
        </div>

        <div className="right">
          <div className="card">
            <div className="small">Why this wins interviews</div>
            <ul className="small">
              <li>Client-side ML (privacy + zero-cost).</li>
              <li>Explainable chain-of-evidence and NLI results.</li>
              <li>History, export, and recruiter-ready UI.</li>
            </ul>
          </div>

          <div className="card" style={{marginTop:16}}>
            <div className="small"><b>How it works</b></div>
            <ol className="small">
              <li>Split input into claims.</li>
              <li>Fetch trusted summaries from Wikipedia for entities/keywords.</li>
              <li>Run in-browser NLI to check entailment/contradiction.</li>
              <li>Aggregate signals into an explainable verdict.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="footer">Pro tip: deploy to Vercel and include the live demo link on your resume.</div>
    </div>
  )
}
