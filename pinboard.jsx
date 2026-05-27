// יומן · Pinboard prototype
// Interactive Hi-fi V1 — Keep-style. Hebrew RTL. Local-only.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── seed data ─────────────────────────────────────────────
const SEED_PROJECTS = [
  { id:'orders',    name:'אפליקציית הזמנות', emoji:'📦' },
  { id:'portfolio', name:'תיק עבודות',       emoji:'🎨' },
  { id:'book',      name:'ספר ילדים',         emoji:'📖' },
  { id:'course',    name:'קורס AI',           emoji:'🤖' },
  { id:'house',     name:'הבית החדש',         emoji:'🏠' },
  { id:'inbox',     name:'נכנס',              emoji:'📥' },
];

const TAGS = [
  { id:'idea',  he:'רעיון',    cls:'td-idea'  },
  { id:'todo',  he:'לעשות',    cls:'td-todo'  },
  { id:'meet',  he:'פגישה',    cls:'td-meet'  },
  { id:'block', he:'חסם',      cls:'td-block' },
  { id:'mood',  he:'מצב רוח',  cls:'td-mood'  },
  { id:'work',  he:'עבודה',    cls:'td-work'  },
  { id:'read',  he:'לקרוא',    cls:'td-read'  },
];

const COLORS = [
  { id:'white',   v:'var(--n-white)',   label:'לבן'    },
  { id:'yellow',  v:'var(--n-yellow)',  label:'צהוב'   },
  { id:'amber',   v:'var(--n-amber)',   label:'ענבר'   },
  { id:'peach',   v:'var(--n-peach)',   label:'אפרסק'  },
  { id:'rose',    v:'var(--n-rose)',    label:'ורד'    },
  { id:'pink',    v:'var(--n-pink)',    label:'ורוד'   },
  { id:'lavender',v:'var(--n-lavender)',label:'לבנדר' },
  { id:'blue',    v:'var(--n-blue)',    label:'תכלת'   },
  { id:'teal',    v:'var(--n-teal)',    label:'טורקיז' },
  { id:'green',   v:'var(--n-green)',   label:'ירוק'   },
  { id:'gray',    v:'var(--n-gray)',    label:'אפור'   },
];

const NOW = new Date();
const isoDaysAgo = (d) => {
  const x = new Date(NOW); x.setDate(x.getDate()-d);
  return x.toISOString();
};
const hebDate = (iso) => {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2,'0');
  const mon = String(d.getMonth()+1).padStart(2,'0');
  return `${day}/${mon}`;
};

const SEED_NOTES = [
  { id:'n1',  proj:'orders',    color:'yellow', pinned:true,
    title:'ארכיטקטורת DB',           sub:'Postgres או SQLite?',
    body:'צפי 1k-10k רשומות. SQLite עם WAL מספיק. אבל אם נרצה אנליטיקה מורכבת — Postgres עדיף.',
    tags:['idea','work'], created: isoDaysAgo(0) },
  { id:'n2',  proj:'portfolio', color:'pink', pinned:true,
    title:'פגישה עם דנה',            sub:'לוגו לתיק עבודות',
    body:'הציגה 3 קונספטים. השני (מונוגרמה מינימליסטית) הכי קרוב לכיוון שדמיינתי.\n\nלבקש גם וריאציה חמה יותר.',
    tags:['meet'], created: isoDaysAgo(1) },
  { id:'n3',  proj:'book',      color:'green',
    title:'להזמין נייר לעטיפה',
    checklist:[
      {t:'Hahnemühle 230gsm', done:true},
      {t:'גודל גליון 70×100', done:true},
      {t:'50 גליונות', done:false},
      {t:'בדיקת מחיר משלוח', done:false},
    ],
    tags:['todo'], created: isoDaysAgo(1) },
  { id:'n4',  proj:'course',    color:'rose',
    title:'חסם: API מחזיר 429',
    body:'לבדוק rate limits מול OpenAI. אולי לעבור ל-Anthropic או להוסיף תור.',
    tags:['block'], created: isoDaysAgo(2) },
  { id:'n5',  proj:'course',    color:'blue',
    title:'פתיחה לפרק 3',            sub:'נסה אחרת',
    body:'להתחיל מ-demo חי במקום מתאוריה. אנשים נדלקים על "תראה לי", לא על "תסביר לי".',
    tags:['idea'], created: isoDaysAgo(2) },
  { id:'n6',  proj:'house',     color:'peach',
    title:'הקבלן השני — המטבח',
    body:'הצעת המחיר 18% נמוכה. לבקש 2 ממליצים ולוודא ביטוח אחריות.',
    tags:['todo','work'], created: isoDaysAgo(3) },
  { id:'n7',  proj:'inbox',     color:'lavender',
    title:'לקרוא',
    body:"\"Show Your Work\" — אוסטין קליאון. ממליצים בכל מקום.",
    tags:['read','idea'], created: isoDaysAgo(3) },
  { id:'n8',  proj:'inbox',     color:'teal',
    title:'מצב רוח השבוע',
    body:'עייף אבל מרוצה. הסכימה של ה-DB סוף-סוף סגורה. שבוע הבא — להתחיל לכתוב את ה-handlers.',
    tags:['mood'], created: isoDaysAgo(4) },
  { id:'n9',  proj:'orders',    color:'white',
    title:'TODO ספרינט הקרוב',
    checklist:[
      {t:'סכמת DB סופית', done:true},
      {t:'POST /orders', done:true},
      {t:'GET /orders/:id', done:false},
      {t:'webhook ל-Stripe', done:false},
      {t:'מסך הזמנות אדמין', done:false},
    ],
    tags:['todo','work'], created: isoDaysAgo(4) },
  { id:'n10', proj:'book',      color:'yellow',
    title:'שם זמני: "הירח שאיבד את הצל"',
    body:'אולי. הילדים בבחינות לא הגיבו טוב ל"לילה ארוך". לחזור לסיעור.',
    tags:['idea'], created: isoDaysAgo(5) },
  { id:'n11', proj:'portfolio', color:'amber',
    title:'דפים שצריך לצלם מחדש',
    checklist:[
      {t:'דף הבית — גרסה אחרונה', done:false},
      {t:'מסך about', done:false},
      {t:'גלריה — 4 פרויקטים', done:false},
    ],
    tags:['todo'], created: isoDaysAgo(6) },
  { id:'n12', proj:'house',     color:'gray',
    title:'מדידות גובה תקרה',
    sub:'סלון: 2.71 · חדר שינה: 2.68',
    body:'לקחתי כפול ליתר בטחון. לוודא עם המעצבת לפני הזמנת המנורות.',
    tags:[], created: isoDaysAgo(7) },
];

// ─── persistence ───────────────────────────────────────────
const LS_KEY = 'pinboard.v1';
function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch{return null;}
}
function saveState(s){
  try{ localStorage.setItem(LS_KEY, JSON.stringify(s)); }catch{}
}

// ─── small atoms ───────────────────────────────────────────
function Avatar({ children }){ return <div className="avatar">{children}</div>; }
function TagDot({ id }){
  const t = TAGS.find(x=>x.id===id);
  return <span className={`tag-dot ${t?.cls||''}`}></span>;
}
function TagPill({ id }){
  const t = TAGS.find(x=>x.id===id); if(!t) return null;
  return (
    <span className="tag">
      <TagDot id={id} />
      {t.he}
    </span>
  );
}

// ─── color picker ──────────────────────────────────────────
function ColorRow({ value, onChange }){
  return (
    <div className="color-row" role="radiogroup" aria-label="צבע פתק">
      {COLORS.map(c => (
        <button
          key={c.id}
          className={`swatch ${c.id==='white'?'empty':''} ${value===c.id?'selected':''}`}
          style={c.id!=='white'?{background:c.v}:undefined}
          title={c.label}
          aria-label={c.label}
          aria-checked={value===c.id}
          role="radio"
          onClick={() => onChange(c.id)}
        />
      ))}
    </div>
  );
}

// ─── popover (project / tag pick) ──────────────────────────
function Popover({ anchorRef, onClose, children, align='start' }){
  const ref = useRef(null);
  const [pos, setPos] = useState({top:0, right:0});
  useEffect(() => {
    if(!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const parent = anchorRef.current.offsetParent?.getBoundingClientRect() || {top:0,left:0,right:0};
    setPos({
      top: r.bottom - (parent.top||0) + 4,
      right: (window.innerWidth - r.right) - 0,
    });
  }, [anchorRef]);
  useEffect(() => {
    const onDown = (e) => { if(ref.current && !ref.current.contains(e.target) && !anchorRef.current.contains(e.target)) onClose(); };
    const onEsc  = (e) => { if(e.key==='Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onEsc); };
  }, [onClose, anchorRef]);
  return (
    <div ref={ref} className="popover" style={{
      position:'fixed', top:`${anchorRef.current?.getBoundingClientRect().bottom + 4}px`,
      right:`${window.innerWidth - (anchorRef.current?.getBoundingClientRect().right || 0)}px`,
    }}>
      {children}
    </div>
  );
}

// ─── compose ───────────────────────────────────────────────
function Compose({ projects, onAdd, defaultProject }){
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [body, setBody] = useState('');
  const [color, setColor] = useState('white');
  const [proj, setProj] = useState(defaultProject || 'inbox');
  const [tags, setTags] = useState([]);
  const [pinned, setPinned] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [projOpen, setProjOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const titleRef = useRef(null);
  const projBtnRef = useRef(null);
  const tagBtnRef = useRef(null);

  useEffect(() => {
    if (defaultProject && !open) setProj(defaultProject);
  }, [defaultProject, open]);

  const reset = () => {
    setTitle(''); setSub(''); setBody(''); setColor('white');
    setTags([]); setPinned(false); setShowSub(false);
    setProj(defaultProject || 'inbox');
    setOpen(false);
  };

  const submit = () => {
    if(!title.trim() && !body.trim()) { reset(); return; }
    onAdd({
      id: 'n' + Date.now(),
      proj, color, pinned,
      title: title.trim() || '(ללא כותרת)',
      sub: sub.trim() || undefined,
      body: body.trim() || undefined,
      tags,
      created: new Date().toISOString(),
    });
    reset();
  };

  const toggleTag = (id) => setTags(prev => prev.includes(id) ? prev.filter(t=>t!==id) : [...prev, id]);

  const projObj = projects.find(p=>p.id===proj) || projects[0];

  if (!open) {
    return (
      <div className="compose-wrap">
        <div className="compose" onClick={() => { setOpen(true); setTimeout(()=>titleRef.current?.focus(), 0); }}>
          <div className="compose-collapsed">
            <span className="ph">פתק חדש…</span>
            <div className="actions">
              <button className="iconbtn" title="צ׳קליסט" onClick={(e)=>{e.stopPropagation(); setOpen(true); setBody(''); setTimeout(()=>titleRef.current?.focus(),0);}}>☐</button>
              <button className="iconbtn" title="פגישה" onClick={(e)=>{e.stopPropagation(); setOpen(true); setTags(['meet']); setTimeout(()=>titleRef.current?.focus(),0);}}>📅</button>
              <button className="iconbtn" title="חסם" onClick={(e)=>{e.stopPropagation(); setOpen(true); setTags(['block']); setColor('rose'); setTimeout(()=>titleRef.current?.focus(),0);}}>⚠</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="compose-wrap">
      <div className="compose" style={{background: color==='white' ? 'var(--surface)' : COLORS.find(c=>c.id===color)?.v}}>
        <div className="compose-expanded">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input
              ref={titleRef}
              className="title"
              placeholder="כותרת"
              value={title}
              onChange={e=>setTitle(e.target.value)}
              style={{color: color==='white' ? undefined : 'rgba(0,0,0,.92)'}}
              onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); (showSub ? null : setShowSub(true)); document.querySelector('.compose textarea.body')?.focus(); } }}
            />
            <button
              className="iconbtn" title={pinned?'בטל נעיצה':'נעץ'} aria-pressed={pinned}
              onClick={()=>setPinned(p=>!p)}
              style={{color: pinned? 'var(--ink)' : (color==='white' ? undefined : 'rgba(0,0,0,.55)')}}
            >{pinned ? '📌' : '📍'}</button>
          </div>
          {showSub ? (
            <input
              className="subtitle"
              placeholder="תת-כותרת"
              value={sub}
              onChange={e=>setSub(e.target.value)}
              style={{color: color==='white' ? undefined : 'rgba(0,0,0,.6)'}}
            />
          ) : (
            <button className="btn" style={{padding:'2px 6px',fontSize:11,color:color==='white'?'var(--ink3)':'rgba(0,0,0,.55)'}} onClick={()=>setShowSub(true)}>+ תת-כותרת</button>
          )}
          <textarea
            className="body"
            placeholder="כתיבת הפתק…"
            value={body}
            onChange={e=>setBody(e.target.value)}
            style={{color: color==='white' ? undefined : 'rgba(0,0,0,.78)'}}
            onKeyDown={e=>{ if((e.metaKey||e.ctrlKey) && e.key==='Enter') submit(); }}
          />
        </div>

        <ColorRow value={color} onChange={setColor} />

        <div className="footer">
          <button ref={projBtnRef} className="chip-select set" onClick={()=>setProjOpen(o=>!o)} aria-haspopup="listbox">
            <span>{projObj.emoji}</span>
            <span>{projObj.name}</span>
            <span style={{opacity:.5}}>▾</span>
          </button>

          <button ref={tagBtnRef} className={`chip-select ${tags.length?'set':''}`} onClick={()=>setTagOpen(o=>!o)} aria-haspopup="listbox">
            <span style={{fontSize:11}}>#</span>
            <span>{tags.length ? tags.map(t=>TAGS.find(x=>x.id===t)?.he).join(' · ') : 'תגיות'}</span>
            <span style={{opacity:.5}}>▾</span>
          </button>

          <span className="grow"></span>

          <span style={{fontSize:11,color: color==='white'?'var(--ink4)':'rgba(0,0,0,.45)'}}><kbd>⌘</kbd><kbd>↵</kbd> לשמירה</span>
          <button className="btn" onClick={reset}>ביטול</button>
          <button className="btn primary" onClick={submit}>שמור</button>
        </div>

        {projOpen && (
          <PopoverList anchorRef={projBtnRef} onClose={()=>setProjOpen(false)}>
            {projects.map(p => (
              <div key={p.id} className={`opt ${proj===p.id?'sel':''}`} onClick={()=>{ setProj(p.id); setProjOpen(false); }}>
                <span style={{fontSize:14}}>{p.emoji}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </PopoverList>
        )}

        {tagOpen && (
          <PopoverList anchorRef={tagBtnRef} onClose={()=>setTagOpen(false)}>
            {TAGS.map(t => (
              <div key={t.id} className="opt" onClick={()=>toggleTag(t.id)}>
                <input type="checkbox" readOnly checked={tags.includes(t.id)} style={{accentColor:'var(--accent)'}} />
                <TagDot id={t.id} />
                <span>{t.he}</span>
              </div>
            ))}
          </PopoverList>
        )}
      </div>
    </div>
  );
}

function PopoverList({ anchorRef, onClose, children }){
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (e) => { if(ref.current && !ref.current.contains(e.target) && !anchorRef.current?.contains(e.target)) onClose(); };
    const onEsc  = (e) => { if(e.key==='Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onEsc); };
  }, [onClose, anchorRef]);
  const r = anchorRef.current?.getBoundingClientRect();
  if(!r) return null;
  return (
    <div ref={ref} className="popover" style={{
      position:'fixed',
      top: r.bottom + 4,
      right: window.innerWidth - r.right,
    }}>{children}</div>
  );
}

// ─── note card ─────────────────────────────────────────────
function Note({ n, projects, onPin, onColor, onDelete, onToggleCheck, onTagToggle }){
  const [colorOpen, setColorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const colorBtnRef = useRef(null);
  const menuBtnRef = useRef(null);
  const p = projects.find(x=>x.id===n.proj) || projects[0];
  const bg = COLORS.find(c=>c.id===n.color)?.v || 'var(--n-white)';
  return (
    <div className="note" style={{background:bg}}>
      <button className={`pin-btn ${n.pinned?'pinned':''}`} title={n.pinned?'בטל נעיצה':'נעץ'} onClick={()=>onPin(n.id)}>
        {n.pinned ? '📌' : '📍'}
      </button>
      <div className="project-row">
        <span className="project-emoji">{p.emoji}</span>
        <span>{p.name}</span>
        <span style={{marginRight:'auto',color:'rgba(0,0,0,.45)'}}>{hebDate(n.created)}</span>
      </div>
      {n.title && <h3>{n.title}</h3>}
      {n.sub && <div className="sub">{n.sub}</div>}
      {n.body && <div className="body">{n.body}</div>}
      {Array.isArray(n.checklist) && (
        <div className="checklist">
          {n.checklist.map((c,i) => (
            <label key={i} className={`check ${c.done?'done':''}`}>
              <input type="checkbox" checked={!!c.done} onChange={()=>onToggleCheck(n.id, i)} />
              <span>{c.t}</span>
            </label>
          ))}
        </div>
      )}
      {n.tags && n.tags.length>0 && (
        <div className="tags">
          {n.tags.map(t=><TagPill key={t} id={t} />)}
        </div>
      )}
      <div className="menu-row">
        <button ref={colorBtnRef} className="iconbtn" title="צבע" onClick={()=>setColorOpen(o=>!o)}>🎨</button>
        <button className="iconbtn" title="תגית" onClick={()=>setMenuOpen(o=>!o)} ref={menuBtnRef}>#</button>
        <span style={{flex:1}}></span>
        <button className="iconbtn" title="מחק" onClick={()=>{ if(confirm('למחוק את הפתק?')) onDelete(n.id); }}>🗑</button>
      </div>

      {colorOpen && (
        <PopoverList anchorRef={colorBtnRef} onClose={()=>setColorOpen(false)}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:6,padding:6}}>
            {COLORS.map(c=>(
              <button key={c.id} className={`swatch ${c.id==='white'?'empty':''} ${n.color===c.id?'selected':''}`}
                style={c.id!=='white'?{background:c.v}:undefined}
                title={c.label}
                onClick={()=>{ onColor(n.id, c.id); setColorOpen(false); }}
              />
            ))}
          </div>
        </PopoverList>
      )}

      {menuOpen && (
        <PopoverList anchorRef={menuBtnRef} onClose={()=>setMenuOpen(false)}>
          {TAGS.map(t => (
            <div key={t.id} className="opt" onClick={()=>onTagToggle(n.id, t.id)}>
              <input type="checkbox" readOnly checked={(n.tags||[]).includes(t.id)} style={{accentColor:'var(--accent)'}} />
              <TagDot id={t.id} />
              <span>{t.he}</span>
            </div>
          ))}
        </PopoverList>
      )}
    </div>
  );
}

// ─── sidebar ──────────────────────────────────────────────
function Sidebar({ projects, notes, filter, setFilter }){
  const counts = useMemo(() => {
    const out = {};
    projects.forEach(p => out[p.id] = 0);
    notes.forEach(n => { out[n.proj] = (out[n.proj]||0)+1; });
    return out;
  }, [notes, projects]);
  const tagCounts = useMemo(() => {
    const out = {};
    TAGS.forEach(t => out[t.id] = 0);
    notes.forEach(n => (n.tags||[]).forEach(t => out[t] = (out[t]||0)+1));
    return out;
  }, [notes]);
  return (
    <aside className="sidebar">
      <div className="nav">
        <button className={`nav-item ${filter.kind==='all'?'active':''}`} onClick={()=>setFilter({kind:'all'})}>
          <span className="ico">🗒</span>
          <span className="label">כל הפתקים</span>
          <span className="count">{notes.length}</span>
        </button>
        <button className={`nav-item ${filter.kind==='pinned'?'active':''}`} onClick={()=>setFilter({kind:'pinned'})}>
          <span className="ico">📌</span>
          <span className="label">נעוצים</span>
          <span className="count">{notes.filter(n=>n.pinned).length}</span>
        </button>
      </div>

      <div className="sb-section">פרויקטים</div>
      <div className="nav">
        {projects.map(p => (
          <button key={p.id} className={`nav-item ${filter.kind==='proj'&&filter.id===p.id?'active':''}`}
                  onClick={()=>setFilter({kind:'proj',id:p.id})}>
            <span className="ico">{p.emoji}</span>
            <span className="label">{p.name}</span>
            <span className="count">{counts[p.id]||0}</span>
          </button>
        ))}
        <button className="nav-item" style={{color:'var(--ink3)'}} onClick={()=>alert('להוסיף פרויקט — בגרסה הבאה')}>
          <span className="ico">＋</span>
          <span className="label">פרויקט חדש</span>
        </button>
      </div>

      <div className="sb-section">תגיות</div>
      <div className="nav">
        {TAGS.map(t => (
          <button key={t.id} className={`nav-item ${filter.kind==='tag'&&filter.id===t.id?'active':''}`}
                  onClick={()=>setFilter({kind:'tag',id:t.id})}>
            <span className="ico"><TagDot id={t.id} /></span>
            <span className="label">{t.he}</span>
            <span className="count">{tagCounts[t.id]||0}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

// ─── app ──────────────────────────────────────────────────
function App(){
  const initial = loadState();
  const [projects] = useState(initial?.projects || SEED_PROJECTS);
  const [notes, setNotes] = useState(initial?.notes || SEED_NOTES);
  const [filter, setFilter] = useState({ kind:'all' });
  const [search, setSearch] = useState('');
  const [dark, setDark] = useState(initial?.dark || false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // detect iOS + standalone, capture install prompt
  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
    if (!standalone && !localStorage.getItem('pinboard.install-dismissed')) {
      const isMobile = window.innerWidth < 900;
      if (isMobile && ios) {
        setTimeout(() => setShowInstallBanner(true), 1200);
      }
    }
    const onBip = (e) => {
      e.preventDefault();
      setInstallEvent(e);
      if (!standalone && !localStorage.getItem('pinboard.install-dismissed')) {
        setShowInstallBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', onBip);
    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, []);

  // close drawer when widening; ESC closes it too
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 900) setDrawerOpen(false); };
    const onEsc = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onEsc);
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('keydown', onEsc); };
  }, []);

  const installNow = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setShowInstallBanner(false);
    setInstallEvent(null);
  };
  const dismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pinboard.install-dismissed', '1');
  };

  const setFilterAndClose = (f) => { setFilter(f); setSearch(''); setDrawerOpen(false); };

  // persist
  useEffect(() => {
    saveState({ projects, notes, dark });
  }, [projects, notes, dark]);

  // theme
  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        document.querySelector('.search input')?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // mutations
  const addNote     = (n) => setNotes(prev => [n, ...prev]);
  const pinNote     = (id) => setNotes(prev => prev.map(n => n.id===id ? {...n, pinned: !n.pinned} : n));
  const colorNote   = (id, c) => setNotes(prev => prev.map(n => n.id===id ? {...n, color: c} : n));
  const deleteNote  = (id) => setNotes(prev => prev.filter(n => n.id!==id));
  const toggleCheck = (id, i) => setNotes(prev => prev.map(n => {
    if (n.id!==id || !Array.isArray(n.checklist)) return n;
    const next = n.checklist.map((c,j) => j===i ? {...c, done:!c.done} : c);
    return {...n, checklist: next};
  }));
  const toggleTag   = (id, tag) => setNotes(prev => prev.map(n => {
    if (n.id!==id) return n;
    const set = new Set(n.tags||[]);
    set.has(tag) ? set.delete(tag) : set.add(tag);
    return {...n, tags: [...set]};
  }));

  // filtered notes
  const filtered = useMemo(() => {
    let list = notes;
    if (filter.kind==='proj')   list = list.filter(n => n.proj===filter.id);
    if (filter.kind==='tag')    list = list.filter(n => (n.tags||[]).includes(filter.id));
    if (filter.kind==='pinned') list = list.filter(n => n.pinned);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(n => {
        const hay = [n.title, n.sub, n.body, ...(n.tags||[]).map(t=>TAGS.find(x=>x.id===t)?.he)].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      });
    }
    return list;
  }, [notes, filter, search]);

  const pinned = filtered.filter(n => n.pinned);
  const others = filtered.filter(n => !n.pinned);

  const defaultProject = filter.kind==='proj' ? filter.id : undefined;

  const pageTitle = useMemo(() => {
    if (search.trim()) return `חיפוש: "${search.trim()}"`;
    if (filter.kind==='all')    return 'כל הפתקים';
    if (filter.kind==='pinned') return 'נעוצים';
    if (filter.kind==='proj')   return projects.find(p=>p.id===filter.id)?.name || 'פרויקט';
    if (filter.kind==='tag')    return `תגית · ${TAGS.find(t=>t.id===filter.id)?.he || ''}`;
    return '';
  }, [filter, search, projects]);

  return (
    <div className="app">
      <header className="topbar">
        <button className="iconbtn hamburger" title="תפריט" onClick={()=>setDrawerOpen(o=>!o)} aria-label="תפריט">☰</button>
        <div className="brand">
          <div className="mark">📓</div>
          <div>
            <h1>יומן</h1>
            <div className="sub">פתקים לפרויקטים</div>
          </div>
        </div>

        <div className="search">
          <span style={{color:'var(--ink3)'}}>🔎</span>
          <input
            placeholder="חיפוש בכל הפתקים..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
          {search && <button className="iconbtn" style={{width:24,height:24}} onClick={()=>setSearch('')}>✕</button>}
          <span style={{fontSize:11,color:'var(--ink4)'}}><kbd>/</kbd></span>
        </div>

        <button className="iconbtn" title="ערכת נושא" onClick={()=>setDark(d=>!d)}>
          {dark ? '☀' : '🌙'}
        </button>
        <Avatar>מ</Avatar>
      </header>

      <div className="body">
        {drawerOpen && <div className="scrim show" onClick={()=>setDrawerOpen(false)}></div>}
        <div className={drawerOpen ? 'sidebar open' : 'sidebar'}>
          <Sidebar projects={projects} notes={notes} filter={filter} setFilter={setFilterAndClose} />
        </div>

        <main className="main">
          <div className="page-head">
            <h2>{pageTitle}</h2>
            <span className="desc">{filtered.length} פתקים</span>
            {filter.kind!=='all' && (
              <button className="btn right" style={{padding:'4px 10px'}} onClick={()=>{setFilter({kind:'all'}); setSearch('');}}>נקה סינון</button>
            )}
          </div>

          <Compose projects={projects} onAdd={addNote} defaultProject={defaultProject} />

          {filtered.length === 0 ? (
            <div className="empty">
              <div className="big">🗒</div>
              <div className="msg">אין פתקים כאן עדיין</div>
              <div>נסה לכתוב פתק חדש למעלה</div>
            </div>
          ) : (
            <>
              {pinned.length>0 && (
                <>
                  <div className="section-head">📌 נעוצים</div>
                  <div className="masonry">
                    {pinned.map(n => (
                      <Note key={n.id} n={n} projects={projects}
                        onPin={pinNote} onColor={colorNote} onDelete={deleteNote}
                        onToggleCheck={toggleCheck} onTagToggle={toggleTag} />
                    ))}
                  </div>
                </>
              )}
              {others.length>0 && (
                <>
                  {pinned.length>0 && <div className="section-head">אחרים</div>}
                  <div className="masonry">
                    {others.map(n => (
                      <Note key={n.id} n={n} projects={projects}
                        onPin={pinNote} onColor={colorNote} onDelete={deleteNote}
                        onToggleCheck={toggleCheck} onTagToggle={toggleTag} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {showInstallBanner && (
        <div className="install-banner" role="dialog" aria-label="התקנת אפליקציה">
          <span className="ib-emoji">📓</span>
          <div className="ib-text">
            <b>התקן את היומן</b>
            {isIOS ? (
              <span className="muted">לחץ/י על <b>שתיף ⤴</b> → <b>הוסף למסך הבית</b></span>
            ) : installEvent ? (
              <span className="muted">הוסף למסך הבית לגישה מהירה ולעבודה אופלאין</span>
            ) : (
              <span className="muted">בתפריט הדפדפן: התקן אפליקציה / Install app</span>
            )}
          </div>
          {installEvent && <button className="btn primary" onClick={installNow}>התקן</button>}
          <button className="iconbtn" onClick={dismissInstall} aria-label="סגור">✕</button>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
