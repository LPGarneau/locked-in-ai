'use client';
import { useState } from 'react';
import { SUPPLEMENTS, CATEGORIES, amazonUrl, type SupplementCategory } from '@/lib/supplements';

const EVIDENCE_LABEL: Record<string,string> = { strong:'Strong evidence', moderate:'Moderate evidence', emerging:'Emerging' };
const EVIDENCE_COLOR: Record<string,string> = { strong:'var(--tag-diet)', moderate:'var(--tag-skin)', emerging:'var(--tag-sleep)' };
const EVIDENCE_BG: Record<string,string>    = { strong:'var(--tag-diet-bg)', moderate:'var(--tag-skin-bg)', emerging:'var(--tag-sleep-bg)' };

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_TAG || '';

  const filtered = SUPPLEMENTS.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  function buildUrl(query: string) {
    const params = new URLSearchParams({ k: query });
    if (amazonTag) params.set('tag', amazonTag);
    return `https://www.amazon.com/s?${params}`;
  }

  function handleCustomSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.open(buildUrl(searchQuery), '_blank', 'noopener');
  }

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontFamily:"'Fraunces',serif",fontSize:'2rem',fontWeight:300,fontStyle:'italic',letterSpacing:'-0.02em'}}>
          Supplement Shop
        </h1>
        <p style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase',marginTop:4}}>
          Blueprint-approved stack — all linked to Amazon
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleCustomSearch} style={{display:'flex',gap:8,marginBottom:'1.5rem'}}>
        <input
          type="text"
          placeholder="Search supplements or search Amazon directly…"
          value={searchQuery}
          onChange={e=>setSearchQuery(e.target.value)}
          style={{flex:1}}
        />
        <button type="submit"
          style={{background:'var(--accent)',color:'#0d0d0d',border:'none',borderRadius:'var(--radius)',
            padding:'10px 18px',fontSize:12,fontWeight:500,letterSpacing:'0.04em',flexShrink:0,fontFamily:'inherit',
            whiteSpace:'nowrap'}}>
          Search Amazon ↗
        </button>
      </form>

      {/* Category filters */}
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:'1.5rem'}}>
        {CATEGORIES.map(cat => (
          <button key={cat.id}
            onClick={()=>setActiveCategory(cat.id)}
            style={{background: activeCategory===cat.id ? 'var(--accent)' : 'var(--surface)',
              color: activeCategory===cat.id ? '#0d0d0d' : 'var(--muted)',
              border:'1px solid var(--border)',borderRadius:99,padding:'5px 14px',
              fontSize:11,letterSpacing:'0.06em',transition:'all 0.15s',fontFamily:'inherit'}}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{fontSize:11,color:'var(--muted)',marginBottom:'1rem',letterSpacing:'0.05em'}}>
        {filtered.length} supplement{filtered.length!==1?'s':''} shown
      </div>

      {/* Cards grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
        {filtered.map(s => (
          <div key={s.id}
            style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',
              padding:'1.25rem',display:'flex',flexDirection:'column',gap:10}}>

            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8}}>
              <div>
                <div style={{fontSize:14,fontWeight:500,color:'var(--text)',marginBottom:3,lineHeight:1.3}}>{s.name}</div>
                <div style={{fontSize:11,color:'var(--muted)'}}>{s.dose}</div>
              </div>
              <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,whiteSpace:'nowrap',flexShrink:0,
                background:EVIDENCE_BG[s.evidence],color:EVIDENCE_COLOR[s.evidence],fontWeight:500,letterSpacing:'0.04em'}}>
                {EVIDENCE_LABEL[s.evidence]}
              </span>
            </div>

            <p style={{fontSize:12,color:'var(--muted)',lineHeight:1.6,flex:1}}>{s.description}</p>

            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <span style={{fontSize:10,color:'var(--tag-move)',background:'var(--tag-move-bg)',padding:'2px 8px',borderRadius:99}}>
                ⏰ {s.timing}
              </span>
              <a href={buildUrl(s.searchQuery)} target="_blank" rel="noopener noreferrer"
                style={{fontSize:11,color:'var(--accent)',border:'1px solid rgba(200,245,66,0.25)',
                  borderRadius:99,padding:'4px 12px',background:'var(--accent-dim)',letterSpacing:'0.04em',
                  display:'flex',alignItems:'center',gap:5,transition:'background 0.15s',textDecoration:'none'}}
                onMouseOver={e=>(e.currentTarget.style.background='rgba(200,245,66,0.18)')}
                onMouseOut={e=>(e.currentTarget.style.background='var(--accent-dim)')}>
                Buy on Amazon ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{textAlign:'center',padding:'3rem',color:'var(--muted)',fontSize:13}}>
          No supplements found. Try a different search.
        </div>
      )}

      {/* Disclaimer */}
      <div style={{marginTop:'2rem',padding:'1rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',fontSize:11,color:'var(--muted)',lineHeight:1.6}}>
        ⚠️ These links may include Amazon Associates affiliate tags. Always consult your doctor before starting any supplement protocol, especially if you are on medications.
      </div>
    </div>
  );
}
