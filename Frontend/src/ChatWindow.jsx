import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";

function ChatWindow() {
    const { 
        prompt, setPrompt, 
        reply, setReply, 
        currThreadId, 
        setPrevChats, 
        setNewChat, 
        newChat, 
        prevChats, 
        userToken, 
        handleLogout 
    } = useContext(MyContext);
    
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const isCentered = newChat || !prevChats || prevChats.length === 0;

    const getReply = async () => {
        if (!prompt.trim()) return;

        const currentPrompt = prompt;
        setPrompt("");
        setLoading(true);
        setNewChat(false);
        setReply(null); 

        setPrevChats(prev => [...prev, { role: "user", content: currentPrompt }]);
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}` 
            },
            body: JSON.stringify({
                message: currentPrompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("https://lumina-z6qm.onrender.com/api/chat", options);

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    throw new Error("Session expired.");
                }
                throw new Error("Server error");
            }

            const res = await response.json();
            setPrevChats(prev => [...prev, { role: "assistant", content: res.reply }]);
            setReply(res.reply);
        } catch(err) {
            setPrevChats(prev => [...prev, { role: "assistant", content: "Something went wrong." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`chatWindow ${isCentered ? 'new-chat-glow' : ''}`}>
            
            <div className="navbar">
                <div></div> 
                <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            
            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem" onClick={handleLogout} style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
            )}
            
            {/* The Chat component now has space to handle its own left/right alignment */}
            {!isCentered && <Chat loading={loading} />}
            
            <div className={`chatInputWrapper ${isCentered ? 'centered' : 'bottom'}`}>
                {isCentered && <h1 className="heroHeading">Start a new chat</h1>}
                
                <div className="chatInput">
                    <div className="inputBox">
                        <input 
                            placeholder="Ask anything"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') getReply(); }}
                        />
                        <div id="submit" onClick={getReply}>
                            <i className="fa-solid fa-paper-plane"></i>
                        </div>
                    </div>
                    
                    {!isCentered && (
                        <p className="info">Lumina can make mistakes. Check important info.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatWindow;