import { useState } from 'react'

const ARCHITECTURE_DOCS = [
  {
    id: 1,
    title: 'BATAAN-FRAMEWORK',
    section: 'Foundation',
    badge: 'Framework',
    subtitle: 'FIT PH/SEA — MASTER CLARIFICATION & PRIORITY CHECKLIST',
    content: `BATAAN FRAMEWORK v2\n\nFIT PH/SEA — MASTER CLARIFICATION & PRIORITY CHECKLIST\n\nThis document outlines the priority action items and clarifications needed for the Bataan Framework implementation. Key focus areas include organizational structure, compliance requirements, and operational deployment for the FIT PH/SEA initiative.`
  },
  {
    id: 2,
    title: 'SOVEREIGN ENGAGEMENT LAYER',
    section: 'Vision',
    badge: 'Strategy',
    subtitle: "FIRMA: MIDDLE GROUND — Russia's Federal Constitutional Law",
    content: `SOVEREIGN ENGAGEMENT LAYER\n\nFIRMA: MIDDLE GROUND\n\nThis document covers the strategic framework for sovereign engagement, drawing parallels from Russia's Federal Constitutional Law to establish a middle-ground approach for FIRMA's international operations and engagement protocols.`
  }
]

const EMAIL_ACCOUNTS = [
  { id: 'gmail', label: 'Gmail', provider: 'gmail' },
  { id: 'outlook', label: 'Outlook', provider: 'outlook' }
]

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [plannerItems, setPlannerItems] = useState([{ id: 1, title: 'Ocular visit in Bataan', date: '', notes: '' }])
  const [newTask, setNewTask] = useState({ title: '', date: '', notes: '' })
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [emailForm, setEmailForm] = useState({ account: 'gmail', to: '', subject: '', body: '' })
  const [emailSent, setEmailSent] = useState(false)

  const sendEmail = () => {
    if (!emailForm.to || !emailForm.subject) return
    const { account, to, subject, body } = emailForm
    if (account === 'gmail') {
      window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    } else {
      window.open(`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    }
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 2500)
  }

  const addTask = () => {
    if (!newTask.title) return
    setPlannerItems([...plannerItems, { ...newTask, id: Date.now() }])
    setNewTask({ title: '', date: '', notes: '' })
  }

  const removeTask = (id) => setPlannerItems(plannerItems.filter(t => t.id !== id))

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <div className="brand-title">SOLDIERS OF HEAVEN</div>
            <div className="brand-sub">Firma Workspace</div>
          </div>
        </div>
        <nav className="nav">
          {[['dashboard','Dashboard'],['planner','Planner'],['documents','Documents'],['email','Email'],['atlas','Architecture Atlas']].map(([key,label]) => (
            <button key={key} className={`nav-btn${activeNav===key?' active':''}`} onClick={() => setActiveNav(key)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">Firma Sovereign Foundation · March 2026</div>
      </aside>

      <main className="main">
        {activeNav === 'dashboard' && (
          <div className="section">
            <div className="page-header">
              <div className="page-pre">Overview · 04.23.2026</div>
              <h1 className="page-title">Today's <em>signal</em></h1>
              <p className="page-desc">Live snapshot of active work, documents in motion, and upcoming commitments across the Foundation.</p>
            </div>
            <div className="card-grid">
              <div className="card" onClick={() => setActiveNav('planner')}>
                <div className="card-icon">📋</div>
                <div className="card-label">Planner</div>
                <div className="card-count">{plannerItems.length} task(s)</div>
              </div>
              <div className="card" onClick={() => setActiveNav('documents')}>
                <div className="card-icon">📄</div>
                <div className="card-label">Documents</div>
                <div className="card-count">0 docs</div>
              </div>
              <div className="card" onClick={() => setActiveNav('email')}>
                <div className="card-icon">✉️</div>
                <div className="card-label">Email</div>
                <div className="card-count">0 sent</div>
              </div>
            </div>
            <div className="upcoming-section">
              <h2 className="section-title">Upcoming</h2>
              {plannerItems.length === 0 ? <p className="empty">No upcoming tasks</p> : (
                plannerItems.map(t => (
                  <div key={t.id} className="task-row">
                    <span className="task-dot" />
                    <span className="task-title">{t.title}</span>
                    {t.date && <span className="task-date">{t.date}</span>}
                  </div>
                ))
              )}
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
              <button className="btn-primary" onClick={addTask}>Add Task</button>
            </div>
            {plannerItems.length === 0 ? <p className="empty">No tasks yet</p> : (
              plannerItems.map(t => (
                <div key={t.id} className="task-card">
                  <div className="task-info">
                    <span className="task-title">{t.title}</span>
                    {t.date && <span className="task-date">{t.date}</span>}
                    {t.notes && <span className="task-notes">{t.notes}</span>}
                  </div>
                  <button className="btn-remove" onClick={()=>removeTask(t.id)}>Remove</button>
                </div>
              ))
            )}
          </div>
        )}

        {activeNav === 'documents' && (
          <div className="section">
            <div className="page-header">
              <div className="page-pre">Documents</div>
              <h1 className="page-title">Your <em>library</em></h1>
              <p className="page-desc">All documents are currently empty. Create new documents as needed.</p>
            </div>
            <p className="empty">No documents yet</p>
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
              <div className="provider-row">
                <label className="label">Send via</label>
                <select className="select" value={emailForm.account} onChange={e=>setEmailForm({...emailForm,account:e.target.value})}>
                  {EMAIL_ACCOUNTS.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.label}</option>
                  ))}
                </select>
              </div>
              <input className="input" placeholder="To (email address)" value={emailForm.to} onChange={e=>setEmailForm({...emailForm,to:e.target.value})} />
              <input className="input" placeholder="Subject" value={emailForm.subject} onChange={e=>setEmailForm({...emailForm,subject:e.target.value})} />
              <textarea className="textarea" placeholder="Write your message..." value={emailForm.body} onChange={e=>setEmailForm({...emailForm,body:e.target.value})} />
              <button className="btn-primary" onClick={sendEmail}>Send Email</button>
              {emailSent && <div className="success-msg">Email client opened!</div>}
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
            {!selectedDoc ? (
              <div className="doc-grid">
                {ARCHITECTURE_DOCS.map(doc => (
                  <div key={doc.id} className="doc-card" onClick={() => setSelectedDoc(doc)}>
                    <div className="doc-badge">{doc.badge}</div>
                    <div className="doc-title">{doc.title}</div>
                    <div className="doc-sub">{doc.subtitle}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button className="btn-back" onClick={() => setSelectedDoc(null)}>← Back to Atlas</button>
                <div className="doc-view">
                  <div className="doc-badge">{selectedDoc.badge}</div>
                  <h1 className="doc-view-title">{selectedDoc.title}</h1>
                  <p className="doc-view-sub">{selectedDoc.subtitle}</p>
                  <div className="doc-content">{selectedDoc.content}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
