import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/chatbot.css";

interface UserProfile {
  name: string;
  avatar: string;
}
const API = import.meta.env.VITE_API_URL;

const Chatbot = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatbotId = searchParams.get("id");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chatbotData, setChatbotData] = useState<any>({
    message: "",
    reply: "",
    replyType: "Text",
  });
  const token: any = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Loading...",
    avatar:
      "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg",
  });

  const fetchUserData = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }
    const parsedUser = user ? JSON.parse(user) : null;
    if (parsedUser && parsedUser.email) {
      const name = parsedUser.email.split("@")[0];
      setUserProfile((prev) => ({ ...prev, name }));
    } else {
      setError("User data not found. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API}/user`, {
        method: "GET",
        headers: {
          "access-token": `${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await response.json();

      if (!response.ok || !userData.success) {
        throw new Error(userData.message || "Failed to fetch users");
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetChatbot = async () => {
    try {
      const response = await fetch(`${API}/chatbot/${chatbotId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      });

      const data = await response.json();
      setChatbotData(data.data);
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleSubmitChatbot = async () => {
    try {
      if (chatbotId) {
        await fetch(`${API}/chatbot/${chatbotId}`, {
          method: "PUT",
          headers: {
            "access-token": `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatbotData),
        });
        navigate("/dashboard");
      } else {
        await fetch(`${API}/chatbot`, {
          method: "POST",
          headers: {
            "access-token": `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatbotData),
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (chatbotId) {
      handleGetChatbot();
    }
  }, [chatbotId]);

  return (
    <>
      <div className="dashboard-container">
        <div className="header">
          <div className="profile">
            <img
              className="avatar"
              src={userProfile.avatar}
              alt="User Avatar"
            />
            <h3>{userProfile.name}</h3>
          </div>
          <div>
            <button onClick={() => navigate(-1)} className="back-button">
              Back
            </button>
          </div>
        </div>
        <div className="message-content">
          <label>Message</label>
          <input
            type="text"
            placeholder="Type message..."
            value={chatbotData?.message}
            onChange={(e) =>
              setChatbotData({ ...chatbotData, message: e.target.value })
            }
          />
          <br />
          <label>Reply</label>
          <textarea
            placeholder="Type reply..."
            value={chatbotData?.reply}
            onChange={(e) =>
              setChatbotData({ ...chatbotData, reply: e.target.value })
            }
          />
          <button onClick={() => handleSubmitChatbot()}>Save</button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
