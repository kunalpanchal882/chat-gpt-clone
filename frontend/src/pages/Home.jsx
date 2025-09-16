import { useEffect, useRef, useState } from 'react'
import Composer from '../components/Composer'
import Message from '../components/Message'
import Sidebar from '../components/Sidebar'
import '../style/Home.css'

const sampleConversations = [
  { id: 1, title: 'Chat about React', last: 'How to use hooks?' },
  { id: 2, title: 'Project ideas', last: 'Build a chat app' },
]

const Home = () => {
  // State variables requested by the user
  const [conversations, setConversations] = useState(sampleConversations)
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! Ask me anything.' },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const scrollRef = useRef(null)

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Minimal AI call: try backend endpoint, fallback to a local echo reply
  const getAiReply = async (text) => {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (!res.ok) throw new Error('bad response')
      const data = await res.json()
      return data.reply || 'Sorry, no reply.'
    } catch {
      // fallback echo with slight transformation
      return `AI: I received '${text}'. (local fallback)`
    }
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setIsSending(true)

    const replyText = await getAiReply(trimmed)
    const aiMsg = { id: Date.now() + 1, role: 'assistant', text: replyText }
    setMessages((m) => [...m, aiMsg])
    setIsSending(false)

    // add to conversations list (simple recent-first behavior)
    setConversations((c) => [
      { id: Date.now(), title: trimmed.slice(0, 30) || 'New chat', last: trimmed },
      ...c,
    ])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const createNewChat = () => {
    // prompt for a chat name; simple and synchronous for now
    // window.prompt returns `null` when the user cancels.
    // Only create a new chat when the user clicked OK (name !== null).
    const name = window.prompt('Enter a name for the new chat', 'New chat')
    if (name === null) {
      // user cancelled the prompt; do nothing and keep sidebar state
      return
    }

    const title = name && name.trim() ? name.trim() : 'New chat'
    const newConv = { id: Date.now(), title, last: '' }
    setConversations((c) => [newConv, ...c])
    setMessages([])
    setSidebarOpen(false)
  }

  return (
    <div className="home-root">
      <Sidebar
        conversations={conversations}
        createNewChat={createNewChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="chat-area">
        <div className="chat-header">
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open chats">
            ☰
          </button>
          <div>Chat with AI</div>
        </div>
        <div className="messages" ref={scrollRef}>
          {messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
        </div>

        <Composer
          input={input}
          setInput={setInput}
          onKeyDown={onKeyDown}
          sendMessage={sendMessage}
          isSending={isSending}
        />
      </main>
    </div>
  )
}

export default Home