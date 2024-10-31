import React, { useEffect, useRef, useState } from "react";
import "./ChatBot.css"; // 你可以将原来的样式放入这个文件
import botIcon from "../Images/bot_icon.png";
import userIcon from "../Images/user.png";

export default function ChatBot({ onClose, documentID }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi there! I’m your smart assistant. I can help extract key information and facts from your legal documents. Just send me the text or ask what you need to find within it!",
    },
  ]);
  const [botTyping, setBotTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false); // 用于追踪字数是否超出
  const wordLimit = 5;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAnswerFromServer = async (question) => {
    try {
      const response = await fetch("http://wrapcapstone.com/process-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question, documentID: documentID }), // 发送问题和文档ID
      });

      const data = await response.json();
      if (data.success) {
        return data.answer;
      } else {
        return "Sorry, I couldn't find the answer.";
      }
    } catch (error) {
      console.error("Error fetching the answer from server:", error);
      return "Sorry, something went wrong.";
    }
  };

  const handleSend = async () => {
    const wordCount = inputValue.trim().split(/\s+/).length;
    if (wordCount > wordLimit) {
      setWordLimitExceeded(true);
      return;
    }

    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "user", text: inputValue.trim() },
      ]);
      setInputValue("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }

      const answer = await fetchAnswerFromServer(inputValue.trim());

      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "bot", text: answer },
      ]);
      scrollToBottom();
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    const wordCount = value.trim().split(/\s+/).length;

    setInputValue(value);

    if (wordCount > wordLimit) {
      setWordLimitExceeded(true);
    } else {
      setWordLimitExceeded(false);
    }

    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h3>FactFinder</h3>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
      <div id="messages" className="chatbox-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chatbox-message ${message.from}`}>
            <div className="chatbox-message-content">
              {message.from === "bot" && (
                <img
                  src={botIcon}
                  alt="Bot Avatar"
                  className="chatbot-avatar"
                />
              )}
              <span
                className={`px-4 py-3 rounded-xl inline-block ${
                  message.from === "bot"
                    ? "rounded-bl-none bg-gray-100 text-gray-600"
                    : "rounded-br-none bg-blue-500 text-white"
                }`}
              >
                {message.text}
              </span>
              {message.from === "user" && (
                <img
                  src={userIcon}
                  alt="User Avatar"
                  className="chatbot-avatar"
                />
              )}
            </div>
          </div>
        ))}
        {botTyping && (
          <div className="flex items-end">
            <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
              <div>
                <img
                  src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                  alt="Typing..."
                  className="w-16 ml-6"
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbox-input-container">
        <textarea
          className="chatbox-input"
          placeholder="Say something... (max 5 words)"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          ref={textareaRef}
        />
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
      </div>

      {wordLimitExceeded && (
        <div className="word-limit-warning">
          You have exceeded the 5-word limit!
        </div>
      )}
    </div>
  );
}
