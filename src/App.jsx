import { useState, useRef, useEffect } from 'react'
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

const ARCHITECTURE_DOCS = [
  {
    id: 'bataan-framework',
    title: 'BATAAN FRAMEWORK',
    section: 'Foundation',
    badge: 'Framework',
    subtitle: 'Firma Sovereign Foundation · Asia-Pacific Deployment Strategy',
    description: 'West Luzon Corridor · 2026–2028 · V1.0',
    subcategories: [
      {
        id: 'core-mission',
        title: 'Core Mission & Goals',
        content: `Establish Bataan as Firma\'s primary Asia-Pacific operational headquarters — a sovereign-grade zone corridor that functions as a Settlemint anchor, logistics gateway, and compliance-ready base for all Southeast Asian operations. The corridor operates across three sites: Dinalupihan (HQ), Mariveles/AFAB (zone operations), and SBFZ (logistics and international gateway).`
      },
      {
        id: 'phase-1',
        title: 'Phase 1 — Foundation (Month 0–3)',
        theme: 'Legal entity formation — SEC first, SBFZ second',
        timeline: '2.5–3 months',
        content: `**Key Structural Decision**: 60/40 ownership — Foreign corporations cannot purchase land in the Philippines. Land ownership is restricted to Filipino citizens and corporations with at least 60% Filipino equity. The corporation must be structured 60% Filipino / 40% foreign from day one.\n\n**Registration Sequence**: SEC → SBFZ → Office Setup → FAB → Land Acquisition\n\n**Steps**:\n1. SEC Registration — File Articles of Incorporation under RA 11232 with 60/40 ownership structure. Authorized capital: ₱20,000,000. Appoint Corporate Secretary (must be Filipino resident). **Est. Time**: 2–4 weeks\n\n2. Open Corporate Bank Account — Required for capitalization proof before SBMA application. **Est. Time**: 1–2 weeks\n\n3. Prepare SBMA Application Package — LOI to SBMA Chairman, business plan + financial projections, company profile, risk & safety assessment, SEC cert + Articles, bank capitalization proof. **Est. Time**: 2–3 weeks (prep)\n\n4. Submit SBMA Application — File via One-Stop Shop or online portal. Fee: ₱5,000. SBMA review period. **Est. Time**: 1–3 months\n\n5. Obtain CRTE — Certificate of Registration and Tax Exemption. Unlocks 5% GIT, duty-free imports, VAT zero-rating. **Issued upon SBMA approval**\n\n6. BIR Registration — TIN, COR, authority to print invoices via BIR Form 1903. Fee: ₱500. **Est. Time**: 2–4 weeks\n\n7. SSS / PhilHealth / Pag-IBIG — Register for all employees. Under 10 employees = simplified remittance. **Est. Time**: 1–2 weeks\n\n8. Secure SBFZ Physical Lease (HQ Office) — SBMA requires actual presence. Target a larger commercial unit suited for a proper HQ — meeting rooms, team workspace, operations hub. Rate: ~₱50–200/sqm/month depending on district. **Est. Time**: 1–2 weeks\n\n**Exit Criteria**: CRTE received, BIR COR issued, all agency registrations complete.`
      },
      {
        id: 'phase-2',
        title: 'Phase 2 — Expansion (Month 3–12)',
        theme: 'HQ office live, operations structured, FAB registered',
        timeline: '4–6 months',
        content: `**Steps**:\n1. Office Setup (Design → Build) — Hire licensed architect, design HQ layout, fit-out the leased space, set up IT infrastructure, utilities, and signage. Corporate kit finalized. **Est. Time**: 1–2 months\n\n2. Bookkeeping & Accounting Setup — Hire or contract CPA/bookkeeper. Set up accounting system (QuickBooks, Xero, or local alternative). **Est. Time**: 3–4 weeks\n\n3. Payroll System — Set up payroll aligned with SSS, PhilHealth, Pag-IBIG contribution schedules. **Est. Time**: 2–3 weeks\n\n4. Begin Quarterly BIR Filings — File and pay 5% GIT quarterly. Lock in compliance calendar (due dates: Apr 30, Jul 31, Oct 31, Jan 31). **Ongoing**\n\n5. FAB Registration (Freeport Area of Bataan) — Once SBFZ office is active, register with AFAB as a locator for Bataan-side operations. **Est. Time**: 1–3 months\n\n6. SBMA Annual Report Prep — Start collecting employment data and financial statements. **Ongoing**\n\n**Exit Criteria**: SBFZ HQ operational, bookkeeping system live, FAB registration filed or approved.`
      },
      {
        id: 'phase-3',
        title: 'Phase 3 — Land Acquisition',
        theme: 'Secure land — the hardest and longest part',
        timeline: '12–24 months',
        content: `This phase begins only after FAB registration is complete. Land acquisition in the Philippines is a complex, multi-agency process. The 60/40 corporate structure makes this legally possible.\n\n**Steps**:\n1. Identify Target Land — Prospect lots near SBFZ/Bataan corridor. Engage licensed broker (PRC-registered). Factor in zoning, SBMA perimeter rules, flood maps, access roads. **Est. Time**: 2–4 months\n\n2. Due Diligence — Verify clean OCT/TCT at Registry of Deeds; no encumbrances, liens, or adverse claims. Check classifications and real property tax status. **Est. Time**: 2–3 months\n\n3. DAR Clearance (if agricultural) — If land is classified agricultural, secure Department of Agrarian Reform clearance. This is the longest possible blocker. **Est. Time**: 3–6 months (if required)\n\n4. Negotiate and Execute Deed of Absolute Sale — Notarized; buyer listed as Firma corporation. **Est. Time**: 2–4 weeks\n\n5. Pay Transfer Taxes — Capital Gains Tax: 6%; Documentary Stamp Tax: 1.5%; Transfer Tax at LGU: 0.5–0.75%. **Est. Time**: 1–2 months\n\n6. Obtain CAR from BIR — Certificate Authorizing Registration. **Est. Time**: 3–6 weeks\n\n7. Title Transfer at Registry of Deeds — New TCT issued in Firma corporation\'s name. Final step. **Est. Time**: 2–4 weeks\n\n**Exit Criteria**: Clean TCT issued in Firma corporation\'s name.`
      },
      {
        id: 'phase-4',
        title: 'Phase 4 — FAB Extension / Own Economic Zone',
        theme: 'Firma becomes the zone — sovereign economic territory',
        timeline: '2–4 years',
        content: `This phase begins only after land is acquired and operations are proven at both SBFZ and FAB. Firma pursues one or both paths to become a recognized economic zone.\n\n**Two Strategic Paths**:\n\n**Option A — FAB Extension**: Petition AFAB to formally include Firma\'s land within the FAB perimeter. Lower setup complexity, no revenue upside, AFAB remains authority. **Timeline**: 1–2 years after land secured.\n\n**Option B — Own PEZA Zone**: Apply with PEZA to establish a private economic zone on Firma-owned land. Full control, Firma is the zone operator, revenue upside from locator fees. **Timeline**: 2–4 years after land secured.\n\n**Recommended First Move**: Pursue FAB Extension while simultaneously scoping the PEZA zone application. FAB Extension accelerates the credibility needed for a PEZA application.`
      }
    ]
  },
  {
    id: 'priority-hq',
    title: 'PRIORITY: FIT HQ Setup',
    section: 'Priority Actions',
    badge: 'Priority',
    subtitle: 'Physical HQ & Compliance Foundation',
    description: 'Immediate actions for securing MSpace Balanga and establishing operational presence',
    content: `We\'re set to look at MSpace in Balanga and other options inside the Freeport Area. We need a small fund as support so when we visit in person, it\'s proper and on time. We want photos and to feel the space — not just a price sheet. Whatever we lock down must feel like a base of operations, not just desks with a logo.\n\n**Physical HQ Requirements**:\n• Business lease agreement review (commercial use + events)\n• Barangay clearance for business operations in Balanga City\n• Mayor\'s Business Permit (City of Balanga)\n• BIR registration (if FIRMA/FIT will bill from this address)\n• DOLE compliance (if onboarding local staff)\n• Fire safety inspection certificate and occupancy clearance\n• Freeport Authority of Bataan (FAB) coordination\n\n**IP Protection in the Philippines**:\n• Trademark registration with IPOPHL — covering FIRMA, FIT, SEEDBASE, and Nation of Heaven marks across key classes (Class 9: tech/software, Class 35: business services, Class 36: financial/token, Class 41: events and education)\n• Trade name registration with SEC\n• Copyright filing for original creative assets\n• Domain and brand protection sweep\n• Early SEC coordination on token/digital asset classification\n• NDA and IP assignment agreements for all local contractors\n\n**Strategy**: Do this clean from the start in Bataan so when we replicate in other countries, we have a working compliance template. No scrambling, no retrofitting.`
  },
  {
    id: 'priority-contacts',
    title: 'PRIORITY: Key Contacts',
    section: 'Priority Actions',
    badge: 'Contacts',
    subtitle: 'Event Logistics, Film Crew, Agencies',
    subcategories: [
      {
        id: 'recurra',
        title: 'Recurra',
        type: 'Primary Contact',
        note: 'Clarky personally knows the Owner',
        links: [
          { label: 'Facebook', url: 'https://www.facebook.com/recurraph' },
          { label: 'Website', url: 'https://www.recurraph.com/' }
        ],
        content: `Primary contact for event logistics, film crew coordination, and agency services in Bataan region.`
      }
    ]
  },
  {
    id: 'sovereign-engagement',
    title: 'SOVEREIGN ENGAGEMENT LAYER',
    section: 'Vision',
    badge: 'Strategy',
    subtitle: "FIRMA: MIDDLE GROUND — Russia\'s Federal Constitutional Law",
    content: `This document covers the strategic framework for sovereign engagement, drawing parallels from Russia\'s Federal Constitutional Law to establish a middle-ground approach for FIRMA\'s international operations and engagement protocols.`
  }
]activeNav === 'atlas'  { id: 'outlook', label: 'Outlook', provider: 'outlook' }
]

const FONT_FAMILIES = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Inter', 'Fraunces']
const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
const TEXT_STYLES = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3']

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [plannerItems, setPlannerItems] = useState([{ id: 1, title: 'Ocular visit in Bataan', date: '2026-04-25', notes: 'Site inspection', status: 'todo' }, { id: 2, title: 'Review compliance documents', date: '2026-04-26', notes: 'Legal review', status: 'inprogress' }])
  const [newTask, setNewTask] = useState({ title: '', date: '', notes: '', status: 'todo' })
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [emailForm, setEmailForm] = useState({ account: 'gmail', to: '', subject: '', body: '' })
  const [emailSent, setEmailSent] = useState(false)
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteTitle, setNoteTitle] = useState('')
  const editorRef = useRef(null)

  const sendEmail = () => {
    if (!emailForm.to || !emailForm.subject) return
    const { account, to, subject, body } = emailForm
    if (account === 'gmail') window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    else window.open(`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 2500)
  }

  const addTask = () => {
    if (!newTask.title) return
    setPlannerItems([...plannerItems, { ...newTask, id: Date.now() }])
    setNewTask({ title: '', date: '', notes: '', status: 'todo' })
  }

  const removeTask = (id) => setPlannerItems(plannerItems.filter(t => t.id !== id))

  const updateTaskStatus = (id, newStatus) => {
    setPlannerItems(plannerItems.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  const createNote = () => {
    const newNote = { id: Date.now(), title: 'New Note', htmlContent: '', date: new Date().toISOString() }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setNoteTitle('New Note')
    if (editorRef.current) editorRef.current.innerHTML = ''
  }

  const updateNote = (id, updates) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, date: new Date().toISOString() } : n))
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, ...updates })
    }
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setNoteTitle('')
      if (editorRef.current) editorRef.current.innerHTML = ''
    }
  }

  const selectNote = (note) => {
    if (selectedNote) {
      updateNote(selectedNote.id, { title: noteTitle, htmlContent: editorRef.current?.innerHTML || '' })
    }
    setSelectedNote(note)
    setNoteTitle(note.title)
    if (editorRef.current) editorRef.current.innerHTML = note.htmlContent || ''
  }

  const handleEditorInput = () => {
    if (selectedNote && editorRef.current) {
      updateNote(selectedNote.id, { title: noteTitle, htmlContent: editorRef.current.innerHTML })
    }
  }

  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleStyleChange = (e) => {
    const style = e.target.value
    if (style === 'Normal') execCmd('formatBlock', 'p')
    else if (style === 'Heading 1') execCmd('formatBlock', 'h1')
    else if (style === 'Heading 2') execCmd('formatBlock', 'h2')
    else if (style === 'Heading 3') execCmd('formatBlock', 'h3')
  }

  const todoTasks = plannerItems.filter(t => t.status === 'todo')
  const inprogressTasks = plannerItems.filter(t => t.status === 'inprogress')
  const doneTasks = plannerItems.filter(t => t.status === 'done')
  const completionRate = plannerItems.length > 0 ? Math.round((doneTasks.length / plannerItems.length) * 100) : 0

  return (
    <div className="app">
      <div className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <div className="brand-title">SOLDIERS OF HEAVEN</div>
            <div className="brand-sub">Firma Workspace</div>
          </div>
        </div>
        <div className="nav">
          {[['dashboard','Dashboard'],['planner','Planner'],['notes','Notes'],['email','Email'],['atlas','Architecture Atlas']].map(([key,label]) => (
            <button key={key} className={`nav-btn ${activeNav===key?'active':''}`} onClick={()=>setActiveNav(key)}>{label}</button>
          ))}
        </div>
        <div className="sidebar-footer">Firma Sovereign Foundation · March 2026</div>
      </div>
      <main className="main">
        {activeNav === 'dashboard' && (
          <div className="section">
            <div className="page-header">
              <div className="page-pre">Overview · 04.23.2026</div>
              <h1 className="page-title">Today’s <em>signal</em></h1>
              <p className="page-desc">Live snapshot of active work, documents in motion, and upcoming commitments across the Foundation.</p>
            </div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">{plannerItems.length}</div>
                <div className="metric-label">Active Tasks</div>
                <div className="metric-change up">+{plannerItems.filter(t=>new Date(t.date)>new Date()).length} upcoming</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{notes.length}</div>
                <div className="metric-label">Notes</div>
                <div className="metric-change up">+{notes.length} total</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{completionRate}%</div>
                <div className="metric-label">Completion Rate</div>
                <div className="metric-change up">+{completionRate}% overall</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">3</div>
                <div className="metric-label">Team Members</div>
                <div className="metric-change">Active</div>
              </div>
            </div>
            <div className="card-grid">
              <div className="card" onClick={()=>setActiveNav('planner')}>
                <div className="card-icon">📋</div>
                <div className="card-label">Planner</div>
                <div className="card-count">{plannerItems.length} task(s)</div>
              </div>
              <div className="card" onClick={()=>setActiveNav('notes')}>
                <div className="card-icon">📝</div>
                <div className="card-label">Notes</div>
                <div className="card-count">{notes.length} note(s)</div>
              </div>
              <div className="card" onClick={()=>setActiveNav('email')}>
                <div className="card-icon">✉️</div>
                <div className="card-label">Email</div>
                <div className="card-count">0 sent</div>
              </div>
            </div>
            <div className="upcoming-section">
              <div className="section-title">Upcoming</div>
              {plannerItems.length === 0 ?
                <div className="empty">No upcoming tasks</div>
              : plannerItems.map(t => (
                <div key={t.id} className="task-row">
                  <div className="task-dot"></div>
                  <div className="task-title">{t.title}</div>
                  {t.date &&
                    <div className="task-date">{t.date}</div>
                  }
                </div>
              ))}
            </div>
          </div>
        )}
        {activeNav === 'planner' && (
          <div className="section">
            <div className="page-header">
              <div className="page-pre">Planner · Kanban</div>
              <h1 className="page-title">Work in <em>motion</em></h1>
            </div>
            <div className="add-form">
              <input className="input" placeholder="Task title" value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} />
              <input className="input" type="date" value={newTask.date} onChange={e=>setNewTask({...newTask,date:e.target.value})} />
              <input className="input" placeholder="Notes (optional)" value={newTask.notes} onChange={e=>setNewTask({...newTask,notes:e.target.value})} />
              <select className="input" value={newTask.status} onChange={e=>setNewTask({...newTask,status:e.target.value})}>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button className="btn-primary" onClick={addTask}>Add Task</button>
            </div>
            <div className="kanban-board">
              <div className="kanban-column">
                <div className="kanban-header">To Do <span className="kanban-count">{todoTasks.length}</span></div>
                <div className="kanban-tasks">
                  {todoTasks.length===0?
                    <div className="kanban-empty">No tasks</div>
                  :todoTasks.map(t=>(
                    <div key={t.id} className="kanban-task">
                      <div className="kanban-task-title">{t.title}</div>
                      {t.date&&
                        <div className="kanban-task-meta">📅 {t.date}</div>
                      }
                      {t.notes&&
                        <div className="task-notes">{t.notes}</div>
                      }
                      <button className="btn-primary" style={{marginTop:'8px',fontSize:'11px',padding:'6px 12px'}} onClick={()=>updateTaskStatus(t.id,'inprogress')}>Start</button>
                      <button className="btn-remove" style={{marginTop:'4px'}} onClick={()=>removeTask(t.id)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="kanban-column">
                <div className="kanban-header">In Progress <span className="kanban-count">{inprogressTasks.length}</span></div>
                <div className="kanban-tasks">
                  {inprogressTasks.length===0?
                    <div className="kanban-empty">No tasks</div>
                  :inprogressTasks.map(t=>(
                    <div key={t.id} className="kanban-task">
                      <div className="kanban-task-title">{t.title}</div>
                      {t.date&&
                        <div className="kanban-task-meta">📅 {t.date}</div>
                      }
                      {t.notes&&
                        <div className="task-notes">{t.notes}</div>
                      }
                      <button className="btn-primary" style={{marginTop:'8px',fontSize:'11px',padding:'6px 12px'}} onClick={()=>updateTaskStatus(t.id,'done')}>Complete</button>
                      <button className="btn-primary" style={{marginTop:'4px',fontSize:'11px',padding:'6px 12px',opacity:'0.7'}} onClick={()=>updateTaskStatus(t.id,'todo')}>Move Back</button>
                      <button className="btn-remove" style={{marginTop:'4px'}} onClick={()=>removeTask(t.id)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="kanban-column">
                <div className="kanban-header">Done <span className="kanban-count">{doneTasks.length}</span></div>
                <div className="kanban-tasks">
                  {doneTasks.length===0?
                    <div className="kanban-empty">No completed tasks</div>
                  :doneTasks.map(t=>(
                    <div key={t.id} className="kanban-task">
                      <div className="kanban-task-title">{t.title}</div>
                      {t.date&&
                        <div className="kanban-task-meta">📅 {t.date}</div>
                      }
                      {t.notes&&
                        <div className="task-notes">{t.notes}</div>
                      }
                      <button className="btn-primary" style={{marginTop:'8px',fontSize:'11px',padding:'6px 12px',opacity:'0.7'}} onClick={()=>updateTaskStatus(t.id,'inprogress')}>Reopen</button>
                      <button className="btn-remove" style={{marginTop:'4px'}} onClick={()=>removeTask(t.id)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeNav === 'notes' && (
          <div className="notes-app">
            <div className="notes-sidebar">
              <div className="notes-sidebar-header">
                <div className="notes-header-title">Notes</div>
                <button className="notes-new-btn" onClick={createNote}>+</button>
              </div>
              <div className="notes-search-wrap">
                <input className="notes-search" placeholder="🔍 Search" />
              </div>
              <div className="notes-list">
                {notes.length === 0 ? (
                  <div className="notes-empty-list">No notes yet.\nClick + to create one.</div>
                ) : notes.map(note => (
                  <div
                    key={note.id}
                    className={`notes-list-item ${selectedNote?.id===note.id?'active':''}`}
                    onClick={() => selectNote(note)}
                  >
                    <div className="notes-list-title">{note.title || 'Untitled'}</div>
                    <div className="notes-list-preview">{note.htmlContent ? note.htmlContent.replace(/<[^>]*>/g, '').slice(0,60) + (note.htmlContent.replace(/<[^>]*>/g, '').length > 60 ? '...' : '') : 'No additional text'}</div>
                    <div className="notes-list-date">{new Date(note.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="notes-editor">
              {!selectedNote ? (
                <div className="notes-editor-empty">
                  <div className="notes-editor-empty-icon">📝</div>
                  <div className="notes-editor-empty-text">Select a note to view</div>
                  <div className="notes-editor-empty-sub">or click + to create a new one</div>
                  <button className="btn-primary" style={{marginTop:'20px'}} onClick={createNote}>New Note</button>
                </div>
              ) : (
                <div className="notes-editor-inner">
                  <div className="notes-editor-toolbar">
                    <input
                      className="notes-title-input"
                      value={noteTitle}
                      onChange={e => {
                        setNoteTitle(e.target.value);
                        updateNote(selectedNote.id, { title: e.target.value, htmlContent: editorRef.current?.innerHTML || '' })
                      }}
                      placeholder="Title"
                    />
                    <button className="btn-remove" onClick={()=>deleteNote(selectedNote.id)}>Delete</button>
                  </div>
                  <div className="notes-editor-meta">{new Date(selectedNote.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</div>
                  <div className="rich-toolbar">
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={()=>execCmd('undo')} title="Undo">↺</button>
                      <button className="toolbar-btn" onClick={()=>execCmd('redo')} title="Redo">↻</button>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-group">
                      <select className="toolbar-select" onChange={handleStyleChange} title="Text Style">
                        {TEXT_STYLES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                      <select className="toolbar-select" onChange={e=>execCmd('fontName',e.target.value)} title="Font Family">
                        {FONT_FAMILIES.map(f=><option key={f} value={f}>{f}</option>)}
                      </select>
                      <select className="toolbar-select" onChange={e=>execCmd('fontSize',e.target.value)} title="Font Size">
                        {FONT_SIZES.map(s=><option key={s} value={s.replace('px','')}>{s}</option>)}
                      </select>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={()=>execCmd('bold')} title="Bold"><b>B</b></button>
                      <button className="toolbar-btn" onClick={()=>execCmd('italic')} title="Italic"><i>I</i></button>
                      <button className="toolbar-btn" onClick={()=>execCmd('underline')} title="Underline"><u>U</u></button>
                      <button className="toolbar-btn" onClick={()=>execCmd('strikeThrough')} title="Strikethrough"><s>S</s></button>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-group">
                      <input type="color" className="toolbar-color" onChange={e=>execCmd('foreColor',e.target.value)} title="Text Color" />
                      <input type="color" className="toolbar-color" onChange={e=>execCmd('hiliteColor',e.target.value)} title="Highlight" />
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={()=>execCmd('justifyLeft')} title="Align Left">←</button>
                      <button className="toolbar-btn" onClick={()=>execCmd('justifyCenter')} title="Align Center">↔</button>
                      <button className="toolbar-btn" onClick={()=>execCmd('justifyRight')} title="Align Right">→</button>
                      <button className="toolbar-btn" onClick={()=>execCmd('justifyFull')} title="Justify">≡</button>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={()=>execCmd('insertUnorderedList')} title="Bullet List">•</button>
                      <button className="toolbar-btn" onClick={()=>execCmd('insertOrderedList')} title="Numbered List">1.</button>
                      <button className="toolbar-btn" onClick={()=>execCmd('indent')} title="Increase Indent">→|</button>
                      <button className="toolbar-btn" onClick={()=>execCmd('outdent')} title="Decrease Indent">|←</button>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={()=>{const url=prompt('Enter URL:');if(url)execCmd('createLink',url)}} title="Insert Link">🔗</button>
                      <button className="toolbar-btn" onClick={()=>{const url=prompt('Enter image URL:');if(url)execCmd('insertImage',url)}} title="Insert Image">🖼</button>
                      <button className="toolbar-btn" onClick={()=>execCmd('insertHorizontalRule')} title="Horizontal Line">―</button>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={()=>execCmd('removeFormat')} title="Clear Formatting">✕</button>
                    </div>
                  </div>
                  <div
                    ref={editorRef}
                    className="rich-editor-content"
                    contentEditable
                    onInput={handleEditorInput}
                    suppressContentEditableWarning
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeNav === 'email' && (
          <div className="section">
            <div className="page-header">
              <div className="page-pre">Email Composer</div>
              <h1 className="page-title">Draft a <em>message</em></h1>
              <p className="page-desc">Compose here and hand off to your mail client. No send server attached—this is a staging surface.</p>
            </div>
            <div className="email-form">
              <div className="provider-row">Send via <select className="select" value={emailForm.account} onChange={e=>setEmailForm({...emailForm,account:e.target.value})}>{EMAIL_ACCOUNTS.map(acc=><option key={acc.id} value={acc.id}>{acc.label}</option>)}</select></div>
              <input className="input" placeholder="To (email address)" value={emailForm.to} onChange={e=>setEmailForm({...emailForm,to:e.target.value})} />
              <input className="input" placeholder="Subject" value={emailForm.subject} onChange={e=>setEmailForm({...emailForm,subject:e.target.value})} />
              <textarea className="textarea" placeholder="Write your message..." value={emailForm.body} onChange={e=>setEmailForm({...emailForm,body:e.target.value})} />
              <button className="btn-primary" onClick={sendEmail}>Send Email</button>
              {emailSent&&<div className="success-msg">Email client opened!</div>}
            </div>
          </div>
        )}
        {activeNav === 'atlas' && (
          <div className="section">
            <div className="page-header">
              <div className="page-pre">Firma Canonical Index</div>
              <h1 className="page-title">Architecture <em>atlas</em></h1>
              <p className="page-desc">Every layer serves the decree. All documents referenced from the canonical foundation—search to locate, click to open.</p>
            </div>
            {(() => {
              const sections = {};
              ARCHITECTURE_DOCS.forEach(doc => {
                if (!sections[doc.section]) sections[doc.section] = [];
                sections[doc.section].push(doc);
              });
              return (
                <>
                  {Object.entries(sections).map(([sectionName, docs]) => (
                    <div key={sectionName} style={{marginBottom:'48px'}}>
                      <div className="section-title" style={{marginBottom:'20px'}}>{sectionName.toUpperCase()}</div>
                      <div className="doc-grid">
                        {docs.map(doc=>(
                          <div key={doc.id} className="doc-card" onClick={()=>setSelectedDoc(doc)} style={{cursor:'pointer'}}>
                            <div className="doc-badge">{doc.badge}</div>
                            <div className="doc-title">{doc.title}</div>
                            <div className="doc-sub">{doc.subtitle || doc.description}</div>
                            {doc.subcategories && <div style={{fontSize:'11px',color:'#999',marginTop:'8px'}}>{doc.subcategories.length} sections</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
      </main>
    </div>
  )
}
