import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, newChat, prevChats} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // This guarantees it centers on first load OR when a new chat is clicked
    const isCentered = newChat || !prevChats || prevChats.length === 0;

    const getReply = async () => {
        // Prevent sending empty messages
        if (!prompt.trim()) return;

        const currentPrompt = prompt;
        setPrompt(""); // Clear input box instantly
        setLoading(true);
        setNewChat(false); // Instantly drops the input box down
        setReply(null); // Resets the AI typing effect

        // Instantly display the user's message on the screen!
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
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            
            // Instantly add AI message to history and trigger typing effect
            setPrevChats(prev => [...prev, { role: "assistant", content: res.reply }]);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
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
            
            {/* Passing the loading state directly to the Chat component */}
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