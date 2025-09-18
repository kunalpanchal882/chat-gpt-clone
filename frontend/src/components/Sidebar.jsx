import { useDispatch, useSelector } from 'react-redux';
import './Sidebar.css';
import { selectChat } from '../store/chatslice';

export default function Sidebar({ conversations, createNewChat, sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const { activeChatId } = useSelector((state) => state.chat);

  // console.log(activeChatId);

  // console.log(conversations);
  
  

  return (
    <>
      {/* backdrop for mobile */}
      <div
        className={`backdrop ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Close button */}
        <button
          className="close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close chats"
        >
          ×
        </button>

        {/* Navigation */}
        <div className="left-nav">
          <ul className="nav-list" role="navigation" aria-label="Main">
            <li className="nav-item" onClick={createNewChat}>New chat</li>
            <li className="nav-item">Search</li>
            <li className="nav-item">Library</li>
            <li className="nav-item">Sora</li>
          </ul>
        </div>

        {/* Sidebar header */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="previous-chats-label">Previous Chats</div>
          </div>
          <button className="new-chat-btn" onClick={createNewChat} title="New chat">
            +
          </button>
        </div>

        {/* Conversations list */}
        <ul className="conversations">
          {conversations.map((c) => (
            <li
              key={c.id}
              className={`conversation-item ${c.id === activeChatId?.id ? 'active' : ''}`}
              onClick={() => dispatch(selectChat({ id: c.id, title: c.title }))}
            >
              <div className="avatar" aria-hidden />
              <div className="meta">
                <div className="name">{c.title}</div>
                <div className="preview">{c.last || 'No messages yet'}</div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
