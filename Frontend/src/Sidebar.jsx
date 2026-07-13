import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
   
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, userToken } = useContext(MyContext);
    
    const [isCollapsed, setIsCollapsed] = useState(false);

    const getAllThreads = async () => {
        try {
           
            const response = await fetch("https://lumina-z6qm.onrender.com/api/thread", {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
           
            const response = await fetch(`https://lumina-z6qm.onrender.com/api/thread/${newThreadId}`, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            
            const response = await fetch(`https://lumina-z6qm.onrender.com/api/thread/${threadId}`, { 
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            
            {}
            <div className="sidebarHeader">
                <button className="menuBtn" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="brandName">Lumina</div>
            </div>

            {}
            <div className="newChatContainer">
                <button className="geminiNewChat" onClick={createNewChat}>
                    <i className="fa-solid fa-plus"></i>
                    <span className="newChatText">New chat</span>
                </button>
            </div>

            {}
            <div className="historyContainer">
                <p className="recentHeading">Recent</p>
                <ul className="history">
                    {
                        allThreads?.map((thread, idx) => (
                            <li key={idx}
                                onClick={(e) => changeThread(thread.threadId)}
                                className={thread.threadId === currThreadId ? "highlighted" : " "}
                            >
                                {thread.title}
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))
                    }
                </ul>
            </div>

            {}
            <div className="sign">
                <p>By Garv</p>
            </div>
        </section>
    )
}

export default Sidebar;