
import './Sidebar.css'

export default function Sidebar({ conversations = [], createNewChat, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <div className={`backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close chats">×</button>
        <div className="left-nav">
          <ul className="nav-list" role="navigation" aria-label="Main">
            <li className="nav-item" onClick={createNewChat}>New chat</li>
            <li className="nav-item">Search</li>
            <li className="nav-item">Library</li>
            <li className="nav-item">Sora</li>
            <li className="nav-item">GPTs</li>
            <li className="nav-item">New project</li>
          </ul>
        </div>

        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            
            <div className="previous-chats-label">Previous Chats</div>
          </div>
          <button className="new-chat-btn" onClick={createNewChat} title="New chat">
            +
          </button>
        </div>

        <ul className="conversations">
          {conversations.map((c) => (
            <li key={c.id} className="conversation-item">
              <div className="avatar" aria-hidden />
              <div className="meta">
                <div className="name">{c.title}</div>
                <div className="preview">{c.last}</div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
