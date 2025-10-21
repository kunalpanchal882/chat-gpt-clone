
import './Message.css'

export default function Message({ message }) {

  
  if (!message) return null
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">{message.text}</div>
    </div>
  )
}
