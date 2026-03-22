'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'register') {
        const res = await fetch('/api/user/register', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ name, email, password }),
        });
        const d = await res.json();
        if (!res.ok) { setError(d.error); setLoading(false); return; }
      }
      const result = await signIn('credentials', { email, password, redirect:false });
      if (result?.error) { setError('Invalid email or password.'); setLoading(false); }
      else router.push('/dashboard');
    } catch { setError('Something went wrong.'); setLoading(false); }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem 1rem'}}>
      <div style={{width:'100%',maxWidth:400,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'2.5rem 2rem'}}>

        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:'0.5rem'}}>
          {logoUrl
            ? <Image src={logoUrl} alt="Logo" width={120} height={48} style={{objectFit:'contain',margin:'0 auto'}} />
            : <div style={{fontFamily:"'Fraunces',serif",fontSize:'2rem',fontWeight:300,fontStyle:'italic',color:'var(--accent)',letterSpacing:'-0.02em'}}>
                Locked In <span style={{color:'var(--text)'}}>AI</span>
              </div>
          }
        </div>
        <p style={{textAlign:'center',fontSize:11,color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'2rem'}}>
          {mode === 'login' ? 'Sign in to your protocol' : 'Create your free account'}
        </p>

        {/* Google */}
        <button
          onClick={() => signIn('google', { callbackUrl:'/dashboard' })}
          style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:10,
            background:'var(--surface2)',border:'1px solid var(--border-hover)',borderRadius:'var(--radius)',
            padding:'11px 14px',fontSize:13,color:'var(--text)',marginBottom:'1.25rem',transition:'background 0.15s'}}
          onMouseOver={e => (e.currentTarget.style.background='#252525')}
          onMouseOut={e => (e.currentTarget.style.background='var(--surface2)')}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.2C9.5 36.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C41.2 35.2 44 30 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
          Continue with Google
        </button>

        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.25rem'}}>
          <div style={{flex:1,height:1,background:'var(--border)'}}/>
          <span style={{fontSize:11,color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase'}}>or</span>
          <div style={{flex:1,height:1,background:'var(--border)'}}/>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.9rem'}}>
          {mode === 'register' && (
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              <label style={{fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--muted)'}}>Name</label>
              <input type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/>
            </div>
          )}
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            <label style={{fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--muted)'}}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            <label style={{fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--muted)'}}>Password</label>
            <input type="password" placeholder={mode==='register'?'At least 8 characters':'••••••••'} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete={mode==='login'?'current-password':'new-password'}/>
          </div>
          {error && (
            <div style={{fontSize:12,color:'#e07a7a',padding:'8px 12px',background:'rgba(224,122,122,0.08)',border:'1px solid rgba(224,122,122,0.2)',borderRadius:'var(--radius)'}}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{background:'var(--accent)',color:'#0d0d0d',border:'none',borderRadius:'var(--radius)',
              padding:'12px',fontSize:13,fontWeight:500,letterSpacing:'0.04em',
              opacity:loading?0.5:1,cursor:loading?'not-allowed':'pointer',marginTop:4,fontFamily:'inherit'}}>
            {loading ? 'Please wait…' : mode==='login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{textAlign:'center',fontSize:12,color:'var(--muted)',marginTop:'1.5rem'}}>
          {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button"
            onClick={()=>{setMode(mode==='login'?'register':'login');setError('');}}
            style={{background:'none',border:'none',color:'var(--accent)',fontSize:12,padding:0,fontFamily:'inherit'}}>
            {mode==='login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
