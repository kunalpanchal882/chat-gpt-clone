import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Composer from "../components/Composer";
import Message from "../components/Message";
import Sidebar from "../components/Sidebar";
import "../style/Home.css";
import { BiMenuAltLeft } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats,
} from "../store/chatslice";
import axios from "axios";

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
      .get("http://localhost:3000/chat/", { withCredentials: true })
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

    const tempSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    setSocket(tempSocket);

    tempSocket.on("ai-response", (messagePayload) => {
      setMessages((prev) => [
        ...prev,
        { type: "ai", content: messagePayload.content },
      ]);
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

    dispatch(sendingFinished());
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
      "http://localhost:3000/chat/",
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
        `http://localhost:3000/chat/message/${chatId}`,
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
            messages.map((m, idx) => (
              <Message key={idx} message={{ role: m.type, text: m.content }} />
            ))
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
