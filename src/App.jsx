import { useState } from 'react'

const ARCHITECTURE_DOCS = [
  { id: 1, title: 'BATAAN-FRAMEWORK', section: 'Foundation', badge: 'Framework', subtitle: 'FIT PH/SEA — MASTER CLARIFICATION & PRIORITY CHECKLIST', content: `BATAAN FRAMEWORK v2\n\nFIT PH/SEA — MASTER CLARIFICATION & PRIORITY CHECKLIST\n\nThis document outlines the priority action items and clarifications needed for the Bataan Framework implementation. Key focus areas include organizational structure, compliance requirements, and operational deployment for the FIT PH/SEA initiative.` },
  { id: 2, title: 'SOVEREIGN ENGAGEMENT LAYER', section: 'Vision', badge: 'Strategy', subtitle: "FIRMA: MIDDLE GROUND — Russia's Federal Constitutional Law", content: `SOVEREIGN ENGAGEMENT LAYER\n\nFIRMA: MIDDLE GROUND\n\nThis document covers the strategic framework for sovereign engagement, drawing parallels from Russia's Federal Constitutional Law to establish a middle-ground approach for FIRMA's international operations and engagement protocols.` }
]

const EMAIL_ACCOUNTS = [
  { id: 'gmail', label: 'Gmail', provider: 'gmail' },
  { id: 'outlook', label: 'Outlook', provider: 'outlook' }
]

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [plannerItems, setPlannerItems] = useState([{ id: 1, title: 'Ocular visit in Bataan', date: '2026-04-25', notes: 'Site inspection', status: 'todo' }, { id: 2, title: 'Review compliance documents', date: '2026-04-26', notes: 'Legal review', status: 'inprogress' }])
  const [newTask, setNewTask] = useState({ title: '', date: '', notes: '', status: 'todo' })
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [emailForm, setEmailForm] = useState({ account: 'gmail', to: '', subject: '', body: '' })
  const [emailSent, setEmailSent] = useState(false)
  const [documents, setDocuments] = useState([{ id: 1, name: 'Project Proposal.pdf', size: '2.4 MB', date: '2026-04-20', type: 'PDF' }, { id: 2, name: 'Budget Estimate.xlsx', size: '1.8 MB', date: '2026-04-21', type: 'XLS' }])

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

  const todoTasks = plannerItems.filter(t => t.status === 'todo')
  const inprogressTasks = plannerItems.filter(t => t.status === 'inprogress')
  const doneTasks = plannerItems.filter(t => t.status === 'done')
  const completionRate = plannerItems.length > 0 ? Math.round((doneTasks.length / plannerItems.length) * 100) : 0

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
            <button key={key} className={`nav-btn${activeNav===key?' active':''}`} onClick={() => setActiveNav(key)}>{label}</button>
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
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">{plannerItems.length}</div>
                <div className="metric-label">Active Tasks</div>
                <div className="metric-change up">+{plannerItems.filter(t=>new Date(t.date)>new Date()).length} upcoming</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{documents.length}</div>
                <div className="metric-label">Documents</div>
                <div className="metric-change up">+2 this week</div>
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
              <div className="card" onClick={() => setActiveNav('planner')}>
                <div className="card-icon">📋</div>
                <div className="card-title">Planner</div>
                <div className="card-count">{plannerItems.length} task(s)</div>
              </div>
              <div className="card" onClick={() => setActiveNav('documents')}>
                <div className="card-icon">📄</div>
                <div className="card-title">Documents</div>
                <div className="card-count">{documents.length} docs</div>
              </div>
              <div className="card" onClick={() => setActiveNav('email')}>
                <div className="card-icon">✉️</div>
                <div className="card-title">Email</div>
                <div className="card-count">0 sent</div>
              </div>
            </div>
            <div className="upcoming-section">
              <div className="section-title">Upcoming</div>
              {plannerItems.length === 0 ? <div className="empty">No upcoming tasks</div> : plannerItems.map(t => (
                <div key={t.id} className="task-row">
                  <div className="task-title">{t.title}</div>
                  {t.date && <div className="task-date">{t.date}</div>}
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
                  {todoTasks.length===0?<div className="kanban-empty">No tasks</div>:todoTasks.map(t=>(
                    <div key={t.id} className="kanban-task">
                      <div className="kanban-task-title">{t.title}</div>
                      {t.date&&<div className="kanban-task-meta"><span>📅 {t.date}</span></div>}
                      {t.notes&&<div className="task-notes">{t.notes}</div>}
                      <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                        <button className="doc-action-btn" onClick={()=>updateTaskStatus(t.id,'inprogress')}>Start</button>
                        <button className="doc-action-btn" onClick={()=>removeTask(t.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="kanban-column">
                <div className="kanban-header">In Progress <span className="kanban-count">{inprogressTasks.length}</span></div>
                <div className="kanban-tasks">
                  {inprogressTasks.length===0?<div className="kanban-empty">No tasks</div>:inprogressTasks.map(t=>(
                    <div key={t.id} className="kanban-task">
                      <div className="kanban-task-title">{t.title}</div>
                      {t.date&&<div className="kanban-task-meta"><span>📅 {t.date}</span></div>}
                      {t.notes&&<div className="task-notes">{t.notes}</div>}
                      <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                        <button className="doc-action-btn" onClick={()=>updateTaskStatus(t.id,'done')}>Complete</button>
                        <button className="doc-action-btn" onClick={()=>updateTaskStatus(t.id,'todo')}>Move Back</button>
                        <button className="doc-action-btn" onClick={()=>removeTask(t.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="kanban-column">
                <div className="kanban-header">Done <span className="kanban-count">{doneTasks.length}</span></div>
                <div className="kanban-tasks">
                  {doneTasks.length===0?<div className="kanban-empty">No completed tasks</div>:doneTasks.map(t=>(
                    <div key={t.id} className="kanban-task">
                      <div className="kanban-task-title">{t.title}</div>
                      {t.date&&<div className="kanban-task-meta"><span>📅 {t.date}</span></div>}
                      {t.notes&&<div className="task-notes">{t.notes}</div>}
                      <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                        <button className="doc-action-btn" onClick={()=>updateTaskStatus(t.id,'inprogress')}>Reopen</button>
                        <button className="doc-action-btn" onClick={()=>removeTask(t.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeNav === 'documents' && (
          <div className="section">
            <div className="page-header">
              <div className="page-pre">Documents</div>
              <h1 className="page-title">Your <em>library</em></h1>
            </div>
            <div className="doc-list">
              {documents.map(doc=>(
                <div key={doc.id} className="doc-item">
                  <div className="doc-icon-wrapper">{doc.type}</div>
                  <div className="doc-info">
                    <div className="doc-name">{doc.name}</div>
                    <div className="doc-details">
                      <span>{doc.size}</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <div className="doc-actions">
                    <button className="doc-action-btn">View</button>
                    <button className="doc-action-btn">Download</button>
                  </div>
                </div>
              ))}
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
            {!selectedDoc?(
              <div className="doc-grid">
                {ARCHITECTURE_DOCS.map(doc=>(
                  <div key={doc.id} className="doc-card" onClick={()=>setSelectedDoc(doc)}>
                    <div className="doc-badge">{doc.badge}</div>
                    <div className="doc-title">{doc.title}</div>
                    <div className="doc-sub">{doc.subtitle}</div>
                  </div>
                ))}
              </div>
            ):(
              <div>
                <button className="btn-back" onClick={()=>setSelectedDoc(null)}>← Back to Atlas</button>
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
