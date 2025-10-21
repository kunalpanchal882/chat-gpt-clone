import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Composer from "../components/Composer";
import Message from "../components/Message";
import Sidebar from "../components/Sidebar";
import {
  selectChat,
  sendingFinished,
  sendingStarted,
  setChats,
  setInput,
} from "../store/chatslice";
import "../style/Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId, input, isSending } = useSelector(
    (state) => state.chat
  );

  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const chatId = activeChatId?.id;

  // Fetch chats and initialize socket
  useEffect(() => {
    axios
      .get("https://chat-gpt-clone-epy3.onrender.com/chat/", { withCredentials: true })
      .then((res) => {
        const apiChats = res.data.chats.map((c) => ({
          id: c._id,
          title: c.title,
        }));
        dispatch(setChats(apiChats.reverse()));
      })
      .catch((err) => {
        console.error("Error fetching chats:", err);
      });

    const tempSocket = io("https://chat-gpt-clone-epy3.onrender.com", {
      withCredentials: true,
    });

    setSocket(tempSocket);

    tempSocket.on("ai-response", (messagePayload) => {
      setMessages((prev) => {
        // agar last message AI ka hi hai, usko append karo
        if (
          prev.length > 0 &&
          prev[prev.length - 1].type === "ai" &&
          !messagePayload.done
        ) {
          const updated = [...prev];
          updated[updated.length - 1].content += messagePayload.content;
          return updated;
        }

        // agar naya AI response start hua
        if (!messagePayload.done) {
          return [...prev, { type: "ai", content: messagePayload.content }];
        }

        // jab done true ho jaye, kuch extra karna ho to yahan (optional)
        return prev;
      });

      // Stop typing when AI is done
  if (messagePayload.done) {
    dispatch(sendingFinished());
  }

    });
  }, [dispatch]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !chatId) return;

    setMessages((prev) => [...prev, { type: "user", content: trimmed }]);
    dispatch(setInput(""));
    dispatch(sendingStarted());

    socket.emit("ai-message", { chat: chatId, content: trimmed });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createNewChat = async () => {
    const name = window.prompt("Enter a name for the new chat", "New chat");
    if (!name) return;

    const title = name.trim();
    const res = await axios.post(
      "https://chat-gpt-clone-epy3.onrender.com/chat/",
      { title },
      { withCredentials: true }
    );

    getMessages(res.data.chat._id);
    dispatch(selectChat({ title: res.data.chat.title, id: res.data.chat._id }));
    setSidebarOpen(false);
  };

  const getMessages = async (chatId) => {
    try {
      const res = await axios.get(
        `https://chat-gpt-clone-epy3.onrender.com/chat/message/${chatId}`,
        { withCredentials: true }
      );

      if (res.data.messages) {
        setMessages(
          res.data.messages.map((m) => ({
            type: m.role === "user" ? "user" : "ai",
            content: m.content,
          }))
        );
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  };

  // Fetch messages whenever active chat changes
  useEffect(() => {
    if (chatId) {
      getMessages(chatId);
    } else {
      setMessages([]);
    }
  }, [chatId]);

  console.log("ai reposne",isSending);
  

  return (
    <div className="home-root">
      <Sidebar
        conversations={chats}
        createNewChat={createNewChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="chat-area">
        <div className="chat-header">
          <BiMenuAltLeft
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open chats"
          />
        </div>

        {/* <div className="messages" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="chip">Early Preview</div>
              <h1 className="welcome-title">ChatGPT Clone</h1>
              <p className="welcome-subtitle">
                Ask anything. Paste text, brainstorm ideas, or get quick <br />
                explanations. Your chats stay in the sidebar so you can pick up{" "}
                <br />
                where you left off.
              </p>
            </div>
          ) : (
            messages.map((m, idx) => (
              <Message key={idx} message={{ role: m.type, text: m.content }} />
            ))
          )}
        </div> */}

        <div className="messages" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="chip">Early Preview</div>
              <h1 className="welcome-title">ChatGPT Clone</h1>
              <p className="welcome-subtitle">
                Ask anything. Paste text, brainstorm ideas, or get quick <br />
                explanations. Your chats stay in the sidebar so you can pick up{" "}
                <br />
                where you left off.
              </p>
            </div>
          ) : (
            <>
              {messages.map((m, idx) => (
                <Message
                  key={idx}
                  message={{ role: m.type, text: m.content }}
                />
              ))}

              {/* ✅ Show typing indicator when AI is responding */}
              {isSending && (
                <div className="ai-typing">
                  <span>🤖 Typing</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </div>
              )}
            </>
          )}
        </div>

        {chatId && (
          <Composer
            input={input}
            setInput={(val) => dispatch(setInput(val))}
            onKeyDown={onKeyDown}
            sendMessage={sendMessage}
            isSending={isSending}
          />
        )}
      </main>
    </div>
  );
};

export default Home;
