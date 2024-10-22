import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
const API = import.meta.env.VITE_API_URL;
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
  const [showAlert, setShowAlert] = useState(false);
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

  const handleUserClick = async (userId: number) => {
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
      {showAlert && (
        <div className="custom-alert-overlay">
          <div className="custom-alert">
            <h3>Are you sure you want to log out?</h3>
            <div className="button-container">
              <button
                onClick={() => {
                  handleLogout();
                  setShowAlert(false);
                }}
                className="confirm-button"
              >
                Yes
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="cancel-button"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
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
              onClick={() => setShowAlert(true)}
            />
          </button>
        </div>
      </div>
      {userData?.type === "business_owner" ? (
        <div className="chatbot-details">
          <h2>Chatbot Messages</h2>
          <button onClick={() => navigate("/chatbot")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
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
              {chatbotData?.map((entry, index) => (
                <tr key={index}>
                  {/* <td>{index + 1}</td> Index */}
                  <td>{entry.message}</td> 
                  <td>{entry.reply}</td>
                  <td>
                    <button onClick={() => handleEdit(entry.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(entry.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                      Delete
                    </button>
                  </td>{" "}
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
                    onClick={() => handleUserClick(user.userId)}
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
