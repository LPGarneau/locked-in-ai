'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const NAV = [
  { href:'/dashboard', label:'Today', icon:'◉' },
  { href:'/shop',      label:'Shop',  icon:'◈' },
  { href:'/programs',  label:'Programs', icon:'◧' },
  { href:'/training',  label:'Training', icon:'◫' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || '';

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth');
  }, [status, router]);

  if (status === 'loading') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontSize:12,color:'var(--muted)',letterSpacing:'0.08em'}}>LOADING...</div>
    </div>
  );
  if (!session) return null;

  const user = session.user;

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:40}}/>
      )}

      <aside style={{
        width:220,flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border)',
        display:'flex',flexDirection:'column',padding:'1.5rem 1rem',
        position:'fixed',top:0,left:0,height:'100vh',zIndex:50,
      }}>
        <div style={{marginBottom:'2rem',paddingLeft:4}}>
          {logoUrl
            ? <Image src={logoUrl} alt="Logo" width={110} height={36} style={{objectFit:'contain'}}/>
            : <div style={{fontFamily:"'Fraunces',serif",fontSize:'1.2rem',fontWeight:300,fontStyle:'italic',color:'var(--accent)'}}>
                Locked In <span style={{color:'var(--text)'}}>AI</span>
              </div>
          }
        </div>

        <nav style={{display:'flex',flexDirection:'column',gap:4,flex:1}}>
          {NAV.map(n => {
            const active = pathname.startsWith(n.href);
            return (
              <a key={n.href} href={n.href}
                style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',
                  borderRadius:'var(--radius)',fontSize:13,letterSpacing:'0.04em',
                  color: active ? '#0d0d0d' : 'var(--muted)',
                  background: active ? 'var(--accent)' : 'transparent',
                  transition:'background 0.15s,color 0.15s',fontWeight: active ? 500 : 400,
                  textDecoration:'none'}}>
                <span style={{fontSize:14}}>{n.icon}</span>
                {n.label}
              </a>
            );
          })}
        </nav>

        <div style={{borderTop:'1px solid var(--border)',paddingTop:'1rem',marginTop:'1rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            {user?.image
              ? <img src={user.image} width={30} height={30} style={{borderRadius:'50%'}} alt="avatar"/>
              : <div style={{width:30,height:30,borderRadius:'50%',background:'var(--surface2)',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'var(--muted)'}}>
                  {(user?.name || user?.email || '?')[0].toUpperCase()}
                </div>
            }
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {user?.name || 'User'}
              </div>
              <div style={{fontSize:10,color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {user?.email}
              </div>
            </div>
          </div>
          <button onClick={() => signOut({callbackUrl:'/auth'})}
            style={{width:'100%',background:'none',border:'1px solid var(--border)',borderRadius:'var(--radius)',
              padding:'7px',fontSize:11,color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase',
              cursor:'pointer',fontFamily:'inherit',transition:'border-color 0.15s,color 0.15s'}}>
            Sign out
          </button>
        </div>
      </aside>

      <main style={{flex:1,marginLeft:220,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <div style={{flex:1,padding:'2rem 1.5rem',maxWidth:900,width:'100%',margin:'0 auto'}}>
          {children}
        </div>
      </main>
    </div>
  );
}
