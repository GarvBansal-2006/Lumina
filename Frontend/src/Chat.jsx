import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


function Chat({ loading }) {
    const {prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if(!reply || typeof reply !== "string") {
            setLatestReply(null); 
            return;
        }

        const content = reply.split(" "); 

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));
            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [reply]);
    return (
        <div className="chats">
            {
                prevChats?.map((chat, idx) => {
                    const isLastMessage = idx === prevChats.length - 1;
                    const isAssistant = chat.role === "assistant";
                    const isTyping = isLastMessage && isAssistant && latestReply !== null;
                    const contentToRender = isTyping ? latestReply : chat.content;

                    return (
                        <div className={isAssistant ? "gptDiv" : "userDiv"} key={idx}>
                            {isAssistant ? (
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {typeof contentToRender === "string" ? contentToRender : ""}
                                </ReactMarkdown>
                            ) : (
                                <p className="userMessage">{chat.content}</p>
                            )}
                        </div>
                    )
                })
            }

            {}
            {loading && (
                <div className="gptDiv">
                    <div className="shimmer-container">
                        <div className="shimmer-line"></div>
                        <div className="shimmer-line short"></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chat;