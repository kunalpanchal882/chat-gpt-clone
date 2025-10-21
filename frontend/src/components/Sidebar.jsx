import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.css";
import { selectChat } from "../store/chatslice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from ".././store/chatslice";

export default function Sidebar({
  conversations,
  createNewChat,
  sidebarOpen,
  setSidebarOpen,
}) {
  const dispatch = useDispatch();
  const { activeChatId, isLoggedIn } = useSelector((state) => state.chat);

  const navigate = useNavigate();
  // console.log(activeChatId);

  // console.log(conversations);

  const handelnavigateLogin = () => {
    navigate("/login");
  };
  const handelnavigateregister = () => {
    navigate("/register");
  };

  const handelLogOut = () => {
    axios
      .post("http://localhost:3000/auth/logout", {}, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        dispatch(logout());
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  console.log("loggedin",isLoggedIn);
  

  return (
    <>
      {/* backdrop for mobile */}
      <div
        className={`backdrop ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
            <li className="nav-item" onClick={createNewChat}>
              New chat
            </li>
            {/* <li className="nav-item">Search</li>
            <li className="nav-item">Library</li> */}
            {/* <li className="nav-item">Sora</li> */}
          </ul>
        </div>

        {/* Sidebar header */}
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="previous-chats-label">Previous Chats</div>
          </div>
          <button
            className="new-chat-btn"
            onClick={createNewChat}
            title="New chat"
          >
            +
          </button>
        </div>

        {/* Conversations list */}
        <ul className="conversations">
          {conversations.map((c) => (
            <li
              key={c.id}
              className={`conversation-item ${
                c.id === activeChatId?.id ? "active" : ""
              }`}
              onClick={() => dispatch(selectChat({ id: c.id, title: c.title }))}
            >
              <div className="avatar" aria-hidden />
              <div className="meta">
                <div className="name">{c.title}</div>
                <div className="preview">{c.last || "No messages yet"}</div>
              </div>
            </li>
          ))}
        </ul>

        {isLoggedIn ? (
          <div className="Logout" onClick={handelLogOut}>
            <button>Log Out</button>
          </div>
        ) : (
          <div className="login-register-container">
            <button onClick={handelnavigateLogin}>Login</button>
            <button onClick={handelnavigateregister}>Sign UP</button>
          </div>
        )}
      </aside>
    </>
  );
}
