'use client';
import { useState, useEffect } from 'react';

interface Program {
  id: string;
  title: string;
  description?: string;
  days: DayProgram[];
  createdAt: string;
}

interface DayProgram {
  day: string;
  focus: string;
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  note?: string;
}

const EMPTY_EXERCISE: Exercise = { name:'', sets:'3', reps:'8', note:'' };
const WEEK_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [view, setView] = useState<'list'|'create'|'detail'>('list');
  const [selected, setSelected] = useState<Program|null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<DayProgram[]>(
    WEEK_DAYS.map(d => ({ day:d, focus:'', exercises:[{...EMPTY_EXERCISE}] }))
  );

  useEffect(() => { loadPrograms(); }, []);

  async function loadPrograms() {
    try {
      const res = await fetch('/api/user/programs');
      if (res.ok) { const d = await res.json(); setPrograms(d.programs || []); }
    } catch {}
  }

  async function saveProgram() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/user/programs', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ title: title.trim(), description: description.trim(), days }),
      });
      if (res.ok) {
        await loadPrograms();
        setView('list');
        setTitle(''); setDescription('');
        setDays(WEEK_DAYS.map(d => ({ day:d, focus:'', exercises:[{...EMPTY_EXERCISE}] })));
      }
    } catch {}
    setSaving(false);
  }

  async function deleteProgram(id: string) {
    if (!confirm('Delete this program?')) return;
    await fetch(`/api/user/programs?id=${id}`, { method:'DELETE' });
    await loadPrograms();
    if (selected?.id === id) setView('list');
  }

  function updateDay(dayIdx: number, field: keyof DayProgram, value: string) {
    setDays(prev => prev.map((d,i) => i===dayIdx ? {...d, [field]:value} : d));
  }

  function addExercise(dayIdx: number) {
    setDays(prev => prev.map((d,i) => i===dayIdx ? {...d, exercises:[...d.exercises,{...EMPTY_EXERCISE}]} : d));
  }

  function updateExercise(dayIdx: number, exIdx: number, field: keyof Exercise, value: string) {
    setDays(prev => prev.map((d,i) => i!==dayIdx ? d : {
      ...d, exercises: d.exercises.map((e,j) => j===exIdx ? {...e,[field]:value} : e)
    }));
  }

  function removeExercise(dayIdx: number, exIdx: number) {
    setDays(prev => prev.map((d,i) => i!==dayIdx ? d : {
      ...d, exercises: d.exercises.filter((_,j) => j!==exIdx)
    }));
  }

  if (view === 'create') return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem'}}>
        <button onClick={()=>setView('list')} style={{background:'none',border:'none',color:'var(--muted)',fontSize:13,padding:0,fontFamily:'inherit'}}>← Back</button>
        <h1 style={{fontFamily:"'Fraunces',serif",fontSize:'1.8rem',fontWeight:300,fontStyle:'italic'}}>New Program</h1>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'1rem',maxWidth:640}}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase'}}>Program Name *</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. 12-Week Strength Builder"/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase'}}>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Goals, notes, duration…" rows={3} style={{resize:'vertical'}}/>
        </div>
      </div>

      {/* Days */}
      <div style={{marginTop:'2rem'}}>
        <div style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'1rem'}}>Weekly Schedule</div>
        {days.map((day, di) => (
          <div key={day.day} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'1.25rem',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1rem',flexWrap:'wrap'}}>
              <span style={{fontSize:13,fontWeight:500,color:'var(--text)',minWidth:80}}>{day.day}</span>
              <input value={day.focus} onChange={e=>updateDay(di,'focus',e.target.value)}
                placeholder="Focus (e.g. Chest & Triceps, Rest…)" style={{flex:1,minWidth:160,padding:'7px 12px',fontSize:12}}/>
            </div>

            {day.exercises.map((ex, ei) => (
              <div key={ei} style={{display:'grid',gridTemplateColumns:'1fr 60px 60px auto',gap:8,marginBottom:8,alignItems:'center'}}>
                <input value={ex.name} onChange={e=>updateExercise(di,ei,'name',e.target.value)} placeholder="Exercise name" style={{padding:'7px 12px',fontSize:12}}/>
                <input value={ex.sets} onChange={e=>updateExercise(di,ei,'sets',e.target.value)} placeholder="Sets" style={{padding:'7px 8px',fontSize:12,textAlign:'center'}}/>
                <input value={ex.reps} onChange={e=>updateExercise(di,ei,'reps',e.target.value)} placeholder="Reps" style={{padding:'7px 8px',fontSize:12,textAlign:'center'}}/>
                <button onClick={()=>removeExercise(di,ei)} style={{background:'none',border:'none',color:'var(--muted)',fontSize:16,padding:'0 4px',lineHeight:1}}>×</button>
              </div>
            ))}
            <button onClick={()=>addExercise(di)}
              style={{background:'none',border:'1px dashed var(--border)',borderRadius:'var(--radius)',
                padding:'6px 12px',fontSize:11,color:'var(--muted)',letterSpacing:'0.06em',fontFamily:'inherit',
                marginTop:4,width:'100%',transition:'border-color 0.15s,color 0.15s'}}>
              + Add exercise
            </button>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:10,marginTop:'1.5rem'}}>
        <button onClick={saveProgram} disabled={!title.trim()||saving}
          style={{background:'var(--accent)',color:'#0d0d0d',border:'none',borderRadius:'var(--radius)',
            padding:'11px 24px',fontSize:13,fontWeight:500,fontFamily:'inherit',
            opacity:(!title.trim()||saving)?0.5:1,cursor:(!title.trim()||saving)?'not-allowed':'pointer'}}>
          {saving ? 'Saving…' : 'Save Program'}
        </button>
        <button onClick={()=>setView('list')}
          style={{background:'none',border:'1px solid var(--border)',borderRadius:'var(--radius)',
            padding:'11px 18px',fontSize:13,color:'var(--muted)',fontFamily:'inherit'}}>
          Cancel
        </button>
      </div>
    </div>
  );

  if (view === 'detail' && selected) return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <button onClick={()=>setView('list')} style={{background:'none',border:'none',color:'var(--muted)',fontSize:13,padding:0,fontFamily:'inherit'}}>← Back</button>
        <h1 style={{fontFamily:"'Fraunces',serif",fontSize:'1.8rem',fontWeight:300,fontStyle:'italic',flex:1}}>{selected.title}</h1>
        <button onClick={()=>deleteProgram(selected.id)}
          style={{background:'none',border:'1px solid rgba(224,122,122,0.3)',borderRadius:'var(--radius)',
            padding:'6px 14px',fontSize:11,color:'#e07a7a',fontFamily:'inherit',letterSpacing:'0.04em'}}>
          Delete
        </button>
      </div>
      {selected.description && (
        <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.6,marginBottom:'1.5rem',maxWidth:580}}>{selected.description}</p>
      )}
      {selected.days.map(day => (
        <div key={day.day} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'1.25rem',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:'0.75rem'}}>
            <span style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{day.day}</span>
            {day.focus && <span style={{fontSize:11,color:'var(--accent)'}}>{day.focus}</span>}
          </div>
          {day.exercises.filter(e=>e.name).length > 0
            ? <table style={{width:'100%',fontSize:12,borderCollapse:'collapse'}}>
                <thead><tr>
                  {['Exercise','Sets','Reps'].map(h=><th key={h} style={{textAlign:'left',padding:'4px 8px 8px',fontSize:10,color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:400}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {day.exercises.filter(e=>e.name).map((ex,i)=>(
                    <tr key={i} style={{borderTop:'1px solid var(--border)'}}>
                      <td style={{padding:'7px 8px',color:'var(--text)'}}>{ex.name}</td>
                      <td style={{padding:'7px 8px',color:'var(--muted)'}}>{ex.sets}</td>
                      <td style={{padding:'7px 8px',color:'var(--muted)'}}>{ex.reps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            : <span style={{fontSize:12,color:'var(--muted2)'}}>Rest day</span>
          }
        </div>
      ))}
    </div>
  );

  // List view
  return (
    <div>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'1.5rem',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Fraunces',serif",fontSize:'2rem',fontWeight:300,fontStyle:'italic',letterSpacing:'-0.02em'}}>
            Training Programs
          </h1>
          <p style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase',marginTop:4}}>
            Create and manage your custom workout programs
          </p>
        </div>
        <button onClick={()=>setView('create')}
          style={{background:'var(--accent)',color:'#0d0d0d',border:'none',borderRadius:'var(--radius)',
            padding:'10px 18px',fontSize:12,fontWeight:500,letterSpacing:'0.04em',fontFamily:'inherit'}}>
          + New Program
        </button>
      </div>

      {programs.length === 0
        ? (
          <div style={{textAlign:'center',padding:'4rem 2rem',border:'1px dashed var(--border)',borderRadius:'var(--radius-lg)'}}>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:'1.4rem',fontWeight:300,fontStyle:'italic',color:'var(--muted)',marginBottom:8}}>No programs yet</div>
            <p style={{fontSize:12,color:'var(--muted2)',marginBottom:'1.5rem'}}>Create your first training program to get started.</p>
            <button onClick={()=>setView('create')}
              style={{background:'var(--accent)',color:'#0d0d0d',border:'none',borderRadius:'var(--radius)',
                padding:'10px 18px',fontSize:12,fontWeight:500,fontFamily:'inherit'}}>
              Create Program
            </button>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12}}>
            {programs.map(p => (
              <div key={p.id}
                style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',
                  padding:'1.25rem',cursor:'pointer',transition:'border-color 0.15s'}}
                onClick={()=>{setSelected(p);setView('detail');}}
                onMouseOver={e=>(e.currentTarget.style.borderColor='var(--border-hover)')}
                onMouseOut={e=>(e.currentTarget.style.borderColor='var(--border)')}>
                <div style={{fontSize:15,fontWeight:500,color:'var(--text)',marginBottom:6,lineHeight:1.3}}>{p.title}</div>
                {p.description && <p style={{fontSize:12,color:'var(--muted)',lineHeight:1.5,marginBottom:10}}>{p.description.slice(0,80)}{p.description.length>80?'…':''}</p>}
                <div style={{fontSize:10,color:'var(--muted2)',letterSpacing:'0.06em',textTransform:'uppercase'}}>
                  {p.days.filter(d=>d.exercises.some(e=>e.name)).length} active days
                  · Created {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
