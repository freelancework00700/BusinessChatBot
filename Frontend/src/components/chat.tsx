import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/chat.css";
import { ThreeDots } from "react-loader-spinner";
const API = import.meta.env.VITE_API_URL;

interface LoginUser {
  id: number;
  name: string;
  avatar: string;
}
interface Message {
  id: number;
  message: string;
  sendBy: string;
  avatar?: string;
}

const USER_AVATAR =
  "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg";
const BOT_AVATAR =
  "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg";

const Chat = () => {
  const user = localStorage.getItem("user");
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [showLoader, setShowLoader] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("id");
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const parsedUser = user ? JSON.parse(user) : null;

      if (parsedUser && parsedUser.email) {
        const name = parsedUser.email.split("@")[0];
        setLoginUser({ id: parsedUser.id, name, avatar: USER_AVATAR });
      } else {
        setError("User data not found. Please log in.");
        return;
      }

      const response = await fetch(`${API}/message/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      const sortedMessages = data.data.sort((a: any, b: any) => a.id - b.id);

      const fetchedMessages: Message[] = sortedMessages.map((msg: any) => {
        const senderName = msg.User ? msg.User.email.split("@")[0] : "User";
        return {
          id: msg.id,
          message: msg.message,
          sendBy: senderName,
          avatar: msg.User.id === parsedUser.id ? USER_AVATAR : BOT_AVATAR,
        };
      });

      setMessages(fetchedMessages);
      setError(null);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    }
  };

  // Loader
  const DotLoader = () => {
    return (
      <ThreeDots
        height="50"
        width="50"
        radius="9"
        color="#435c75"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        visible={true}
      />
    );
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const handleSend = async () => {
    if (input.trim() !== "") {
      try {
        const response = await fetch(`${API}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            message: input,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const newMessage: Message = {
          id: messages.length + 1,
          message: data.data.message,
          sendBy: loginUser?.name || "user",
          avatar: USER_AVATAR,
        };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setError(null);
        setShowLoader(true);

        setTimeout(() => {
          fetchMessages();
          setShowLoader(false);
        }, 2000);
      } catch (error: any) {
        setError(
          error.message ||
            "An unexpected error occurred while sending the message"
        );
      }
    } else {
      setError("Message cannot be empty");
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
        <h2>Chat</h2>
      </div>
      <div className="messages">
        {messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sendBy === loginUser?.name ? "user" : "bot"
                }`}
              >
                <img
                  src={msg.avatar}
                  alt={`${msg.sendBy} avatar`}
                  className="avatar"
                />
                <div className="message-content">
                  {/* <strong>
                    {msg.sendBy === loginUser?.name
                      ? loginUser.name
                      : msg.sendBy}
                  </strong> */}
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
            {showLoader && <p>{<DotLoader />}</p>}
          </>
        ) : (
          <div className="no-messages">
            No messages found. Start the conversation!
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
