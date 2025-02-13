'use client'
import React, { useState, useEffect } from "react";
import "./chatbot.css";
import { template } from "../data";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { CHATBOT_URL } from "../config";
 

const Chatbot = () => {
  const [msg, setMsg] = useState("");
  const [botresponse, setBotresponse] = useState([
    { message: "Hello, I am Alexa. How can I help you?", type: "bot" },
  ]);

  const geminiAPIKEY : any= process.env.NEXT_PUBLIC_GEMINI_KEY ;

  useEffect(() => {
    console.log(botresponse);
  }, [botresponse]);

  const handleClick = async () => {
    try {
      setBotresponse((prevBotresponse) => [
        ...prevBotresponse,
        { message: msg, type: "user" },
      ]);
  
      // Change API URL to your ngrok endpoint
      const response = await fetch(`${CHATBOT_URL}/chat`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: msg }),
      });
  
      const data = await response.json();
  
      if (data.response) {
        setBotresponse((prevBotresponse) => [
          ...prevBotresponse,
          { message: data.response, type: "bot" },
        ]);
      } else {
        setBotresponse((prevBotresponse) => [
          ...prevBotresponse,
          { message: "Error: No response from server.", type: "bot" },
        ]);
      }
  
      setMsg(""); // Reset the input field
  
    } catch (error) {
      console.error("Fetch error:", error);
      setBotresponse((prevBotresponse) => [
        ...prevBotresponse,
        { message: "Error: Unable to reach the server.", type: "bot" },
      ]);
    }
  };
  

  return (
      <div className="chat-container">
        
        <div className="content">
          {botresponse.map((item, index) => {
            return item.type === "bot" ? (
              <div className="res" key={index}>
                
                <div className="msg">
                  <p>{item.message}</p>
                </div>
              </div>
            ) : (
              <div className="que" key={index}>
                
                <div className="uque">
                  <p>{item.message}</p>
                </div>
              </div>
            );
          })}
          <div className="enter-message">
            <input
              type="text"
              className="input"
              placeholder=""
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick();
                }
              }}
            />
            <button className="send-btn" onClick={handleClick}>
              Send
            </button>
          </div>
        </div>
      </div>
  );
};

export default Chatbot;