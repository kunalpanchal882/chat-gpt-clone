

import './Composer.css'

export default function Composer({ input, setInput, onKeyDown, sendMessage, isSending }) {
  return (
    <div className="composer">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a message and press Enter to send"
        rows={1}
      />
      <div className="actions">
        <button
          className="send"
          onClick={sendMessage}
          disabled={isSending || !input.trim()}
          aria-label="Send message"
          title="Send"
        >
          {isSending ? (
            '...'
          ) : (
            <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
