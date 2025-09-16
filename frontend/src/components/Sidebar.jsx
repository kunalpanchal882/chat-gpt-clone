
import './Sidebar.css'

export default function Sidebar({ conversations = [], createNewChat, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <div className={`backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close chats">×</button>
            <div>Previous Chats</div>
          </div>
          <button className="new-chat-btn" onClick={createNewChat} title="New chat">
            +
          </button>
        </div>
        <ul className="conversations">
          {conversations.map((c) => (
            <li key={c.id} className="conversation-item">
              <div className="conv-title">{c.title}</div>
              <div className="conv-last">{c.last}</div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
