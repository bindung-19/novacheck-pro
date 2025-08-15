import jsPDF from 'jspdf'
export function exportPDF(report:any){
  const doc = new jsPDF({ unit:'pt', format:'a4' })
  const margin = 40, maxWidth = 515
  const add = (txt:string, y:number, size=11)=>{
    doc.setFontSize(size); const lines = doc.splitTextToSize(txt, maxWidth)
    lines.forEach(line=>{ doc.text(line, margin, y); y += size+4 })
    return y
  }
  doc.setFontSize(16); doc.text('NovaCheck Pro — Analysis Report', margin, 48)
  doc.setFontSize(10); doc.text(`Created: ${new Date(report.createdAt).toLocaleString()}`, margin, 64)
  let y = 90
  y = add(`Verdict: ${report.verdict.label} (${Math.round(report.verdict.score*100)}/100)`, y, 12)
  y = add(`Reason: ${report.verdict.reason}`, y, 11)
  y += 6
  y = add('Input:', y, 11)
  y = add(report.input.slice(0,4000), y, 10)
  y += 6
  y = add('Claims:', y, 11)
  report.claims.forEach((c:any,i:number)=>{
    y = add(`${i+1}. ${c.text}`, y, 10)
    y = add(`   Similarity: ${(c.similarity*100).toFixed(1)} | Lang risk: ${(c.languageRisk*100).toFixed(0)}`, y, 9)
    if (y>760){ doc.addPage(); y=60 }
  })
  y += 6
  y = add('Evidence:', y, 11)
  report.evidence.forEach((e:any)=>{
    y = add(`- ${e.title} — ${e.url}`, y, 9)
    if (y>760){ doc.addPage(); y=60 }
  })
  doc.save('novacheck-pro-report.pdf')
}
