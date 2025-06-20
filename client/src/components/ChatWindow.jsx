import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import { io } from "socket.io-client";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000");

export default function ChatWindow({ selectedUser }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.emit("add-user", user._id);
  }, [user]);

  useEffect(() => {
    const setupChat = async () => {
      const { data } = await API.post("/conversations", {
        senderId: user._id,
        receiverId: selectedUser._id,
      });
      setConversationId(data._id);

      const res = await API.get(`/messages/${data._id}`);
      setMessages(res.data);
    };

    if (selectedUser) {
      setupChat();
    }

    socket.on("msg-receive", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: selectedUser,
          text: msg.text,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    socket.on("typing", () => {
      console.log(" Received typing");
      setIsTyping(true);
    });
    socket.on("stop-typing", () => {
      console.log(" Received stop-typing");
      setIsTyping(false);
    });

    return () => {
      socket.off("msg-receive");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [selectedUser]);

  const handleSend = async (text) => {
    const message = {
      sender: user._id,
      text,
      conversationId,
    };

    const { data } = await API.post("/messages", message);
    setMessages((prev) => [...prev, data]);

    socket.emit("send-msg", {
      to: selectedUser._id,
      from: user._id,
      text,
    });
  };

  useEffect(() => {
    if (!isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] border rounded shadow bg-white">
      <div className="px-4 py-2 border-b bg-gray-100 font-semibold">
        Chat with {selectedUser.username}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 pb-6 space-y-2 bg-gray-50 no-scrollbar">
        {messages.map((msg, i) => {
          const isMine = msg.sender._id === user._id || msg.sender === user._id;
          const senderName = isMine
            ? "You"
            : msg.sender.username || selectedUser.username;

          return (
            <div
              key={i}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg shadow ${
                  isMine
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <span className="block text-xs font-medium mb-1">
                  {senderName}
                </span>
                <span className="text-sm">{msg.text}</span>
                <span className="block text-[10px] text-right mt-1 text-gray-400">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="text-sm italic text-gray-500 mb-2 ">
            {selectedUser.username} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        selectedUser={selectedUser}
        socket={socket}
      />
    </div>
  );
}
