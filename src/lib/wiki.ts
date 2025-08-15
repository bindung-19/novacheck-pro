export async function searchWikipedia(q: string): Promise<{title:string,url:string}[]> {
  if (!q || q.length<2) return []
  try {
    const endpoint = `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(q)}&limit=6`
    const r = await fetch(endpoint)
    if (!r.ok) return []
    const data = await r.json()
    const pages = (data?.pages || [])
    return pages.map((p:any)=>({ title: p.title, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(p.key || p.title.replace(/\s+/g,'_'))}` }))
  } catch (e) { return [] }
}

export async function getSummaryByTitle(title: string): Promise<{extract:string}> {
  try {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    const r = await fetch(endpoint)
    if (!r.ok) return { extract: '' }
    return r.json()
  } catch (e) { return { extract: '' } }
}
