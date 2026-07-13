import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";
import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import Auth from "./Auth.jsx"; 
function App() {
  // --- Authentication States ---
  const [userToken, setUserToken] = useState(localStorage.getItem("token") || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email") || null);

  // --- Existing Chat States ---
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  // --- Sync Auth State with Browser Storage ---
  useEffect(() => {
    if (userToken) {
        localStorage.setItem("token", userToken);
        localStorage.setItem("email", userEmail);
    } else {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
    }
  }, [userToken, userEmail]);

  // --- Secure Logout Function ---
  const handleLogout = () => {
      setUserToken(null);
      setUserEmail(null);
      setPrevChats([]); 
      setAllThreads([]);
      setCurrThreadId(uuidv1()); 
  };

  // --- Context Provider Values ---
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    userToken, setUserToken,
    userEmail, setUserEmail,
    handleLogout
  }; 

  return (
    <MyContext.Provider value={providerValues}>
      {}
      {!userToken ? (
        <Auth />
      ) : (
        <div className='app'>
          <Sidebar />
          <ChatWindow />
        </div>
      )}
    </MyContext.Provider>
  )
}

export default App;