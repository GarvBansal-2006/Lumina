import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, newChat, prevChats} = useContext(MyContext);
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

        console.log("message ", currentPrompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: currentPrompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("https://lumina-z6qm.onrender.com/api/chat", options);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const res = await response.json();
            console.log(res);

            if (!res.reply) {
                throw new Error("No reply received from server");
            }
            
            setPrevChats(prev => [...prev, { role: "assistant", content: res.reply }]);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
            const fallbackMessage = "Something went wrong. Please try again in a moment.";
            setPrevChats(prev => [...prev, { role: "assistant", content: fallbackMessage }]);
            setReply(fallbackMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={`chatWindow ${isCentered ? 'new-chat-glow' : ''}`}>
            <div className="navbar">
                <div></div> 
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            
            {}
            {!isCentered && <Chat loading={loading} />}
            
            <div className={`chatInputWrapper ${isCentered ? 'centered' : 'bottom'}`}>
                {isCentered && <h1 className="heroHeading">Start a new chat</h1>}
                
                <div className="chatInput">
                    <div className="inputBox">
                        <input placeholder="Ask anything"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') getReply(); }}
                        />
                        <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                    </div>
                    
                    {!isCentered && (
                        <p className="info">
                            Lumina can make mistakes. Check important info. See Cookie Preferences.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatWindow;