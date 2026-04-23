import { useState } from 'react'

const DOCS = [
  {
    id: 1,
    title: 'BATAAN-FRAMEWORK',
    subtitle: 'FIT PH/SEA — MASTER CLARIFICATION & PRIORITY CHECKLIST',
    content: `BATAAN FRAMEWORK v2

FIT PH/SEA — MASTER CLARIFICATION & PRIORITY CHECKLIST

This document outlines the priority action items and clarifications needed for the Bataan Framework implementation. Key focus areas include organizational structure, compliance requirements, and operational deployment for the FIT PH/SEA initiative.`
  },
  {
    id: 2,
    title: 'SOVEREIGN ENGAGEMENT LAYER',
    subtitle: "FIRMA: MIDDLE GROUND — Russia's Federal Constitutional Law",
    content: `SOVEREIGN ENGAGEMENT LAYER

FIRMA: MIDDLE GROUND

This document covers the strategic framework for sovereign engagement, drawing parallels from Russia's Federal Constitutional Law to establish a middle-ground approach for FIRMA's international operations and engagement protocols.`
  }
]

const INITIAL_PLANNER = [
  { id: 1, title: 'Ocular Visit — Bataan', date: '', status: 'upcoming', notes: '' }
]

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [plannerItems, setPlannerItems] = useState(INITIAL_PLANNER)
  const [newTask, setNewTask] = useState({ title: '', date: '', notes: '' })
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '', provider: 'gmail' })
  const [emailSent, setEmailSent] = useState(false)
  const [docNotes, setDocNotes] = useState({})

  const sendEmail = () => {
    if (!emailForm.to || !emailForm.subject) return
    const { provider, to, subject, body } = emailForm
    if (provider === 'gmail') {
      window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    } else {
      window.open(`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    }
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  const addTask = () => {
    if (!newTask.title) return
    setPlannerItems([...plannerItems, { ...newTask, id: Date.now(), status: 'upcoming' }])
    setNewTask({ title: '', date: '', notes: '' })
  }

  const removeTask = (id) => setPlannerItems(plannerItems.filter(t => t.id !== id))

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">F</div>
          <div>
            <div className="brand-title">FIRMA WORKSPACE</div>
            <div className="brand-sub">SOLDIERS OF HEAVEN</div>
          </div>
        </div>
        <nav className="nav">
          {[['dashboard','Dashboard'],['planner','Planner'],['documents','Documents'],['email','Email']].map(([key,label]) => (
            <button key={key} className={`nav-btn${activeNav===key?' active':''}`} onClick={() => setActiveNav(key)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">FIRMA TEAM SYSTEM v1.0</div>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Dashboard */}
        {activeNav === 'dashboard' && (
          <div className="section">
            <h1 className="page-title">FIRMA WORKSPACE</h1>
            <p className="page-sub">SOLDIERS OF HEAVEN — Operational Hub</p>
            <div className="card-grid">
              <div className="card" onClick={() => setActiveNav('planner')}>
                <div className="card-icon">📋</div>
                <div className="card-label">Planner</div>
                <div className="card-count">{plannerItems.length} item(s)</div>
              </div>
              <div className="card" onClick={() => setActiveNav('documents')}>
                <div className="card-icon">📁</div>
                <div className="card-label">Documents</div>
                <div className="card-count">{DOCS.length} docs</div>
              </div>
              <div className="card" onClick={() => setActiveNav('email')}>
                <div className="card-icon">✉️</div>
                <div className="card-label">Email</div>
                <div className="card-count">Gmail / Outlook</div>
              </div>
            </div>
            <div className="upcoming-section">
              <h2 className="section-title">Upcoming</h2>
              {plannerItems.length === 0 ? <p className="empty">No upcoming items</p> : (
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

        {/* Planner */}
        {activeNav === 'planner' && (
          <div className="section">
            <h1 className="page-title">Planner</h1>
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

        {/* Documents */}
        {activeNav === 'documents' && !selectedDoc && (
          <div className="section">
            <h1 className="page-title">Documents</h1>
            <div className="doc-grid">
              {DOCS.map(doc => (
                <div key={doc.id} className="doc-card" onClick={() => setSelectedDoc(doc)}>
                  <div className="doc-icon">📄</div>
                  <div className="doc-title">{doc.title}</div>
                  <div className="doc-sub">{doc.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === 'documents' && selectedDoc && (
          <div className="section">
            <button className="btn-back" onClick={() => setSelectedDoc(null)}>← Back</button>
            <h1 className="page-title">{selectedDoc.title}</h1>
            <p className="page-sub">{selectedDoc.subtitle}</p>
            <div className="doc-content">{selectedDoc.content}</div>
            <h3 className="notes-label">Notes</h3>
            <textarea
              className="textarea"
              placeholder="Add your notes here..."
              value={docNotes[selectedDoc.id] || ''}
              onChange={e => setDocNotes({...docNotes, [selectedDoc.id]: e.target.value})}
            />
          </div>
        )}

        {/* Email */}
        {activeNav === 'email' && (
          <div className="section">
            <h1 className="page-title">Email</h1>
            <div className="email-form">
              <div className="provider-row">
                <label className="label">Send via</label>
                <select className="select" value={emailForm.provider} onChange={e=>setEmailForm({...emailForm,provider:e.target.value})}>
                  <option value="gmail">Gmail</option>
                  <option value="outlook">Outlook</option>
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
      </main>
    </div>
  )
}
