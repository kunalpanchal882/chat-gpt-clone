import { FaCircleArrowUp } from "react-icons/fa6";

import './Composer.css'

export default function Composer({ input, setInput, onKeyDown, sendMessage, isSending }) {
  
  
  
  return (
    <div className="composer">
      <div className="composer-inner">
        <button
          className="left-action"
          type="button"
          aria-label="Create"
          title="Create"
        >
          <svg viewBox="0 0 24 24" className="plus-icon" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <textarea
          className="composer-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything"
          aria-label="Message input"
        />

        <div className="right-group">
          <button className="mic-btn" type="button" aria-label="Voice">
            <svg viewBox="0 0 24 24" className="mic-icon" aria-hidden>
              <path d="M12 1v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <rect x="8" y="4" width="8" height="10" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M19 11v1a7 7 0 0 1-14 0v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>

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
              <FaCircleArrowUp className="sendIcons"/>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
