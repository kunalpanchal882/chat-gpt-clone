import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Composer from "../components/Composer";
import Message from "../components/Message";
import Sidebar from "../components/Sidebar";
import "../style/Home.css";
import { BiMenuAltLeft } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import {
  ensureInitialChat,
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  addUserMessage,
  addAIMessage,
  setChats,
} from "../store/chatslice"; // adjust path if needed
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId, input, isSending } = useSelector(
    (state) => state.chat
  );

  const [socket, setSocket] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false); // keep sidebar local
  const scrollRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  

  const chatId = activeChatId?.id;

  console.log(chatId);

  const [messages, setmessages] = useState([]);

  // ensure one chat exists at start
  useEffect(() => {
    axios
      .get("http://localhost:3000/chat/", { withCredentials: true })
      .then((res) => {
        const apiChats = res.data.chats.map((c) => ({
          id: c._id, // slice ke liye id
          title: c.title, // slice ke liye title    // abhi backend se messages nahi aa rahe to empty rakho
        }));

        // slice me save karo
        dispatch(setChats(apiChats.reverse()));
      })
      .catch((err) => {
        console.error("Error fetching chats:", err);
      });

    const tempSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    setSocket(tempSocket);

    tempSocket.on("ai-response", (messagepayload) => {
      console.log("ai message", messagepayload);

      setmessages((c) => [
        ...c,
        {
          type: "ai",
          content: messagepayload.content,
        },
      ]);
    });
  }, []);

  // auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    console.log("sendMessage CALLED");
    const trimmed = input.trim();

    if (!trimmed || !activeChatId) return;

    console.log("Sending:", trimmed, "ChatId:", activeChatId);

    // add user message to active chat
    // dispatch(addUserMessage(activeChatId, trimmed));
    setmessages((p) => [
      ...p,
      {
        type: "user",
        content: trimmed,
      },
    ]);
    dispatch(setInput(""));
    dispatch(sendingStarted());

    socket.emit("ai-message", {
      chat: activeChatId.id,
      content: trimmed,
    });

    // get AI reply

    // dispatch(addAIMessage(activeChatId, replyText));
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
    if (name === null) return;
    const title = name && name.trim();

    const res = await axios.post("http://localhost:3000/chat/",
      {
        title,
      },
      {
        withCredentials: true,
      }
    );

    getMessage(res.data.chat._id)

    console.log(res.data);
    dispatch(selectChat({ title: res.data.chat.title, id: res.data.chat._id }));
    setSidebarOpen(false);
  };

  const getMessage = async (chatId) => {
  try {
    const res = await axios.get(`http://localhost:3000/chat/message/${chatId}`, {
      withCredentials: true
    });

    console.log(res.data.messages);

    if (res.data.messages) {
      setmessages(
        res.data.messages.map((m) => ({
          type: m.role === 'user' ? 'user' : 'ai',
          content: m.content
        }))
      );
    } else {
      setmessages([]);
    }
  } catch (err) {
    console.error("Error fetching messages:", err);
    setmessages([]);
  }
};

// Fetch messages whenever active chat changes
useEffect(() => {
  if (activeChatId?.id) {
    getMessage(activeChatId.id);
  } else {
    setmessages([]);
  }
}, [activeChatId]);


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
        {activeChatId?.id &&
          <Composer
          input={input}
          setInput={(val) => dispatch(setInput(val))}
          onKeyDown={onKeyDown}
          sendMessage={sendMessage}
          isSending={isSending}
        />}
      </main>
    </div>
  );
};

export default Home;
