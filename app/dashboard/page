'use client';
import { useState, useEffect, useCallback } from 'react';
import { DAYS, Day, getSections, getTotalTasks, getTodayName, WORKOUTS } from '@/lib/tasks';

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  sleep: { bg:'var(--tag-sleep-bg)', color:'var(--tag-sleep)' },
  diet:  { bg:'var(--tag-diet-bg)',  color:'var(--tag-diet)'  },
  move:  { bg:'var(--tag-move-bg)',  color:'var(--tag-move)'  },
  skin:  { bg:'var(--tag-skin-bg)',  color:'var(--tag-skin)'  },
  mind:  { bg:'var(--tag-mind-bg)',  color:'var(--tag-mind)'  },
  supp:  { bg:'var(--tag-supp-bg)',  color:'var(--tag-supp)'  },
  test:  { bg:'var(--tag-test-bg)',  color:'var(--tag-test)'  },
};

function todayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function DashboardPage() {
  const todayName = getTodayName();
  const [activeDay, setActiveDay] = useState<Day>(todayName);
  const [checked, setChecked] = useState<Record<string, Record<number, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const date = todayDate();

  const loadProgress = useCallback(async (day: Day) => {
    try {
      const res = await fetch(`/api/user/progress?day=${day}&date=${date}`);
      if (res.ok) {
        const { state } = await res.json();
        setChecked(prev => ({ ...prev, [day]: state || {} }));
      }
    } catch {}
  }, [date]);

  useEffect(() => { loadProgress(activeDay); }, [activeDay, loadProgress]);

  async function toggle(day: Day, taskIndex: number) {
    const current = checked[day]?.[taskIndex] ?? false;
    const next = !current;
    setChecked(prev => ({ ...prev, [day]: { ...(prev[day] || {}), [taskIndex]: next } }));
    setSaving(true);
    try {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, date, taskIndex, done: next }),
      });
    } catch {}
    setSaving(false);
  }

  async function resetDay(day: Day) {
    const sections = getSections(day);
    let idx = 0;
    const indices: number[] = [];
    sections.forEach(s => s.tasks.forEach(() => { indices.push(idx); idx++; }));
    setChecked(prev => ({ ...prev, [day]: {} }));
    for (const i of indices) {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, date, taskIndex: i, done: false }),
      });
    }
  }

  function getDoneCount(day: Day) {
    return Object.values(checked[day] || {}).filter(Boolean).length;
  }

  const sections = getSections(activeDay);
  const total = getTotalTasks(activeDay);
  const done = getDoneCount(activeDay);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const workout = WORKOUTS[activeDay];

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <div style={{display:'flex',alignItems:'baseline',gap:12,flexWrap:'wrap'}}>
          <h1 style={{fontFamily:"'Fraunces',serif",fontSize:'2rem',fontWeight:300,fontStyle:'italic',letterSpacing:'-0.02em'}}>
            Daily Protocol
          </h1>
          {saving && <span style={{fontSize:10,color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase'}}>Saving...</span>}
        </div>
        <p style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase',marginTop:4}}>
          Blueprint Health
        </p>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--border)',marginBottom:'1.5rem',overflowX:'auto'}}>
        {DAYS.map(day => {
          const active = day === activeDay;
          const isToday = day === todayName;
          const d = getDoneCount(day);
          const t = getTotalTasks(day);
          return (
            <button key={day} onClick={() => setActiveDay(day)}
              style={{flexShrink:0,padding:'0.8rem 1rem 0.6rem',background:'none',border:'none',
                borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                color: active ? 'var(--accent)' : 'var(--muted)',
                fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',
                display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer',fontFamily:'inherit'}}>
              <span style={{display:'flex',alignItems:'center',gap:4}}>
                {day.slice(0,3)}
                {isToday && <span style={{width:5,height:5,borderRadius:'50%',background:'var(--accent)',display:'inline-block'}}/>}
              </span>
              <span style={{fontSize:10,color:active?'var(--accent)':'var(--muted2)'}}>
                {d === t && t > 0 ? 'done' : d + '/' + t}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem',flexWrap:'wrap',gap:12}}>
        <div style={{fontFamily:"'Fraunces',serif",fontSize:'1.4rem',fontWeight:300,fontStyle:'italic'}}>
          {activeDay} — {workout ? workout : 'Rest & Recovery'}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:4}}>
              {done} / {total} done
            </div>
            <div style={{width:140,height:3,background:'var(--muted2)',borderRadius:99,overflow:'hidden'}}>
              <div style={{height:'100%',width:pct+'%',background:'var(--accent)',borderRadius:99,transition:'width 0.4s'}}/>
            </div>
          </div>
          <button onClick={() => resetDay(activeDay)}
            style={{background:'none',border:'1px solid var(--border)',borderRadius:99,padding:'5px 12px',
              fontSize:10,color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase',fontFamily:'inherit',cursor:'pointer'}}>
            Reset
          </button>
        </div>
      </div>

      {sections.map((section, si) => {
        let taskIndexOffset = 0;
        for (let i = 0; i < si; i++) {
          taskIndexOffset += sections[i].tasks.length;
        }
        return (
          <div key={section.section}>
            <div style={{fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--muted)',
              margin:'1.5rem 0 0.5rem',display:'flex',alignItems:'center',gap:10}}>
              {section.section}
              <div style={{flex:1,height:1,background:'var(--border)'}}/>
            </div>
            {section.tasks.map((task, ti) => {
              const idx = taskIndexOffset + ti;
              const isDone = checked[activeDay]?.[idx] ?? false;
              return (
                <div key={idx} onClick={() => toggle(activeDay, idx)}
                  style={{display:'flex',alignItems:'flex-start',gap:12,padding:'10px 14px',
                    borderRadius:'var(--radius)',border:'1px solid var(--border)',background:'var(--surface)',
                    marginBottom:5,cursor:'pointer',opacity:isDone ? 0.45 : 1,transition:'background 0.12s'}}>
                  <div style={{width:17,height:17,borderRadius:'50%',flexShrink:0,marginTop:2,
                    border: isDone ? 'none' : '1.5px solid var(--muted2)',
                    background: isDone ? 'var(--accent)' : 'transparent',
                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {isDone && (
                      <svg width="8" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'baseline',gap:6,flexWrap:'wrap',marginBottom:3}}>
                      <span style={{fontSize:13,lineHeight:1.4,textDecoration: isDone ? 'line-through' : 'none'}}>
                        {task.title}
                      </span>
                      {task.tags.map(tag => {
                        const s = TAG_STYLES[tag] || {bg:'transparent',color:'var(--muted)'};
                        return (
                          <span key={tag} style={{fontSize:10,padding:'1px 7px',borderRadius:99,whiteSpace:'nowrap',
                            background:s.bg,color:s.color,letterSpacing:'0.04em',fontWeight:500}}>
                            {tag === 'test' ? 'Testosterone' : tag === 'supp' ? 'Supplement' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </span>
                        );
                      })}
                    </div>
                    <div style={{fontSize:11,color:'var(--muted)',lineHeight:1.5}}>{task.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
