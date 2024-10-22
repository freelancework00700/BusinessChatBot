import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
const API = import.meta.env.VITE_API_URL;

// Interface for UserProfile
interface UserProfile {
  name: string;
  avatar: string;
}

interface User {
  userName: string;
  userId: number;
  type: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Loading...",
    avatar:
      "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [userData, setUserData] = useState<User>();
  const [chatbotData, setChatbotData] = useState<any[]>([]);
  console.log("chatbotData: ", chatbotData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const fetchUserData = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }
    const parsedUser = user ? JSON.parse(user) : null;
    setUserData(parsedUser);
    if (parsedUser && parsedUser.email) {
      const name = parsedUser.email.split("@")[0];
      setUserProfile((prev) => ({ ...prev, name }));
    } else {
      setError("User data not found. Please log in.");
      setLoading(false);
      return;
    }

    // Fetch the user list
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

      const loggedInUserId = parsedUser.id;
      const extractedUserNames = userData.data
        .filter((user: any) => user.id !== loggedInUserId)
        .map((user: any) => ({
          userName: user.email.split("@")[0],
          userId: user.id,
        }));

      // Set users data
      setUsers(extractedUserNames);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (userName: string, userId: number) => {
    try {
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }
      const parsedUser = user ? JSON.parse(user) : null;

      if (!parsedUser.id) {
        setError("No customer ID found. Please log in.");
        return;
      }

      const response = await fetch(`${API}/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
        body: JSON.stringify({
          customer_id: parsedUser.id,
          business_id: userId,
        }),
      });
      const chatData = await response.json();
      const conversationId = chatData.data.id;
      if (!conversationId) {
        throw new Error("No conversation ID found.");
      }

      // Fetch conversation details
      const getConversation = await fetch(
        `${API}/conversation/${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "access-token": token,
          },
        }
      );
      const conversationData = await getConversation.json();

      if (!getConversation.ok || !conversationData.success) {
        throw new Error(
          conversationData.message || "Failed to retrieve conversation data"
        );
      }
      navigate(`/chat?id=${conversationId}`);
    } catch (err: any) {
      console.error("Error handling user click:", err);
      setError(err.message);
    }
  };

  const handleGetChatbotData = async () => {
    try {
      const response = await fetch(`${API}/chatbot`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": token as any,
        },
      });

      const data = await response.json();
      setChatbotData(data.data);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    handleGetChatbotData();
  }, []);
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEdit = (id: number) => {
    navigate(`/chatbot?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API}/chatbot/${id}`, {
        method: "DELETE",
        headers: {
          "access-token": `${token}`,
          "Content-Type": "application/json",
        },
      });
      setChatbotData(chatbotData.filter((entry) => entry.id !== id));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="profile">
          <img className="avatar" src={userProfile.avatar} alt="User Avatar" />
          <h3>{userProfile.name}</h3>
        </div>
        <div className="logout-icons">
          <button className="back-button">
            <img
              src="../../public/logout.png"
              alt="Logout"
              onClick={handleLogout}
            />
          </button>
        </div>
      </div>
      {userData?.type === "business_owner" ? (
        <div className="chatbot-details">
          <h2>Chatbot Messages</h2>
          <button onClick={() => navigate("/chatbot")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
            Add new
          </button>
          <table>
            <thead>
              <tr>
                {/* <th>#</th> */}
                <th>Message</th>
                <th>Reply</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chatbotData.map((entry, index) => (
                <tr key={entry.id}>
                  {/* <td>{index + 1}</td> Index */}
                  <td>{entry.message}</td> {/* Message */}
                  <td>{entry.reply}</td> {/* Reply */}
                  <td>
                    <button onClick={() => handleEdit(entry.id)}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)}>
                      Delete
                    </button>
                  </td>{" "}
                  {/* Actions */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="user-list">
          {users.length > 0 ? (
            <ul>
              {users.map((user, index) => {
                return (
                  <li
                    key={index}
                    className="user-item"
                    onClick={() => handleUserClick(user.userName, user.userId)}
                  >
                    <img
                      className="user-avatar"
                      src="https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"
                      alt={`${user.userName}'s Avatar`}
                    />
                    <div className="user-info">
                      <h4>{user.userName}</h4>
                      {/* <p>Last message preview...</p> */}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
