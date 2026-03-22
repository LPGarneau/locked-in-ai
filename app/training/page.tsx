'use client';
import { useState } from 'react';
import { DAYS, Day, WORKOUTS, getSections, getTodayName } from '@/lib/tasks';

const WORKOUT_INFO: Record<string, { color: string; bg: string; muscles: string; tips: string[] }> = {
  Legs: {
    color:'var(--tag-move)', bg:'var(--tag-move-bg)',
    muscles:'Quads, Hamstrings, Glutes, Calves',
    tips:['Drive through the floor on squats','Keep chest up throughout all movements','Control the negative on every rep','Rest 2–3 min between heavy compound sets'],
  },
  Push: {
    color:'var(--tag-supp)', bg:'var(--tag-supp-bg)',
    muscles:'Chest, Shoulders, Triceps',
    tips:['Retract scapula on all press movements','Full ROM on lateral raises for shoulder health','Lockout triceps completely at top of extensions','Slow eccentric (3 sec down) on isolation work'],
  },
  Pull: {
    color:'var(--tag-sleep)', bg:'var(--tag-sleep-bg)',
    muscles:'Back, Biceps, Rear Delts',
    tips:['Initiate every pull with the lats, not the arms','Drive elbows down and back on rows','Full hang at bottom of pull-ups','Supinate wrists on curls for peak contraction'],
  },
  Upper: {
    color:'var(--tag-diet)', bg:'var(--tag-diet-bg)',
    muscles:'Chest, Back, Shoulders, Arms',
    tips:['Balance pressing and pulling volume','Hit rear delts with face pulls every session','Control shoulder external rotation on overhead press','Finish with arms if energy allows'],
  },
  Lower: {
    color:'var(--tag-test)', bg:'var(--tag-test-bg)',
    muscles:'Quads, Hamstrings, Glutes, Core',
    tips:['Pause at bottom of split squats for stability','Keep shin vertical on hip hinges','Squeeze glutes hard at top of hip thrusts','Single-leg work reveals and fixes imbalances'],
  },
};

export default function TrainingPage() {
  const today = getTodayName();
  const [activeDay, setActiveDay] = useState<Day>(today);
  const workout = WORKOUTS[activeDay];
  const info = workout ? WORKOUT_INFO[workout] : null;
  const sections = getSections(activeDay);
  const strengthSection = sections.find(s => s.section.includes('strength training'));

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontFamily:"'Fraunces',serif",fontSize:'2rem',fontWeight:300,fontStyle:'italic',letterSpacing:'-0.02em'}}>
          Training
        </h1>
        <p style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase',marginTop:4}}>
          Blueprint weekly strength split
        </p>
      </div>

      {/* Weekly overview strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6,marginBottom:'1.5rem'}}>
        {DAYS.map(day => {
          const w = WORKOUTS[day];
          const active = day === activeDay;
          const isToday = day === today;
          const info = w ? WORKOUT_INFO[w] : null;
          return (
            <button key={day}
              onClick={()=>setActiveDay(day)}
              style={{background: active ? (info?.bg || 'var(--surface2)') : 'var(--surface)',
                border:`1px solid ${active ? (info?.color || 'var(--border-hover)') : 'var(--border)'}`,
                borderRadius:'var(--radius)',padding:'10px 4px',
                display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                cursor:'pointer',transition:'all 0.15s',fontFamily:'inherit'}}>
              <span style={{fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',
                color: active ? (info?.color || 'var(--text)') : (isToday ? 'var(--accent)' : 'var(--muted)'),fontWeight: isToday?500:400}}>
                {day.slice(0,3)}
              </span>
              <span style={{fontSize:9,color: active ? (info?.color||'var(--muted)') : 'var(--muted2)',letterSpacing:'0.04em',textTransform:'uppercase'}}>
                {w || 'Rest'}
              </span>
            </button>
          );
        })}
      </div>

      {!workout ? (
        <div style={{textAlign:'center',padding:'3rem 2rem',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',background:'var(--surface)'}}>
          <div style={{fontFamily:"'Fraunces',serif",fontSize:'1.6rem',fontWeight:300,fontStyle:'italic',color:'var(--muted)',marginBottom:8}}>
            Rest & Recovery
          </div>
          <p style={{fontSize:13,color:'var(--muted2)',lineHeight:1.7,maxWidth:420,margin:'0 auto'}}>
            Recovery is where adaptation happens. Today focus on sleep quality, protein intake, low-stress movement like walking, and managing stress levels.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,maxWidth:500,margin:'1.5rem auto 0'}}>
            {['8+ hrs sleep','100g+ protein','30 min walk','10 min meditation'].map(tip=>(
              <div key={tip} style={{background:'var(--surface2)',borderRadius:'var(--radius)',padding:'10px',fontSize:11,color:'var(--muted)',textAlign:'center',letterSpacing:'0.04em'}}>
                {tip}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {/* Left: workout details */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {/* Day header */}
            <div style={{background: info?.bg, border:`1px solid ${info?.color}33`,borderRadius:'var(--radius-lg)',padding:'1.25rem'}}>
              <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:6}}>
                <span style={{fontFamily:"'Fraunces',serif",fontSize:'1.5rem',fontWeight:300,fontStyle:'italic',color:info?.color}}>{workout}</span>
                <span style={{fontSize:10,color:info?.color,letterSpacing:'0.08em',textTransform:'uppercase',opacity:0.7}}>day</span>
              </div>
              <div style={{fontSize:12,color:'var(--muted)',marginBottom:8}}>Primary muscles: <span style={{color:'var(--text)'}}>{info?.muscles}</span></div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {(info?.tips||[]).map((tip,i)=>(
                  <div key={i} style={{fontSize:11,color:info?.color,background:`${info?.color}18`,padding:'3px 10px',borderRadius:99,lineHeight:1.5}}>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercises */}
            {strengthSection && (
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'1.25rem'}}>
                <div style={{fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'1rem'}}>Today's Exercises</div>
                {strengthSection.tasks.map((task, i) => (
                  <div key={i} style={{padding:'10px 0',borderBottom: i < strengthSection.tasks.length-1 ? '1px solid var(--border)' : 'none'}}>
                    <div style={{fontSize:13,color:'var(--text)',marginBottom:3,lineHeight:1.4}}>{task.title}</div>
                    <div style={{fontSize:11,color:'var(--muted)',lineHeight:1.5}}>{task.note}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: weekly volume + blueprint principles */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'1.25rem'}}>
              <div style={{fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'1rem'}}>Weekly Blueprint Split</div>
              {DAYS.map(day => {
                const w = WORKOUTS[day];
                const inf = w ? WORKOUT_INFO[w] : null;
                return (
                  <div key={day} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
                    <span style={{fontSize:11,color:'var(--muted)',minWidth:70,letterSpacing:'0.04em'}}>{day}</span>
                    <span style={{fontSize:12,color: inf?.color || 'var(--muted2)',flex:1}}>{w || 'Rest'}</span>
                    {w && inf && <span style={{fontSize:10,color:inf.color,background:inf.bg,padding:'1px 8px',borderRadius:99,letterSpacing:'0.04em'}}>{inf.muscles.split(',')[0]}</span>}
                  </div>
                );
              })}
            </div>

            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'1.25rem'}}>
              <div style={{fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'1rem'}}>Blueprint Training Principles</div>
              {[
                {label:'Volume target','value':'6 hrs/week'},
                {label:'HIIT weekly','value':'75 min'},
                {label:'Strength sessions','value':'3×/week'},
                {label:'Rest between sets','value':'2–3 min (compound)'},
                {label:'Progressive overload','value':'Add weight when top set RPE < 8'},
                {label:'Recovery priority','value':'Sleep > everything'},
              ].map(item=>(
                <div key={item.label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border)',fontSize:12}}>
                  <span style={{color:'var(--muted)'}}>{item.label}</span>
                  <span style={{color:'var(--text)'}}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
